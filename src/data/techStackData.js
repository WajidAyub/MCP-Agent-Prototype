/**
 * techStackData.js
 * Deep-dive content for every clickable node in the Part 3 Tech Stack visualizer.
 */

export const LAYERS = [
  {
    id: 'frontend',
    number: 1,
    label: 'Layer 1 — Frontend',
    sub: 'React / Next.js · Streaming SSE · Chat UI',
    color: '#4b5563',
    bgColor: 'rgba(75,85,99,0.22)',
    borderColor: 'rgba(75,85,99,0.55)',
    glowColor: 'rgba(156,163,175,0.2)',
    nodes: [
      {
        id: 'react',
        label: 'React / Next.js',
        icon: '⚛️',
        what: 'The chat UI is a Next.js 14 App Router app using React Server Components for the shell and a client component for the streaming chat window.',
        how: [
          'Bootstrap with `npx create-next-app@latest --app`',
          'Use `useChat` hook (Vercel AI SDK) or roll your own with `ReadableStream`',
          'App Router layout wraps the chat panel in a `<Suspense>` boundary',
          'Streaming tokens arrive via Server-Sent Events from the `/api/chat` route',
        ],
        code: `// app/api/chat/route.ts
import Anthropic from '@anthropic-ai/sdk';
export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const client = new Anthropic();

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-5',
    max_tokens: 2048,
    messages,
  });

  return new Response(stream.toReadableStream());
}`,
        install: 'npx create-next-app@latest my-mcp-app --app --ts',
        connects: 'Sends POST to Layer 2 backend → receives SSE token stream → renders in Chat UI',
      },
      {
        id: 'sse',
        label: 'Streaming SSE',
        icon: '📡',
        what: 'Server-Sent Events stream Claude\'s token output from the backend to the browser in real time, enabling the typewriter effect without polling.',
        how: [
          'Backend wraps Anthropic stream in a `TransformStream`',
          'Set `Content-Type: text/event-stream` header',
          'Frontend uses `EventSource` or `fetch` with `ReadableStream` reader',
          'Each `data:` line is a JSON chunk with `delta.text`',
        ],
        code: `// Frontend: reading the SSE stream
const res = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ messages }),
});

const reader = res.body!.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value);
  // parse "data: {...}" lines
  for (const line of chunk.split('\\n')) {
    if (!line.startsWith('data: ')) continue;
    const json = JSON.parse(line.slice(6));
    if (json.delta?.text) setOutput(p => p + json.delta.text);
  }
}`,
        install: '# No install needed — native browser API + Next.js edge runtime',
        connects: 'Bridges Layer 2 (agent backend stream) → Layer 1 (React state update)',
      },
      {
        id: 'chatui',
        label: 'Chat UI',
        icon: '💬',
        what: 'A full-featured chat interface with message history, user/assistant bubbles, streaming cursor, markdown rendering, and tool-call transparency panels.',
        how: [
          'Message list renders from a `messages: Message[]` state array',
          'Each assistant message streams tokens into the last bubble',
          'Tool-call events surface as collapsible "Agent called: PostgreSQL" cards',
          'Markdown is rendered via `react-markdown` + `remark-gfm`',
        ],
        code: `// components/ChatBubble.tsx
export function ChatBubble({ role, content, toolCalls }) {
  return (
    <div className={role === 'user' ? 'bubble-user' : 'bubble-assistant'}>
      {toolCalls?.map(tc => (
        <ToolCallCard key={tc.id} tool={tc} />
      ))}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}`,
        install: 'npm install react-markdown remark-gfm',
        connects: 'Displays output from Layer 2 ReAct loop. Tool-call cards link to Layer 3 MCP servers.',
      },
    ],
  },

  {
    id: 'backend',
    number: 2,
    label: 'Layer 2 — Agent Backend',
    sub: 'Python / Node.js · Anthropic SDK · Tool use loop · State manager',
    color: '#5b21b6',
    bgColor: 'rgba(91,33,182,0.2)',
    borderColor: 'rgba(91,33,182,0.55)',
    glowColor: 'rgba(139,92,246,0.25)',
    nodes: [
      {
        id: 'sdk',
        label: 'Anthropic SDK',
        icon: '🤖',
        what: 'The official Anthropic Python/TypeScript SDK handles authentication, request serialization, streaming, and tool_use content block parsing.',
        how: [
          'Install `@anthropic-ai/sdk` (TS) or `anthropic` (Python)',
          'Pass `tools: [...]` array with JSON Schema definitions',
          'Detect `stop_reason === "tool_use"` to enter the tool loop',
          'Append `tool_result` blocks to message history and re-call the API',
        ],
        code: `import Anthropic from '@anthropic-ai/sdk';
const client = new Anthropic();

const tools = [{
  name: 'query_database',
  description: 'Run a SQL query on the sales database',
  input_schema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Valid SQL SELECT' }
    },
    required: ['query'],
  },
}];

const response = await client.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 2048,
  tools,
  messages: conversationHistory,
});`,
        install: 'npm install @anthropic-ai/sdk',
        connects: 'Calls Layer 3 MCP servers when stop_reason = "tool_use". Returns results to continue the conversation.',
      },
      {
        id: 'toolloop',
        label: 'Tool use loop',
        icon: '🔄',
        what: 'The agentic loop that implements the ReAct pattern — runs until Claude returns stop_reason="end_turn" with no more tool calls needed.',
        how: [
          'Start with user message → call Claude API',
          'If stop_reason = "tool_use": extract tool name + input',
          'Route to the matching MCP server via the MCP client',
          'Append tool_result to history → call Claude again',
          'Repeat until stop_reason = "end_turn"',
        ],
        code: `async function agentLoop(userMessage: string) {
  const messages = [{ role: 'user', content: userMessage }];

  while (true) {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4096,
      tools: mcpTools,      // fetched from MCP servers
      messages,
    });

    messages.push({ role: 'assistant', content: response.content });

    if (response.stop_reason === 'end_turn') break;

    // Process all tool_use blocks
    const toolResults = [];
    for (const block of response.content) {
      if (block.type !== 'tool_use') continue;
      const result = await mcpClient.callTool(block.name, block.input);
      toolResults.push({
        type: 'tool_result',
        tool_use_id: block.id,
        content: JSON.stringify(result),
      });
    }
    messages.push({ role: 'user', content: toolResults });
  }
  return messages.at(-1);
}`,
        install: '# Part of the Anthropic SDK — no extra install needed',
        connects: 'Orchestrates calls between Layer 2 (Claude) and Layer 3 (MCP servers) in a loop.',
      },
      {
        id: 'statemanager',
        label: 'Conversation state manager',
        icon: '🗄️',
        what: 'Persists multi-turn conversation history per session so the agent maintains context across requests without re-sending the full history each time.',
        how: [
          'Session ID generated on first request (UUID v4)',
          'Messages stored in Redis (production) or in-memory Map (dev)',
          'Each request loads history by session ID, appends new messages, saves back',
          'Implement a sliding window to stay within Claude\'s context limit',
          'Store tool call metadata alongside messages for audit logging',
        ],
        code: `// State manager (Redis-backed)
import { createClient } from 'redis';
const redis = createClient({ url: process.env.REDIS_URL });

export async function getHistory(sessionId: string) {
  const raw = await redis.get(\`session:\${sessionId}\`);
  return raw ? JSON.parse(raw) : [];
}

export async function appendMessages(sessionId: string, msgs: Message[]) {
  const history = await getHistory(sessionId);
  const updated = [...history, ...msgs].slice(-40); // sliding window
  await redis.setEx(\`session:\${sessionId}\`, 3600, JSON.stringify(updated));
  return updated;
}`,
        install: 'npm install redis uuid',
        connects: 'Feeds history to Anthropic SDK (Layer 2) and preserves ReAct loop context across turns.',
      },
    ],
  },

  {
    id: 'mcp',
    number: 3,
    label: 'Layer 3 — MCP Servers',
    sub: 'PostgreSQL MCP · Slack MCP · Google Sheets MCP · Custom MCP tools',
    color: '#065f46',
    bgColor: 'rgba(6,95,70,0.2)',
    borderColor: 'rgba(16,185,129,0.45)',
    glowColor: 'rgba(16,185,129,0.2)',
    nodes: [
      {
        id: 'pg-mcp',
        label: 'PostgreSQL MCP',
        icon: '🐘',
        what: 'An MCP server that exposes your PostgreSQL database as tools Claude can call — including schema inspection, read queries, and (optionally) write operations.',
        how: [
          'Use `@modelcontextprotocol/server-postgres` (official package)',
          'Provide `DATABASE_URL` env var pointing to your Postgres instance',
          'The server auto-exposes: `query`, `list_tables`, `describe_table` tools',
          'Add to `mcp_servers` config in your Anthropic API call',
        ],
        code: `// mcp-servers/postgres.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const server = new McpServer({ name: 'postgres', version: '1.0.0' });

server.tool('query_sales', { query: z.string() }, async ({ query }) => {
  const { rows } = await pool.query(query);
  return { content: [{ type: 'text', text: JSON.stringify(rows) }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);`,
        install: 'npm install @modelcontextprotocol/sdk pg',
        connects: 'Exposes Layer 4 (PostgreSQL) as callable tools for Layer 2 (agent tool loop).',
      },
      {
        id: 'slack-mcp',
        label: 'Slack MCP',
        icon: '💬',
        what: 'An MCP server that lets Claude send messages, create channels, and read threads from Slack using the official Slack Web API.',
        how: [
          'Create a Slack App at api.slack.com with `chat:write`, `channels:read` scopes',
          'Set `SLACK_BOT_TOKEN` env var (starts with `xoxb-`)',
          'Expose tools: `post_message`, `list_channels`, `get_thread`',
          'Use `@slack/web-api` to make authenticated Slack API calls',
        ],
        code: `import { WebClient } from '@slack/web-api';
const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

server.tool('post_slack_message',
  { channel: z.string(), text: z.string() },
  async ({ channel, text }) => {
    const result = await slack.chat.postMessage({ channel, text });
    return {
      content: [{
        type: 'text',
        text: \`Message posted to \${channel}: \${result.ts}\`
      }]
    };
  }
);`,
        install: 'npm install @slack/web-api @modelcontextprotocol/sdk',
        connects: 'Bridges Layer 2 tool calls → Layer 4 Slack API. Agent can notify teams autonomously.',
      },
      {
        id: 'sheets-mcp',
        label: 'Google Sheets MCP',
        icon: '📊',
        what: 'An MCP server that allows Claude to read from and write to Google Sheets — perfect for report export, data input, and dashboard updates.',
        how: [
          'Create a Google Cloud project + enable Sheets API',
          'Create a Service Account and download JSON key',
          'Share your target Spreadsheet with the service account email',
          'Expose tools: `read_range`, `write_range`, `append_rows`, `create_sheet`',
        ],
        code: `import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_KEY_FILE,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });

server.tool('read_sheet',
  { spreadsheetId: z.string(), range: z.string() },
  async ({ spreadsheetId, range }) => {
    const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    return { content: [{ type: 'text', text: JSON.stringify(res.data.values) }] };
  }
);`,
        install: 'npm install googleapis @modelcontextprotocol/sdk',
        connects: 'Layer 2 agent calls this to export reports to Layer 4 Google Sheets data store.',
      },
      {
        id: 'custom-mcp',
        label: 'Custom MCP tools',
        icon: '🔧',
        what: 'Build your own MCP server to expose any internal API, proprietary database, or business logic as a Claude-callable tool — the MCP SDK makes this straightforward.',
        how: [
          'Extend `McpServer` from `@modelcontextprotocol/sdk`',
          'Register tools with `server.tool(name, schema, handler)`',
          'Use Zod schemas for automatic input validation',
          'Deploy as a sidecar process connected via stdio or HTTP',
          'Register in `mcp_servers` array in the Anthropic API call',
        ],
        code: `import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'my-custom-tools',
  version: '1.0.0',
});

// Register any tool you want
server.tool(
  'get_crm_deals',
  {
    stage: z.enum(['qualified', 'proposal', 'closed']),
    limit: z.number().default(10),
  },
  async ({ stage, limit }) => {
    const deals = await myCRM.getDeals({ stage, limit });
    return { content: [{ type: 'text', text: JSON.stringify(deals) }] };
  }
);

// Connect via stdio (for local dev) or HTTP (for production)
await server.connect(new StdioServerTransport());`,
        install: 'npm install @modelcontextprotocol/sdk zod',
        connects: 'Any custom Layer 4 data source can be wired to the Layer 2 agent tool loop.',
      },
      {
        id: 'github-mcp',
        label: 'GitHub MCP',
        icon: '🐙',
        what: 'An MCP server that exposes GitHub as agent-callable tools — listing commits, checking CI/CD status, reading PR reviews, and triggering deployments via GitHub Actions. The agent never holds a personal access token directly.',
        how: [
          'Use the official `@modelcontextprotocol/server-github` package (or build custom with `@octokit/rest`)',
          'Set `GITHUB_TOKEN` env var on the MCP server only — never in the agent codebase',
          'Expose tools: `list_commits`, `get_pr_status`, `trigger_workflow`, `get_build_log`',
          'Scope the token to minimum required permissions (`repo:read`, `actions:read`)',
          'Register in `mcp_servers` in the Anthropic API call alongside other MCP servers',
        ],
        code: `import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Octokit } from '@octokit/rest';
import { z } from 'zod';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const server = new McpServer({ name: 'github', version: '1.0.0' });

server.tool(
  'get_deploy_status',
  { owner: z.string(), repo: z.string() },
  async ({ owner, repo }) => {
    const { data } = await octokit.actions.listWorkflowRunsForRepo({
      owner, repo, per_page: 5,
    });
    const summary = data.workflow_runs
      .map(r => \`\${r.name}: \${r.conclusion ?? r.status} (\${r.head_branch})\`)
      .join('\\n');
    return { content: [{ type: 'text', text: summary }] };
  }
);

await server.connect(new StdioServerTransport());`,
        install: 'npm install @modelcontextprotocol/sdk @octokit/rest zod',
        connects: '⬆ Wraps Layer 4 GitHub API. The agent calls tools like "get_deploy_status" — the token and Octokit client live only on this MCP server.',
      },
    ],
  },

  {
    id: 'datastore',
    number: 4,
    label: 'Layer 4 — Enterprise Data Stores',
    sub: 'Normal APIs & databases — the MCP layer abstracts them so the agent never calls these directly',
    abstracted: true,          // visual badge flag
    color: '#374151',
    bgColor: 'rgba(55,65,81,0.2)',
    borderColor: 'rgba(107,114,128,0.4)',
    glowColor: 'rgba(156,163,175,0.15)',
    nodes: [
      {
        id: 'postgresql',
        label: 'PostgreSQL',
        icon: '🐘',
        what: 'A normal relational database — just like any app would use. It holds sales transactions, user records, product catalog, and analytics data. The agent never connects to it directly; the Layer 3 PostgreSQL MCP server is the only thing that touches it, using a read-only role. To the agent, Postgres is simply a tool named "query_database" — it has no idea there\'s SQL or a connection pool underneath.',
        how: [
          'Use `pg` (Node.js) or `psycopg2` (Python) driver — inside the MCP server only',
          'Store connection string in `DATABASE_URL` env var on the MCP server',
          'Create a read-only Postgres role (`mcp_reader`) — the MCP server uses this, not a superuser',
          'Add `pgvector` extension for embedding-based semantic search if needed',
          'Use connection pooling (`pgBouncer` or `pg.Pool`) — the agent never waits on DB connections',
        ],
        code: `-- Create a read-only MCP user
CREATE ROLE mcp_reader WITH LOGIN PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE salesdb TO mcp_reader;
GRANT USAGE ON SCHEMA public TO mcp_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO mcp_reader;

-- Enable pgvector for semantic search
CREATE EXTENSION vector;
ALTER TABLE products ADD COLUMN embedding vector(1536);

-- Example: query the MCP agent will run
SELECT region, SUM(revenue) as total, COUNT(*) as deals
FROM sales
WHERE closed_at >= NOW() - INTERVAL '90 days'
GROUP BY region ORDER BY total DESC;`,
        install: 'npm install pg  # or: pip install psycopg2-binary\n# Install goes on the MCP server, NOT in the agent codebase',
        connects: '⬆ Accessed only by the Layer 3 PostgreSQL MCP server. The agent (Layer 2) never imports pg or knows SQL exists — it just calls the "query_database" tool and gets back JSON rows.',
      },
      {
        id: 'crm',
        label: 'CRM APIs',
        icon: '👥',
        what: 'Standard Salesforce / HubSpot / Pipedrive REST APIs — the same ones any web app would call. The agent has zero knowledge of SOQL, OAuth tokens, or CRM data models. A custom MCP server (Layer 3) wraps all of that and exposes a single clean tool like "get_open_deals" or "update_contact". You can even swap CRM providers without touching a line of agent code.',
        how: [
          'Auth lives on the MCP server: store `CLIENT_ID`, `CLIENT_SECRET`, `INSTANCE_URL` there',
          'Use OAuth2 client credentials flow — the MCP server handles token refresh',
          'Wrap in a custom MCP server that normalises across CRM providers',
          'Cache frequently-read data (e.g., account list) with a 5-min TTL in the MCP layer',
          'Handle rate limits with exponential backoff — invisible to the agent',
        ],
        code: `// Salesforce SOQL query via jsforce
import jsforce from 'jsforce';

const conn = new jsforce.Connection({
  loginUrl: process.env.SF_LOGIN_URL,
});
await conn.login(process.env.SF_USER, process.env.SF_PASSWORD);

const result = await conn.query(\`
  SELECT Id, Name, Amount, StageName, CloseDate
  FROM Opportunity
  WHERE StageName != 'Closed Lost'
    AND CloseDate = THIS_QUARTER
  ORDER BY Amount DESC
  LIMIT 50
\`);
console.log(result.records);`,
        install: 'npm install jsforce  # Salesforce — runs on the MCP server\nnpm install @hubspot/api-client  # HubSpot — same',
        connects: '⬆ Wrapped entirely by a Layer 3 custom MCP server. The agent only sees tool names like "get_open_deals". Data flow: CRM REST API → MCP server → tool_result JSON → agent.',
      },
      {
        id: 'gsheets',
        label: 'Google Sheets',
        icon: '📊',
        what: 'Plain Google Sheets — nothing special about it from the agent\'s perspective. The agent calls a tool named "write_report_to_sheet" and the Layer 3 Google Sheets MCP server translates that into authenticated Google API calls. The agent never holds a service account key or knows about spreadsheet IDs.',
        how: [
          'Enable Google Sheets API in Google Cloud Console — on the MCP server\'s GCP project',
          'Use a Service Account JSON key stored as an env var on the MCP server',
          'Share target spreadsheets with the service account email address',
          'MCP server implements `read_range`, `write_range`, `append_rows` tools',
          'The agent calls these by name — no googleapis import in agent code',
        ],
        code: `# Python: write agent report to Google Sheets
import gspread
from google.oauth2.service_account import Credentials

creds = Credentials.from_service_account_file(
    'service-account.json',
    scopes=['https://www.googleapis.com/auth/spreadsheets']
)
gc = gspread.authorize(creds)
sh = gc.open_by_key(SPREADSHEET_ID)
ws = sh.worksheet('Q2 Report')

# Write the agent's generated report data
ws.update('A1', [['Metric', 'Value', 'Δ vs Q1'],
                  ['Revenue', '$4.82M', '+12.4%'],
                  ['Deals',   '1,247',  '+89'   ]])`,
        install: 'pip install gspread google-auth  # on the MCP server\n# or: npm install googleapis       # on the MCP server',
        connects: '⬆ Accessed only via the Layer 3 Google Sheets MCP server. The agent requests a write operation; the MCP server handles auth, range formatting, and the actual API call.',
      },
      {
        id: 'slackapi',
        label: 'Slack API',
        icon: '📣',
        what: 'The standard Slack Web API — nothing the agent ever touches directly. When the agent decides to notify a team, it calls the "post_slack_message" tool. The Layer 3 Slack MCP server holds the bot token, formats the Block Kit payload, and makes the REST call. The agent just passes a channel name and a message string.',
        how: [
          'Create a Slack App at api.slack.com/apps — for the MCP server bot',
          'Add Bot Token Scopes: `chat:write`, `channels:read`, `files:write`',
          'Store `SLACK_BOT_TOKEN` (xoxb-…) as an env var on the MCP server only',
          'MCP server wraps `chat.postMessage` with Block Kit formatting',
          'The agent never sees the token or the HTTP call — just a tool result',
        ],
        code: `// Post a rich Block Kit message to Slack
const response = await fetch('https://slack.com/api/chat.postMessage', {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${process.env.SLACK_BOT_TOKEN}\`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    channel: '#sales-alerts',
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: '📊 Q2 Sales Alert' }},
      { type: 'section', text: {
          type: 'mrkdwn',
          text: '*Revenue:* $4.82M (+12.4%)\n*At-risk accounts:* 3 flagged',
      }},
      { type: 'actions', elements: [
          { type: 'button', text: { type: 'plain_text', text: 'View Report' },
            url: 'https://sheets.google.com/...' }
      ]},
    ],
  }),
});`,
        install: 'npm install @slack/web-api  # on the MCP server only',
        connects: '⬆ Called only by the Layer 3 Slack MCP server. The agent issues a tool call with {channel, text}; the MCP server handles the Slack REST API. Bot token never leaves the MCP layer.',
      },
      {
        id: 'email',
        label: 'Email / Calendar',
        icon: '📅',
        what: 'Standard Gmail / Google Calendar APIs (or Microsoft Graph). The agent doesn\'t know what an OAuth2 access token is — it calls a tool like "send_email" with a recipient and subject, and the Layer 3 Email MCP server handles authentication, MIME encoding, and the actual API request. You can switch from Gmail to Outlook by updating only the MCP server.',
        how: [
          'Gmail: enable API + service account with domain-wide delegation — on the MCP server',
          'Outlook: register Azure AD app, use Microsoft Graph — on the MCP server',
          'Expose as MCP tools: `send_email`, `create_event`, `list_events`, `get_thread`',
          'Rate limiting and retry logic live in the MCP server, not the agent',
          'The agent simply calls the tool with subject/body/recipient — MCP does the rest',
        ],
        code: `// Gmail API — send an email via Google API client
import { google } from 'googleapis';

const gmail = google.gmail({ version: 'v1', auth });

const raw = Buffer.from(
  \`To: cto@company.com\r\n\` +
  \`Subject: Q2 Sales Report — Agent Generated\r\n\` +
  \`Content-Type: text/html\r\n\r\n\` +
  \`<h1>Q2 Report</h1><p>Revenue: $4.82M (+12.4%)</p>\`
).toString('base64url');

await gmail.users.messages.send({
  userId: 'me',
  requestBody: { raw },
});`,
        install: 'npm install googleapis               # Gmail + Calendar — MCP server only\n# or: npm install @microsoft/microsoft-graph-client  # Outlook — MCP server only',
        connects: '⬆ Called only via the Layer 3 Email/Calendar MCP tool. OAuth tokens, MIME encoding, and rate limiting are all encapsulated there — the agent\'s codebase has zero email-specific dependencies.',
      },
      {
        id: 'github',
        label: 'GitHub API',
        icon: '🐙',
        what: 'The standard GitHub REST and GraphQL APIs (github.com/orgs/…). The agent never holds a GitHub token or calls Octokit directly — the Layer 3 GitHub MCP server is the only thing that authenticates. The agent sees only tool names like "get_deploy_status" or "list_failing_checks".',
        how: [
          'Create a GitHub Personal Access Token or install a GitHub App for production',
          'Store `GITHUB_TOKEN` as env var on the MCP server only — never in the agent',
          'Scope to minimum permissions: `repo:read`, `actions:read`, `checks:read`',
          'For write operations (trigger workflow, merge PR) scope `actions:write` separately',
          'Use GitHub Apps + installation tokens for multi-repo enterprise deployments',
        ],
        code: `// GitHub Actions — trigger a workflow dispatch
const response = await fetch(
  'https://api.github.com/repos/org/repo/actions/workflows/deploy.yml/dispatches',
  {
    method: 'POST',
    headers: {
      Authorization: \`Bearer \${process.env.GITHUB_TOKEN}\`,
      Accept: 'application/vnd.github+json',
    },
    body: JSON.stringify({ ref: 'main', inputs: { environment: 'production' } }),
  }
);
console.log(response.status === 204 ? 'Workflow triggered ✓' : 'Error');`,
        install: 'npm install @octokit/rest  # on the MCP server only',
        connects: '⬆ Called only through the Layer 3 GitHub MCP server. PAT never leaves the MCP layer. Agent calls "trigger_deployment" — MCP handles auth and the REST call.',
      },
    ],
  },
];
