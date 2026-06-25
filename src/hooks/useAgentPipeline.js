import { useState, useCallback, useRef } from 'react';
import { detectTools } from '../lib/toolDetector';
import { streamReport } from '../lib/anthropic';

export const STAGES = [
  { id: 'idle',       label: 'Idle',                  icon: '◉' },
  { id: 'parsing',    label: 'Intent Parsing',         icon: '🧠' },
  { id: 'discovering',label: 'Tool Discovery',          icon: '🔍' },
  { id: 'connecting', label: 'Service Connection',      icon: '🔌' },
  { id: 'retrieving', label: 'Data Retrieval',          icon: '📡' },
  { id: 'generating', label: 'Report Generation',       icon: '✨' },
  { id: 'done',       label: 'Report Ready',            icon: '✅' },
  { id: 'error',      label: 'Error',                   icon: '⚠️' },
];

const STAGE_DELAYS = {
  parsing:     1200,
  discovering: 1400,
  connecting:  1600,
  retrieving:  2000,
  generating:  0,    // starts immediately, streaming handles progress
};

/**
 * Central state machine hook for the MCP agent pipeline.
 */
export function useAgentPipeline() {
  const [stage, setStage]           = useState('idle');
  const [activeTools, setActiveTools] = useState([]);
  const [report, setReport]         = useState('');
  const [error, setError]           = useState('');
  const [stageLog, setStageLog]     = useState([]);
  const abortRef = useRef(false);

  const logStage = useCallback((s, detail = '') => {
    setStageLog(prev => [...prev, { stage: s, time: Date.now(), detail }]);
  }, []);

  const delay = ms => new Promise(r => setTimeout(r, ms));

  const run = useCallback(async ({ query, apiKey }) => {
    abortRef.current = false;
    setReport('');
    setError('');
    setStageLog([]);
    setActiveTools([]);

    const tools = detectTools(query);

    // ── Stage 1: Parsing ──
    setStage('parsing');
    logStage('parsing', `Identified intent tokens in "${query.slice(0, 60)}..."`);
    await delay(STAGE_DELAYS.parsing);
    if (abortRef.current) return;

    // ── Stage 2: Discovering ──
    setStage('discovering');
    logStage('discovering', `MCP scanned 24 registered tools → matched ${tools.length} tools`);
    await delay(STAGE_DELAYS.discovering);
    if (abortRef.current) return;

    // ── Stage 3: Connecting ──
    setStage('connecting');
    setActiveTools(tools);
    logStage('connecting', `Establishing connections to: ${tools.join(', ')}`);
    await delay(STAGE_DELAYS.connecting);
    if (abortRef.current) return;

    // ── Stage 4: Retrieving ──
    setStage('retrieving');
    logStage('retrieving', 'Executing queries and fetching payloads from services...');
    await delay(STAGE_DELAYS.retrieving);
    if (abortRef.current) return;

    // ── Stage 5: Generating (streaming) ──
    setStage('generating');
    logStage('generating', 'Synthesizing results via Claude context-aware reasoning...');

    if (!apiKey || apiKey.trim().length < 10) {
      // Demo mode: generate a mock report
      await generateMockReport(query, tools, setReport, setStage, logStage);
      return;
    }

    // Real Claude streaming
    const toolNames = tools.map(id => {
      const map = { postgres:'PostgreSQL', crm:'CRM', sheets:'Google Sheets', slack:'Slack', email:'Email/Calendar', github:'GitHub' };
      return map[id] || id;
    });

    await new Promise(resolve => {
      streamReport({
        apiKey,
        query,
        toolNames,
        onChunk: text => {
          if (!abortRef.current) setReport(prev => prev + text);
        },
        onDone: () => {
          if (!abortRef.current) {
            setStage('done');
            logStage('done', 'Report delivered successfully.');
          }
          resolve();
        },
        onError: msg => {
          setError(msg);
          setStage('error');
          logStage('error', msg);
          resolve();
        },
      });
    });
  }, [logStage]);

  const reset = useCallback(() => {
    abortRef.current = true;
    setStage('idle');
    setReport('');
    setError('');
    setActiveTools([]);
    setStageLog([]);
  }, []);

  return { stage, activeTools, report, error, stageLog, run, reset };
}

