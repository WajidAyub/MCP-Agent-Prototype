import { useState } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  position: relative;
  z-index: 1;
  padding: 100px 40px;
  max-width: 1140px;
  margin: 0 auto;
  
`;

const Reveal = styled.div`
  opacity: 1;
  transform: translateY(0);
`;

const Eyebrow = styled.div`
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 3px;
  color: var(--violet2);
  text-transform: uppercase;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;

  &::after {
    content: '';
    flex: 1;
    max-width: 48px;
    height: 4px;
    background: var(--border);
    opacity: 1;
  }
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(34px, 5vw, 52px);
  letter-spacing: 2px;
  color: var(--white);
  line-height: 1.1;
  margin-bottom: 16px;
`;

const Sub = styled.p`
  font-size: 15px;
  color: var(--gray);
  max-width: 560px;
  line-height: 1.7;
  font-weight: 300;
`;

const DemoWrap = styled.div`
  margin-top: 60px;
  border-radius: 0;
  border: 3px solid var(--border);
  box-shadow: 8px 8px 0 0 var(--border);
  background: var(--bg2);
  overflow: hidden;
  opacity: 1;
  transform: translateY(0);
`;

const DemoTopbar = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  background: var(--bg2);
  padding: 0;
  overflow-x: auto;
  border-bottom: 3px solid var(--border);
`;

const DemoTab = styled.button`
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1px;
  padding: 16px 24px;
  color: ${({ $active }) => ($active ? 'var(--bg2)' : 'var(--border)')};
  background: ${({ $active }) => ($active ? 'var(--violet)' : 'transparent')};
  font-weight: bold;
  cursor: pointer;
  border: none;
  border-right: 3px solid var(--border);
  text-transform: uppercase;
  transition: color .2s, background .2s;
  white-space: nowrap;

  &:hover {
    ${({ $active }) => !$active && `
      background: var(--border);
      color: var(--bg2);
    `}
  }
`;

const DemoBody = styled.div`
  background: var(--bg);
  padding: 32px;
  min-height: 320px;
  border-radius: 0;
  margin: 0;
`;

const CodeBlock = styled.pre`
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.8;
  color: var(--gray);
  display: block;
  overflow-x: auto;

  .kw { color: var(--violet); }
  .fn { color: var(--cyan); }
  .st { color: var(--green); }
  .cm { color: var(--gray); }
  .nb { color: var(--border); }
  .wh { color: var(--border); }
`;

