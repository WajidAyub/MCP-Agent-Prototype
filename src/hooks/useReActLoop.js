/**
 * useReActLoop.js
 * State machine for the ReAct (Reason + Act) agent reasoning loop.
 * Cycles: thinking → deciding → acting → observing → updating
 * Repeats for 5-12 iterations, then exits with finalAnswer = true.
 */
import { useState, useCallback, useRef } from 'react';
import { TOOLS } from '../lib/toolDetector';

/* ── Canned thought + result templates ── */
const THOUGHTS = [
  (tool) => `I need to query ${tool} to understand the current data landscape before drawing conclusions.`,
  (tool) => `Let me check ${tool} for patterns that might explain the trend in the user's query.`,
  (tool) => `Before I can answer, I must retrieve the latest records from ${tool}.`,
  (tool) => `${tool} holds the key metric here — let me fetch it and add to my context.`,
  (tool) => `Cross-referencing with ${tool} will validate my previous findings.`,
  (tool) => `I should verify the data from ${tool} before including it in the final report.`,
  (_)    => `I have enough context now. Let me synthesize the findings into a final answer.`,
];

const RESULTS = {
  postgres: [
    '→ 4,821 rows returned. Revenue: $4.82M (+12.4% QoQ). Top region: West Coast ($1.93M).',
    '→ Monthly cohort data fetched. Avg deal size: $18,600. Close rate: 23.7%.',
    '→ Pipeline stage distribution: Qualified 41%, Proposal 28%, Negotiation 19%, Won 12%.',
  ],
  crm: [
    '→ 1,247 active accounts. 3 at-risk accounts flagged (LTV >$400K, last active >45d).',
    '→ Churn probability scores fetched. Top churners: Acme Corp (78%), Globex (64%).',
    '→ 89 new leads this month. MQL→SQL conversion rate: 34.1% (industry avg: 28%).',
  ],
  sheets: [
    '→ Report template loaded. 1,240 cells updated with current quarter data.',
    '→ Q2 vs Q1 comparison sheet exported. Charts regenerated for 6 KPI panels.',
  ],
  slack: [
    '→ #sales-team channel identified. 3 teammates online. Message payload prepared.',
    '→ Webhook delivered to #alerts. 2 previous alerts acknowledged this week.',
  ],
  email: [
    '→ 14 calendar events parsed. 3 upcoming QBRs identified. Follow-up draft queued.',
    '→ 7 unread threads flagged as high-priority. Digest compiled.',
  ],
  github: [
    '→ 8 commits since last deploy. 1 open critical PR. Last deploy: 6h ago (success).',
    '→ Build status: passing. Test coverage: 87.3%. No failing checks.',
  ],
};

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickThought(tool, isFinal) {
  if (isFinal) return THOUGHTS[THOUGHTS.length - 1](tool);
  return randomFrom(THOUGHTS.slice(0, -1))(tool);
}

function pickResult(toolId) {
  const pool = RESULTS[toolId] || ['→ Data retrieved successfully. Context updated.'];
  return randomFrom(pool);
}

/* ── Delays (ms) per sub-state ── */
const DELAYS = {
  thinking:  1100,
  deciding:   700,
  acting:     900,
  observing:  800,
  updating:   600,
};

export function useReActLoop() {
  const [loopState,    setLoopState]    = useState('idle');
  const [iteration,    setIteration]    = useState(0);
  const [maxIter,      setMaxIter]      = useState(0);
  const [activeNode,   setActiveNode]   = useState(null);
  const [decidedYes,   setDecidedYes]   = useState(true);
  const [currentTool,  setCurrentTool]  = useState(null);
  const [contextLog,   setContextLog]   = useState([]);
  const [finalAnswer,  setFinalAnswer]  = useState(false);
  const [toolCallCount,setToolCallCount]= useState({});
  const abortRef = useRef(false);

  const delay = ms => new Promise(r => setTimeout(r, ms));

  const run = useCallback(async (activeTools) => {
    abortRef.current = false;

    // Setup
    const max = 5 + Math.floor(Math.random() * 4); // 5–8 iterations
    setMaxIter(max);
    setIteration(0);
    setContextLog([]);
    setFinalAnswer(false);
    setToolCallCount({});
    setLoopState('running');

    const toolPool = activeTools.length > 0
      ? activeTools
      : ['postgres', 'crm'];

    for (let i = 1; i <= max; i++) {
      if (abortRef.current) return;
      setIteration(i);

      const isFinalIter = (i === max);
      const toolId = isFinalIter
        ? null
        : toolPool[(i - 1) % toolPool.length];

      const toolLabel = toolId
        ? (TOOLS.find(t => t.id === toolId)?.name ?? toolId)
        : null;

      // ── THINK ──
      setActiveNode('think');
      setLoopState('thinking');
      const thought = pickThought(toolLabel, isFinalIter);
      await delay(DELAYS.thinking);
      if (abortRef.current) return;

      // ── DECIDE ──
      setActiveNode('decide');
      setLoopState('deciding');
      const yes = !isFinalIter;
      setDecidedYes(yes);
      await delay(DELAYS.deciding);
      if (abortRef.current) return;

      if (!yes) {
        // Exit loop — final answer
        setActiveNode('final');
        setLoopState('done');
        setFinalAnswer(true);
        setContextLog(prev => [...prev, {
          iteration: i,
          tool: null,
          thought,
          result: '✅ Sufficient context gathered. Generating final answer.',
          isFinal: true,
        }]);
        return;
      }

      // ── ACT ──
      setActiveNode('act');
      setLoopState('acting');
      setCurrentTool(toolId);
      await delay(DELAYS.acting);
      if (abortRef.current) return;

      // ── OBSERVE ──
      setActiveNode('observe');
      setLoopState('observing');
      const result = pickResult(toolId);
      await delay(DELAYS.observing);
      if (abortRef.current) return;

      // ── UPDATE CONTEXT ──
      setActiveNode('update');
      setLoopState('updating');
      setContextLog(prev => [...prev, { iteration: i, tool: toolId, toolLabel, thought, result, isFinal: false }]);
      setToolCallCount(prev => ({ ...prev, [toolId]: (prev[toolId] || 0) + 1 }));
      await delay(DELAYS.updating);
      if (abortRef.current) return;
    }

    // Safety: if loop finishes without explicit exit above
    setLoopState('done');
    setFinalAnswer(true);
    setActiveNode('final');
  }, []);

  const reset = useCallback(() => {
    abortRef.current = true;
    setLoopState('idle');
    setIteration(0);
    setMaxIter(0);
    setActiveNode(null);
    setCurrentTool(null);
    setContextLog([]);
    setFinalAnswer(false);
    setToolCallCount({});
  }, []);

  return {
    loopState, iteration, maxIter, activeNode,
    decidedYes, currentTool, contextLog,
    finalAnswer, toolCallCount,
    run, reset,
  };
}
