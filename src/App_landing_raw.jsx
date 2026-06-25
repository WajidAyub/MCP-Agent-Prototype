

{/* ── NAV ── */}
<nav>
  <a className="nav-logo" href="#">
    <svg className="nav-hex" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="navg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#7c3aed"/>
          <stop offset="100%" stop-color="#06b6d4"/>
        </linearGradient>
      </defs>
      <polygon points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5" fill="url(#navg)"/>
      <polygon points="50,20 78,35 78,65 50,80 22,65 22,35" fill="#05060f"/>
      <polygon points="50,32 68,42 68,62 50,72 32,62 32,42" fill="url(#navg)" opacity="0.7"/>
    </svg>
    <span className="nav-wordmark">MCP<span>AGENT</span></span>
  </a>
  <ul className="nav-links">
    <li><a href="#pipeline">PIPELINE</a></li>
    <li><a href="#tools">TOOLS</a></li>
    <li><a href="#demo">CODE</a></li>
    <li><a href="#stack">STACK</a></li>
  </ul>
  <button className="nav-badge">VIEW ON GITHUB</button>
</nav>

{/* ── HERO ── */}
<div id="hero">
  <div className="hero-eyebrow">Model Context Protocol</div>

  <div className="hero-hex-wrap">
    <div className="hex-pulse">
      <div className="hex-ring"></div>
      <div className="hex-ring"></div>
      <div className="hex-ring"></div>
    </div>
    <svg className="hex-core" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#7c3aed"/>
          <stop offset="100%" stop-color="#06b6d4"/>
        </linearGradient>
      </defs>
      <polygon points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5" fill="url(#hg)"/>
      <polygon points="50,20 78,35 78,65 50,80 22,65 22,35" fill="#05060f"/>
      <polygon points="50,32 68,42 68,62 50,72 32,62 32,42" fill="url(#hg)" opacity="0.7"/>
    </svg>
  </div>

  <h1 className="hero-title">MCP AGENT</h1>
  <p className="hero-subtitle-line">AI · Enterprise · Automation</p>
  <p className="hero-desc">
    An <strong>MCP-powered AI assistant</strong> that takes natural language queries,
    discovers tools dynamically, connects to enterprise services, and
    returns production-grade reports — all in a single <strong>ReAct loop</strong>.
  </p>

  <div className="hero-ctas">
    <a href="#demo" className="btn-primary">EXPLORE THE CODE →</a>
    <a href="#pipeline" className="btn-ghost">VIEW PIPELINE</a>
  </div>

  <div className="hero-stats">
    <div className="stat">
      <span className="stat-num">15+</span>
      <span className="stat-label">Enterprise Tools</span>
    </div>
    <div className="stat">
      <span className="stat-num">4</span>
      <span className="stat-label">Architecture Layers</span>
    </div>
    <div className="stat">
      <span className="stat-num">∞</span>
      <span className="stat-label">ReAct Iterations</span>
    </div>
    <div className="stat">
      <span className="stat-num">&lt;1s</span>
      <span className="stat-label">Tool Discovery</span>
    </div>
  </div>
</div>

{/* ── TICKER ── */}
<div className="ticker-wrap">
  <div className="ticker-track" id="ticker">
    {/* Duplicated for seamless loop */}
  </div>
</div>

{/* ── PIPELINE ── */}
<section id="pipeline">
  <div className="reveal">
    <div className="section-eyebrow">Architecture</div>
    <h2 className="section-title">THE FULL PIPELINE</h2>
    <p className="section-sub">Six stages from natural language input to delivered enterprise report — fully automated, fully observable.</p>
  </div>

  <div className="steps-grid reveal">
    <div className="pipe-step" data-n="01">
      <div className="pipe-icon">💬</div>
      <h3>User Query</h3>
      <p>Natural language input. No SQL. No API keys. Just intent.</p>
      <span className="pipe-tag">Input Layer</span>
    </div>
    <div className="pipe-step" data-n="02">
      <div className="pipe-icon">🧠</div>
      <h3>LLM Reasoning</h3>
      <p>Claude parses intent, decomposes the task, and selects the right tools.</p>
      <span className="pipe-tag">Claude Sonnet</span>
    </div>
    <div className="pipe-step" data-n="03">
      <div className="pipe-icon">⬡</div>
      <h3>MCP Discovery</h3>
      <p>Dynamic tool registry lookup. Available tools are discovered at runtime.</p>
      <span className="pipe-tag">MCP Protocol</span>
    </div>
    <div className="pipe-step" data-n="04">
      <div className="pipe-icon">🔌</div>
      <h3>Service Connect</h3>
      <p>Authenticated connections to PostgreSQL, CRM, Sheets, and Slack.</p>
      <span className="pipe-tag">Enterprise APIs</span>
    </div>
    <div className="pipe-step" data-n="05">
      <div className="pipe-icon">⚡</div>
      <h3>Data Retrieval</h3>
      <p>Multi-source aggregation across all connected services in parallel.</p>
      <span className="pipe-tag">Execution</span>
    </div>
    <div className="pipe-step" data-n="06">
      <div className="pipe-icon">📊</div>
      <h3>Report Delivery</h3>
      <p>Insights synthesized, report generated, team notified — in one pass.</p>
      <span className="pipe-tag">Output Layer</span>
    </div>
  </div>
</section>

{/* ── TOOLS ── */}
<section id="tools" style={{ paddingTop: 0 }}>
  <div className="reveal">
    <div className="section-eyebrow">Integrations</div>
    <h2 className="section-title">CONNECTED TOOLS</h2>
    <p className="section-sub">Every tool is discovered dynamically at runtime via MCP — no hardcoded integrations.</p>
  </div>

  <div className="tools-grid reveal">
    <div className="tool-card">
      <div className="tool-emoji">🐘</div>
      <div className="tool-name">PostgreSQL</div>
      <div className="tool-desc">Raw SQL execution, schema inspection, sales data retrieval.</div>
      <div className="tool-status">CONNECTED</div>
    </div>
    <div className="tool-card">
      <div className="tool-emoji">👥</div>
      <div className="tool-name">CRM</div>
      <div className="tool-desc">Customer profiles, deal pipeline, lead scoring.</div>
      <div className="tool-status">CONNECTED</div>
    </div>
    <div className="tool-card">
      <div className="tool-emoji">📊</div>
      <div className="tool-name">Google Sheets</div>
      <div className="tool-desc">Report export, data visualization, spreadsheet automation.</div>
      <div className="tool-status">CONNECTED</div>
    </div>
    <div className="tool-card">
      <div className="tool-emoji">💬</div>
      <div className="tool-name">Slack</div>
      <div className="tool-desc">Team notifications, channel updates, automated alerts.</div>
      <div className="tool-status">CONNECTED</div>
    </div>
    <div className="tool-card">
      <div className="tool-emoji">📧</div>
      <div className="tool-name">Email / SMTP</div>
      <div className="tool-desc">Automated outreach, report delivery, digest scheduling.</div>
      <div className="tool-status">CONNECTED</div>
    </div>
    <div className="tool-card">
      <div className="tool-emoji">📅</div>
      <div className="tool-name">Calendar</div>
      <div className="tool-desc">Meeting scheduling, follow-up booking, availability checks.</div>
      <div className="tool-status">CONNECTED</div>
    </div>
  </div>
</section>

{/* ── LOOP EXPLAINER ── */}
<section id="loop">
  <div className="reveal">
    <div className="section-eyebrow">Core Algorithm</div>
    <h2 className="section-title">THE REACT LOOP</h2>
    <p className="section-sub">The agent doesn't run once — it loops. Reason, Act, Observe, repeat until the answer is complete.</p>
  </div>

  <div className="loop-wrap reveal">
    <div className="loop-step">
      <div className="loop-step-head">
        <span className="loop-n">01</span>
        <span className="loop-step-title">THINK</span>
      </div>
      <p>LLM receives the full conversation history plus available tools. It reasons about what information it still needs and which tool can provide it.</p>
      <div className="loop-code">stop_reason → "tool_use"</div>
    </div>
    <div className="loop-step">
      <div className="loop-step-head">
        <span className="loop-n">02</span>
        <span className="loop-step-title">ACT</span>
      </div>
      <p>Agent extracts the tool_use block from the response and calls execute_tool() — a real API call, database query, or external service request.</p>
      <div className="loop-code">execute_tool(name, input)</div>
    </div>
    <div className="loop-step">
      <div className="loop-step-head">
        <span className="loop-n">03</span>
        <span className="loop-step-title">OBSERVE</span>
      </div>
      <p>Tool result is appended to the message history as a tool_result block. The entire updated context is sent back to the model in the next iteration.</p>
      <div className="loop-code">messages.append(tool_results)</div>
    </div>
    <div className="loop-step">
      <div className="loop-step-head">
        <span className="loop-n">04</span>
        <span className="loop-step-title">REPEAT</span>
      </div>
      <p>The loop continues — up to 20 iterations — until the model returns stop_reason "end_turn", signaling it has enough data to produce the final report.</p>
      <div className="loop-code">stop_reason → "end_turn" ✓</div>
    </div>
  </div>
</section>

{/* ── CODE DEMO ── */}
<section id="demo" style={{ paddingTop: 0 }}>
  <div className="reveal">
    <div className="section-eyebrow">Implementation</div>
    <h2 className="section-title">THE CODE</h2>
    <p className="section-sub">The entire agent loop in Python — less than 50 lines that matter.</p>
  </div>

  <div className="demo-wrap reveal">
    <div className="demo-topbar">
      <button className="demo-tab active" onclick="switchTab(0)">agent.py</button>
      <button className="demo-tab" onclick="switchTab(1)">tools.py</button>
      <button className="demo-tab" onclick="switchTab(2)">mcp_connect.py</button>
    </div>
    <div className="demo-body">

      <pre className="code-block active" id="tab0"><span className="cm"># MCP-Powered AI Assistant — Core Agent Loop</span>

<span className="kw">import</span> <span className="wh">os</span>
<span className="kw">from</span> <span className="wh">anthropic</span> <span className="kw">import</span> <span className="fn">Anthropic</span>

<span className="wh">client</span> = <span className="fn">Anthropic</span>(api_key=<span className="wh">os</span>.environ[<span className="st">"ANTHROPIC_API_KEY"</span>])

<span className="kw">def</span> <span className="fn">run_agent</span>(<span className="wh">user_query</span>: <span className="wh">str</span>) -> <span className="wh">str</span>:
    <span className="wh">messages</span> = [{ <span className="st">"role"</span>: <span className="st">"user"</span>, <span className="st">"content"</span>: <span className="wh">user_query</span> }]

    <span className="kw">while</span> <span className="nb">True</span>:
        <span className="wh">response</span> = <span className="wh">client</span>.messages.<span className="fn">create</span>(
            model=<span className="st">"claude-sonnet-4-6"</span>,
            max_tokens=<span className="nb">4096</span>,
            tools=<span className="wh">TOOLS</span>,
            messages=<span className="wh">messages</span>
        )

        <span className="cm"># ── Exit: agent has enough data ──</span>
        <span className="kw">if</span> <span className="wh">response</span>.stop_reason == <span className="st">"end_turn"</span>:
            <span className="kw">return</span> <span className="wh">response</span>.content[<span className="nb">0</span>].text

        <span className="cm"># ── Continue: execute requested tools ──</span>
        <span className="wh">messages</span>.<span className="fn">append</span>({ <span className="st">"role"</span>: <span className="st">"assistant"</span>, <span className="st">"content"</span>: <span className="wh">response</span>.content })

        <span className="wh">tool_results</span> = []
        <span className="kw">for</span> <span className="wh">block</span> <span className="kw">in</span> <span className="wh">response</span>.content:
            <span className="kw">if</span> <span className="wh">block</span>.type == <span className="st">"tool_use"</span>:
                <span className="wh">result</span> = <span className="fn">execute_tool</span>(<span className="wh">block</span>.name, <span className="wh">block</span>.input)
                <span className="wh">tool_results</span>.<span className="fn">append</span>({
                    <span className="st">"type"</span>:         <span className="st">"tool_result"</span>,
                    <span className="st">"tool_use_id"</span>:  <span className="wh">block</span>.id,
                    <span className="st">"content"</span>:      <span className="wh">result</span>
                })

        <span className="wh">messages</span>.<span className="fn">append</span>({ <span className="st">"role"</span>: <span className="st">"user"</span>, <span className="st">"content"</span>: <span className="wh">tool_results</span> })</pre>

      <pre className="code-block" id="tab1"><span className="cm"># Tool definitions — what Claude can call</span>

<span className="wh">TOOLS</span> = [
    {
        <span className="st">"name"</span>: <span className="st">"query_database"</span>,
        <span className="st">"description"</span>: <span className="st">"Execute SQL against PostgreSQL sales database"</span>,
        <span className="st">"input_schema"</span>: {
            <span className="st">"type"</span>: <span className="st">"object"</span>,
            <span className="st">"properties"</span>: {
                <span className="st">"query"</span>: { <span className="st">"type"</span>: <span className="st">"string"</span>, <span className="st">"description"</span>: <span className="st">"SQL query"</span> }
            },
            <span className="st">"required"</span>: [<span className="st">"query"</span>]
        }
    },
    {
        <span className="st">"name"</span>: <span className="st">"send_slack_message"</span>,
        <span className="st">"description"</span>: <span className="st">"Post message to a Slack channel"</span>,
        <span className="st">"input_schema"</span>: {
            <span className="st">"type"</span>: <span className="st">"object"</span>,
            <span className="st">"properties"</span>: {
                <span className="st">"channel"</span>: { <span className="st">"type"</span>: <span className="st">"string"</span> },
                <span className="st">"message"</span>: { <span className="st">"type"</span>: <span className="st">"string"</span> }
            },
            <span className="st">"required"</span>: [<span className="st">"channel"</span>, <span className="st">"message"</span>]
        }
    }
]

<span className="kw">def</span> <span className="fn">execute_tool</span>(<span className="wh">name</span>: <span className="wh">str</span>, <span className="wh">inputs</span>: <span className="wh">dict</span>) -> <span className="wh">str</span>:
    <span className="cm"># Route to real implementation</span>
    <span className="kw">if</span>   <span className="wh">name</span> == <span className="st">"query_database"</span>:    <span className="kw">return</span> <span className="fn">db_query</span>(<span className="wh">inputs</span>[<span className="st">"query"</span>])
    <span className="kw">elif</span> <span className="wh">name</span> == <span className="st">"send_slack_message"</span>: <span className="kw">return</span> <span className="fn">slack_post</span>(<span className="wh">inputs</span>)
    <span className="kw">raise</span> <span className="nb">ValueError</span>(<span className="st">f"Unknown tool: {name}"</span>)</pre>

      <pre className="code-block" id="tab2"><span className="cm"># Real MCP server connection (production)</span>

<span className="kw">import</span> <span className="wh">asyncio</span>
<span className="kw">from</span> <span className="wh">mcp</span> <span className="kw">import</span> <span className="fn">ClientSession</span>
<span className="kw">from</span> <span className="wh">mcp.client.streamable_http</span> <span className="kw">import</span> <span className="fn">streamablehttp_client</span>

<span className="kw">async def</span> <span className="fn">connect_mcp</span>(<span className="wh">server_url</span>: <span className="wh">str</span>):
    <span className="kw">async with</span> <span className="fn">streamablehttp_client</span>(url=<span className="wh">server_url</span>) <span className="kw">as</span> (<span className="wh">read</span>, <span className="wh">write</span>, <span className="wh">_</span>):
        <span className="kw">async with</span> <span className="fn">ClientSession</span>(<span className="wh">read</span>, <span className="wh">write</span>) <span className="kw">as</span> <span className="wh">session</span>:

            <span className="kw">await</span> <span className="wh">session</span>.<span className="fn">initialize</span>()

            <span className="cm"># ── Dynamic tool discovery ──────────────────</span>
            <span className="wh">tools_resp</span> = <span className="kw">await</span> <span className="wh">session</span>.<span className="fn">list_tools</span>()
            <span className="wh">tools</span> = [{
                <span className="st">"name"</span>:         <span className="wh">t</span>.name,
                <span className="st">"description"</span>: <span className="wh">t</span>.description,
                <span className="st">"input_schema"</span>: <span className="wh">t</span>.inputSchema
            } <span className="kw">for</span> <span className="wh">t</span> <span className="kw">in</span> <span className="wh">tools_resp</span>.tools]

            <span className="cm"># ── Use discovered tools in agent loop ──────</span>
            <span className="kw">return</span> <span className="kw">await</span> <span className="fn">run_agent_with_tools</span>(<span className="wh">tools</span>, <span className="wh">session</span>)

<span className="cm"># MCP server URLs (configure per environment)</span>
<span className="wh">MCP_SERVERS</span> = {
    <span className="st">"postgres"</span>: <span className="st">"http://localhost:3001/mcp"</span>,
    <span className="st">"slack"</span>:    <span className="st">"http://localhost:3002/mcp"</span>,
    <span className="st">"sheets"</span>:   <span className="st">"http://localhost:3003/mcp"</span>,
}</pre>

    </div>
  </div>
</section>

{/* ── TECH STACK ── */}
<section id="stack">
  <div className="reveal">
    <div className="section-eyebrow">Infrastructure</div>
    <h2 className="section-title">TECH STACK</h2>
    <p className="section-sub">Four clean layers from user interface to enterprise data — each responsible for one thing.</p>
  </div>

  <div className="stack-layers reveal">
    <div className="stack-row">
      <div className="stack-label">
        <span className="stack-layer-num">Layer 01</span>
        <span className="stack-layer-name">Frontend</span>
      </div>
      <div className="stack-items">
        <span className="stack-chip">React / Next.js</span>
        <span className="stack-chip">Streaming SSE</span>
        <span className="stack-chip">Chat UI</span>
        <span className="stack-chip">TypeScript</span>
      </div>
    </div>
    <div className="stack-row">
      <div className="stack-label">
        <span className="stack-layer-num">Layer 02</span>
        <span className="stack-layer-name">Agent Backend</span>
      </div>
      <div className="stack-items">
        <span className="stack-chip">Python 3.11+</span>
        <span className="stack-chip">Anthropic SDK</span>
        <span className="stack-chip">Tool Use Loop</span>
        <span className="stack-chip">State Manager</span>
        <span className="stack-chip">FastAPI</span>
      </div>
    </div>
    <div className="stack-row">
      <div className="stack-label">
        <span className="stack-layer-num">Layer 03</span>
        <span className="stack-layer-name">MCP Servers</span>
      </div>
      <div className="stack-items">
        <span className="stack-chip">MCP Python SDK</span>
        <span className="stack-chip">PostgreSQL MCP</span>
        <span className="stack-chip">Slack MCP</span>
        <span className="stack-chip">Sheets MCP</span>
        <span className="stack-chip">Custom Tools</span>
      </div>
    </div>
    <div className="stack-row">
      <div className="stack-label">
        <span className="stack-layer-num">Layer 04</span>
        <span className="stack-layer-name">Data Stores</span>
      </div>
      <div className="stack-items">
        <span className="stack-chip">PostgreSQL</span>
        <span className="stack-chip">Salesforce / HubSpot</span>
        <span className="stack-chip">Google Workspace</span>
        <span className="stack-chip">Slack API</span>
        <span className="stack-chip">SMTP / Gmail</span>
      </div>
    </div>
  </div>
</section>

{/* ── FOOTER ── */}
<footer>
  <div className="footer-brand">MCP<span>AGENT</span></div>
  <div className="footer-meta">
    BUILT WITH ANTHROPIC CLAUDE SONNET 4.6<br />
    MODEL CONTEXT PROTOCOL · REACT LOOP · ENTERPRISE AI
  </div>
</footer>