export default function CodeDemo() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Section id="demo">
      <Reveal>
        <Eyebrow>Implementation</Eyebrow>
        <Title>THE CODE</Title>
        <Sub>The entire agent loop in Python — less than 50 lines that matter.</Sub>
      </Reveal>

      <DemoWrap>
        <DemoTopbar>
          <DemoTab $active={activeTab === 0} onClick={() => setActiveTab(0)}>agent.py</DemoTab>
          <DemoTab $active={activeTab === 1} onClick={() => setActiveTab(1)}>tools.py</DemoTab>
          <DemoTab $active={activeTab === 2} onClick={() => setActiveTab(2)}>mcp_connect.py</DemoTab>
        </DemoTopbar>
        <DemoBody>
          {activeTab === 0 && (
            <CodeBlock dangerouslySetInnerHTML={{ __html: `<span class="cm"># MCP-Powered AI Assistant — Core Agent Loop</span>

<span class="kw">import</span> <span class="wh">os</span>
<span class="kw">from</span> <span class="wh">anthropic</span> <span class="kw">import</span> <span class="fn">Anthropic</span>

<span class="wh">client</span> = <span class="fn">Anthropic</span>(api_key=<span class="wh">os</span>.environ[<span class="st">"ANTHROPIC_API_KEY"</span>])

<span class="kw">def</span> <span class="fn">run_agent</span>(<span class="wh">user_query</span>: <span class="wh">str</span>) -&gt; <span class="wh">str</span>:
    <span class="wh">messages</span> = [{ <span class="st">"role"</span>: <span class="st">"user"</span>, <span class="st">"content"</span>: <span class="wh">user_query</span> }]

    <span class="kw">while</span> <span class="nb">True</span>:
        <span class="wh">response</span> = <span class="wh">client</span>.messages.<span class="fn">create</span>(
            model=<span class="st">"claude-sonnet-4-6"</span>,
            max_tokens=<span class="nb">4096</span>,
            tools=<span class="wh">TOOLS</span>,
            messages=<span class="wh">messages</span>
        )

        <span class="cm"># ── Exit: agent has enough data ──</span>
        <span class="kw">if</span> <span class="wh">response</span>.stop_reason == <span class="st">"end_turn"</span>:
            <span class="kw">return</span> <span class="wh">response</span>.content[<span class="nb">0</span>].text

        <span class="cm"># ── Continue: execute requested tools ──</span>
        <span class="wh">messages</span>.<span class="fn">append</span>({ <span class="st">"role"</span>: <span class="st">"assistant"</span>, <span class="st">"content"</span>: <span class="wh">response</span>.content })

        <span class="wh">tool_results</span> = []
        <span class="kw">for</span> <span class="wh">block</span> <span class="kw">in</span> <span class="wh">response</span>.content:
            <span class="kw">if</span> <span class="wh">block</span>.type == <span class="st">"tool_use"</span>:
                <span class="wh">result</span> = <span class="fn">execute_tool</span>(<span class="wh">block</span>.name, <span class="wh">block</span>.input)
                <span class="wh">tool_results</span>.<span class="fn">append</span>({
                    <span class="st">"type"</span>:         <span class="st">"tool_result"</span>,
                    <span class="st">"tool_use_id"</span>:  <span class="wh">block</span>.id,
                    <span class="st">"content"</span>:      <span class="wh">result</span>
                })

        <span class="wh">messages</span>.<span class="fn">append</span>({ <span class="st">"role"</span>: <span class="st">"user"</span>, <span class="st">"content"</span>: <span class="wh">tool_results</span> })` }} />
          )}
          
          {activeTab === 1 && (
            <CodeBlock dangerouslySetInnerHTML={{ __html: `<span class="cm"># Tool definitions — what Claude can call</span>

<span class="wh">TOOLS</span> = [
    {
        <span class="st">"name"</span>: <span class="st">"query_database"</span>,
        <span class="st">"description"</span>: <span class="st">"Execute SQL against PostgreSQL sales database"</span>,
        <span class="st">"input_schema"</span>: {
            <span class="st">"type"</span>: <span class="st">"object"</span>,
            <span class="st">"properties"</span>: {
                <span class="st">"query"</span>: { <span class="st">"type"</span>: <span class="st">"string"</span>, <span class="st">"description"</span>: <span class="st">"SQL query"</span> }
            },
            <span class="st">"required"</span>: [<span class="st">"query"</span>]
        }
    },
    {
        <span class="st">"name"</span>: <span class="st">"send_slack_message"</span>,
        <span class="st">"description"</span>: <span class="st">"Post message to a Slack channel"</span>,
        <span class="st">"input_schema"</span>: {
            <span class="st">"type"</span>: <span class="st">"object"</span>,
            <span class="st">"properties"</span>: {
                <span class="st">"channel"</span>: { <span class="st">"type"</span>: <span class="st">"string"</span> },
                <span class="st">"message"</span>: { <span class="st">"type"</span>: <span class="st">"string"</span> }
            },
            <span class="st">"required"</span>: [<span class="st">"channel"</span>, <span class="st">"message"</span>]
        }
    }
]

<span class="kw">def</span> <span class="fn">execute_tool</span>(<span class="wh">name</span>: <span class="wh">str</span>, <span class="wh">inputs</span>: <span class="wh">dict</span>) -&gt; <span class="wh">str</span>:
    <span class="cm"># Route to real implementation</span>
    <span class="kw">if</span>   <span class="wh">name</span> == <span class="st">"query_database"</span>:    <span class="kw">return</span> <span class="fn">db_query</span>(<span class="wh">inputs</span>[<span class="st">"query"</span>])
    <span class="kw">elif</span> <span class="wh">name</span> == <span class="st">"send_slack_message"</span>: <span class="kw">return</span> <span class="fn">slack_post</span>(<span class="wh">inputs</span>)
    <span class="kw">raise</span> <span class="nb">ValueError</span>(<span class="st">f"Unknown tool: {name}"</span>)` }} />
          )}

          {activeTab === 2 && (
            <CodeBlock dangerouslySetInnerHTML={{ __html: `<span class="cm"># Real MCP server connection (production)</span>

<span class="kw">import</span> <span class="wh">asyncio</span>
<span class="kw">from</span> <span class="wh">mcp</span> <span class="kw">import</span> <span class="fn">ClientSession</span>
<span class="kw">from</span> <span class="wh">mcp.client.streamable_http</span> <span class="kw">import</span> <span class="fn">streamablehttp_client</span>

<span class="kw">async def</span> <span class="fn">connect_mcp</span>(<span class="wh">server_url</span>: <span class="wh">str</span>):
    <span class="kw">async with</span> <span class="fn">streamablehttp_client</span>(url=<span class="wh">server_url</span>) <span class="kw">as</span> (<span class="wh">read</span>, <span class="wh">write</span>, <span class="wh">_</span>):
        <span class="kw">async with</span> <span class="fn">ClientSession</span>(<span class="wh">read</span>, <span class="wh">write</span>) <span class="kw">as</span> <span class="wh">session</span>:

            <span class="kw">await</span> <span class="wh">session</span>.<span class="fn">initialize</span>()

            <span class="cm"># ── Dynamic tool discovery ──────────────────</span>
            <span class="wh">tools_resp</span> = <span class="kw">await</span> <span class="wh">session</span>.<span class="fn">list_tools</span>()
            <span class="wh">tools</span> = [{
                <span class="st">"name"</span>:         <span class="wh">t</span>.name,
                <span class="st">"description"</span>: <span class="wh">t</span>.description,
                <span class="st">"input_schema"</span>: <span class="wh">t</span>.inputSchema
            } <span class="kw">for</span> <span class="wh">t</span> <span class="kw">in</span> <span class="wh">tools_resp</span>.tools]

            <span class="cm"># ── Use discovered tools in agent loop ──────</span>
            <span class="kw">return</span> <span class="kw">await</span> <span class="fn">run_agent_with_tools</span>(<span class="wh">tools</span>, <span class="wh">session</span>)

<span class="cm"># MCP server URLs (configure per environment)</span>
<span class="wh">MCP_SERVERS</span> = {
    <span class="st">"postgres"</span>: <span class="st">"http://localhost:3001/mcp"</span>,
    <span class="st">"slack"</span>:    <span class="st">"http://localhost:3002/mcp"</span>,
    <span class="st">"sheets"</span>:   <span class="st">"http://localhost:3003/mcp"</span>,
}` }} />
          )}
        </DemoBody>
      </DemoWrap>
    </Section>
  );
}