/* ── Mock Report Generator (demo mode when no API key) ── */
async function generateMockReport(query, tools, setReport, setStage, logStage) {
  const toolLabels = { postgres:'PostgreSQL', crm:'CRM', sheets:'Google Sheets', slack:'Slack', email:'Email/Calendar', github:'GitHub' };
  const names = tools.map(t => toolLabels[t] || t);

  const mockContent = `# Enterprise Intelligence Report

## Executive Summary
Analysis of **"${query}"** completed via MCP multi-tool orchestration. Data was retrieved from ${names.join(' and ')} and synthesized using context-aware reasoning. Key findings indicate strong performance with actionable opportunities for optimization.

## Key Metrics

| Metric | Value | Δ vs Last Period |
|---|---|---|
| Total Revenue | $4.82M | **+12.4%** |
| Active Accounts | 1,247 | +89 |
| Conversion Rate | 23.7% | +1.8pp |
| Avg Deal Size | $18,600 | +$2,100 |
| Pipeline Value | $22.1M | +8.3% |
| Customer LTV | $94,400 | +5.1% |

## Data Insights

- **Top Segment**: Enterprise tier contributed 68% of Q2 revenue ($3.28M), outperforming SMB at 32%.
- **Churn Alert**: 3 high-value accounts ($1.2M ARR combined) show disengagement signals — last active > 45 days.
- **Geographic Concentration**: 41% of new leads originate from the US West Coast, suggesting regional campaign success.
- **Sales Velocity**: Average time-to-close has decreased from 34 days → 27 days, a 20% improvement.
- **Product Mix**: Premium tier upsells increased 31% MoM following the Q1 feature launch.

## Trend Analysis
Revenue growth has maintained a consistent **+10-13% QoQ trajectory** over the past 5 quarters. The pipeline health score (weighted by deal stage and probability) stands at **7.8/10**, above the industry benchmark of 6.5. Customer acquisition cost (CAC) dropped to **$3,200** (−18% YoY) due to improved organic discovery channels.

## SQL Query Used

\`\`\`sql
SELECT
  DATE_TRUNC('month', closed_at)  AS period,
  SUM(arr)                        AS total_revenue,
  COUNT(DISTINCT account_id)      AS accounts,
  AVG(deal_size)                  AS avg_deal,
  ROUND(AVG(close_probability)*100,1) AS conversion_pct
FROM deals
WHERE closed_at >= NOW() - INTERVAL '6 months'
  AND stage = 'closed_won'
GROUP BY 1
ORDER BY 1 DESC;
\`\`\`

## Recommended Actions

1. **Immediately engage** the 3 at-risk accounts via personalized outreach — assign dedicated CSMs this week.
2. **Double West Coast budget** in next sprint — CAC efficiency is 2.3× higher than other regions.
3. **Launch upsell campaign** targeting 142 accounts currently on Base tier with >18 months tenure.
4. **Automate pipeline alerts** via Slack webhook — trigger when deal probability drops >15% in 7 days.

## MCP Tool Execution Log

\`\`\`json
[
  { "tool": "postgres",  "action": "query_sales_data",     "rows": 4821,  "latency_ms": 142 },
  { "tool": "crm",       "action": "fetch_account_health", "records": 89, "latency_ms": 98  },
  { "tool": "sheets",    "action": "export_report_draft",  "cells": 1240, "latency_ms": 65  }
]
\`\`\`

---
*Report generated by MCP Agent · Claude Sonnet · ${new Date().toLocaleString()} · Demo Mode*`;

  // Simulate streaming by revealing text chunk by chunk
  const words = mockContent.split('');
  let current = '';
  for (let i = 0; i < words.length; i += 8) {
    current += words.slice(i, i + 8).join('');
    setReport(current);
    await new Promise(r => setTimeout(r, 12));
  }
  setStage('done');
  logStage('done', 'Demo report delivered (no API key — using simulated data).');
}
