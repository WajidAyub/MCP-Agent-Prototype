/**
 * Anthropic API wrapper — client-side, BYOK (Bring Your Own Key).
 * Uses the Anthropic Messages API directly from the browser.
 */

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Build the system prompt for the agent.
 * @param {string[]} toolNames
 * @returns {string}
 */
function buildSystemPrompt(toolNames) {
  return `You are an elite enterprise data analyst AI assistant connected via the Model Context Protocol (MCP).
You have been granted read access to the following enterprise services: ${toolNames.join(', ')}.
The user has submitted a natural language query. You have autonomously:
1. Parsed their intent
2. Discovered the required tools via MCP
3. Connected to the relevant enterprise services
4. Retrieved the necessary data

Now generate a comprehensive, professional enterprise report in Markdown.

Your report MUST include:
## Executive Summary
A 2-3 sentence summary of key findings.

## Key Metrics
A table with 4-6 plausible, data-rich metrics (use realistic-sounding numbers consistent with the query).

## Data Insights
3-5 bulleted insights derived from the data. Be specific and analytical.

## Trend Analysis
A brief paragraph on trends, with inline numbers/percentages.

## SQL Query Used
Show the primary SQL query that was used to retrieve the core data (in a code block).

## Recommended Actions
3-4 numbered next steps.

## MCP Tool Execution Log
A brief log showing which tools were called and in what order (as a code block using JSON-like format).

Use professional, data-driven language. Include realistic-sounding numbers (revenue in $M, percentages, counts).
Keep the report concise but comprehensive — aim for ~500-700 words.`;
}

/**
 * Build the user message from the query and active tools.
 * @param {string} query
 * @param {string[]} toolNames
 * @returns {string}
 */
function buildUserMessage(query, toolNames) {
  return `User Query: "${query}"

Active MCP Tools: ${toolNames.join(', ')}

Please generate the enterprise report now.`;
}

/**
 * Stream a Claude response.
 * @param {string} apiKey
 * @param {string} query
 * @param {string[]} toolNames
 * @param {function} onChunk  called with each text delta string
 * @param {function} onDone   called when streaming is complete
 * @param {function} onError  called with error message
 */
export async function streamReport({ apiKey, query, toolNames, onChunk, onDone, onError }) {
  try {
    const response = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1500,
        stream: true,
        system: buildSystemPrompt(toolNames),
        messages: [
          { role: 'user', content: buildUserMessage(query, toolNames) },
        ],
      }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody?.error?.message || `HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep incomplete line

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') { onDone(); return; }
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
            onChunk(parsed.delta.text);
          }
          if (parsed.type === 'message_stop') { onDone(); return; }
        } catch (_) { /* skip malformed lines */ }
      }
    }
    onDone();
  } catch (err) {
    onError(err.message || 'Unknown error');
  }
}
