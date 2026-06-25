# MCP-Powered AI Assistant

An interactive prototype demonstrating a **Model Context Protocol (MCP) AI agent** that accepts natural language queries, discovers tools dynamically, runs a ReAct reasoning loop across enterprise services, and streams a professional report — all powered by **Claude Sonnet**.

![MCP Agent — 3-Part Prototype](https://img.shields.io/badge/Parts-3%20%E2%80%94%20Pipeline%20%7C%20ReAct%20%7C%20Tech%20Stack-7c3aed?style=for-the-badge)
![Anthropic Claude](https://img.shields.io/badge/Powered%20by-Claude%20Sonnet-06b6d4?style=for-the-badge)
![React + Vite](https://img.shields.io/badge/Built%20with-React%20%2B%20Vite-4f46e5?style=for-the-badge)
![Bauhaus Design](https://img.shields.io/badge/UI%20Design-Bauhaus%20System-E3000F?style=for-the-badge)

---

## 🏗️ What It Demonstrates

### Part 1 — End-to-End MCP Pipeline
Animates through 6 stages as the agent processes your query:
> **Intent Parsing → Tool Discovery → Service Connection → Data Retrieval → Report Generation → Done**

### Part 2 — ReAct Reasoning Loop
Visualises the **Reason + Act** pattern that underpins every real agent system:
> **THINK → DECIDE (tool needed?) → ACT (call MCP tool) → OBSERVE (result) → UPDATE context → repeat**

### Part 3 — Interactive Tech Stack
A 4-layer clickable architecture diagram. Click any node to reveal:
- What it does and why it's in this layer
- Step-by-step implementation guide
- Real code snippet with a copy button
- Install commands
- How it connects to adjacent layers

```
Layer 1 — Frontend         React / Next.js · SSE streaming · Chat UI
Layer 2 — Agent Backend    Anthropic SDK · Tool-use loop · State manager
Layer 3 — MCP Servers      PostgreSQL MCP · Slack MCP · Sheets MCP · Custom tools
Layer 4 — Data Stores      PostgreSQL · CRM APIs · Google Sheets · Slack API · Email/Cal
                           ↑ abstracted — the agent never calls these directly
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- (Optional) An Anthropic API key for real Claude streaming

### Install & Run

```bash
git clone https://github.com/your-username/mcp-powered-ai-assistant.git
cd mcp-powered-ai-assistant
npm install
npm run dev
```

Open **http://localhost:5173/**

### Using the App

| Mode | How |
|---|---|
| **Demo** (no key needed) | Click a preset query → **Run Agent** → mock report streams in |
| **Real Claude** | Paste your `sk-ant-…` key in the header → type any query → live streaming report |

### Environment Variables (optional)

Copy `.env.example` to `.env.local` and add your key if you want it pre-loaded:

```bash
cp .env.example .env.local
```

---

## 🗂️ Project Structure

```
src/
├── hooks/
│   ├── useAgentPipeline.js   ← 6-stage pipeline state machine
│   └── useReActLoop.js       ← ReAct loop state machine (THINK→ACT→OBSERVE)
├── lib/
│   ├── anthropic.js          ← Claude Sonnet streaming (BYOK, browser-direct)
│   └── toolDetector.js       ← Keyword → MCP tool heuristics
├── data/
│   └── techStackData.js      ← Deep-dive content for all 17 architecture nodes
└── components/
    ├── Header.jsx             ← Logo, dynamic status pill, API key input
    ├── QueryPanel.jsx         ← 6 preset queries, textarea, Ctrl+Enter
    ├── PipelineVisualizer.jsx ← Animated 6-stage pipeline + execution log
    ├── ReActLoop.jsx          ← Animated THINK/DECIDE/ACT/OBSERVE nodes
    ├── ContextWindow.jsx      ← Auto-scrolling tool call log per iteration
    ├── ToolGrid.jsx           ← 6 enterprise tool cards with call-count badges
    ├── ReportOutput.jsx       ← Streaming markdown renderer, copy, export
    ├── ArchDiagram.jsx        ← 3-tab diagram (P1 Pipeline / P2 ReAct / P3 Stack)
    └── TechStack.jsx          ← Interactive 4-layer tech stack visualiser
```

---

## 🔑 Key Concepts

### MCP (Model Context Protocol)
MCP is an open standard by Anthropic that lets LLMs call external tools via a standardised protocol. Instead of hardcoding API calls in your agent, you deploy **MCP Servers** — thin wrappers around your data sources that expose them as callable tools. The agent never imports `pg`, `@slack/web-api`, or any service SDK directly.

### ReAct Pattern
ReAct (Reason + Act) is the dominant paradigm for agentic AI loops:
1. **THINK** — LLM reasons about what it needs
2. **DECIDE** — Is another tool call needed?
3. **ACT** — Call the relevant MCP tool
4. **OBSERVE** — Parse and validate the result
5. **UPDATE** — Append result to the context window, repeat

### Layer 4 Abstraction
Layer 4 (Data Stores) are plain APIs and databases — PostgreSQL, Slack, Google Sheets, etc. The **MCP layer (Layer 3) abstracts them** so the agent never calls them directly. You can swap CRM providers without touching a line of agent code.

---

## 🛠️ Building the Real Version

To go from this prototype to a production system:

1. **Set up MCP servers** — `@modelcontextprotocol/server-postgres`, `@slack/mcp`, or build custom with `@modelcontextprotocol/sdk`
2. **Pass `mcp_servers: [...]`** in the Anthropic API call so Claude can genuinely invoke tools
3. **Handle multi-turn tool-use loops** — `stop_reason === "tool_use"` → call tool → append `tool_result` → re-call Claude
4. **Deploy with auth** — Redis for session state, secrets manager for credentials, rate limiting at the gateway

---

## 📄 License

MIT
