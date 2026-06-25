import { useState, useCallback, useEffect } from 'react';
import PipelineVisualizer from './components/PipelineVisualizer';
import ReActLoop from './components/ReActLoop';
import ContextWindow from './components/ContextWindow';
import ToolGrid from './components/ToolGrid';
import TechStack from './components/TechStack';
import { useAgentPipeline } from './hooks/useAgentPipeline';
import { useReActLoop } from './hooks/useReActLoop';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Ticker from './components/sections/Ticker';
import CodeDemo from './components/sections/CodeDemo';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [apiKey, setApiKey] = useState(() => sessionStorage.getItem('mcp_api_key') || '');

  // Part 1 — pipeline state machine
  const {
    stage, activeTools, report, error, stageLog, run: runPipeline, reset: resetPipeline,
  } = useAgentPipeline();

  // Part 2 — ReAct loop state machine
  const {
    loopState, iteration, maxIter, activeNode,
    decidedYes, currentTool, contextLog,
    finalAnswer, toolCallCount,
    run: runReAct, reset: resetReAct,
  } = useReActLoop();

  const handleApiKeyChange = useCallback((key) => {
    setApiKey(key);
    sessionStorage.setItem('mcp_api_key', key);
  }, []);

  useEffect(() => {
    if (stage === 'connecting' && loopState === 'idle') {
      runReAct(activeTools);
    }
  }, [stage, loopState, activeTools, runReAct]);

  const handleRun = useCallback((query) => {
    resetReAct();
    runPipeline({ query, apiKey });
  }, [runPipeline, resetReAct, apiKey]);

  const handleReset = useCallback(() => {
    resetPipeline();
    resetReAct();
  }, [resetPipeline, resetReAct]);

  const isRunning = !['idle', 'done', 'error'].includes(stage);
  const actingTool = activeNode === 'act' ? currentTool : null;

  return (
    <>
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {activePage === 'home' && (
        <>
          <Hero 
            onRun={handleRun} 
            isRunning={isRunning} 
            onReset={handleReset} 
            apiKey={apiKey} 
            onKeyChange={handleApiKeyChange}
            report={report}
            stage={stage}
            error={error}
          />
          <Ticker />
          {/* ── PIPELINE ── */}
          <section id="pipeline">
            <div className="reveal visible">
              <div className="section-eyebrow">Architecture</div>
              <h2 className="section-title">THE FULL PIPELINE</h2>
              <p className="section-sub">Six stages from natural language input to delivered enterprise report — fully automated, fully observable.</p>
            </div>
            <PipelineVisualizer stage={stage} stageLog={stageLog} />
          </section>
        </>
      )}

      {activePage === 'integrations' && (
        /* ── TOOLS ── */
        <section id="tools">
          <div className="reveal visible">
            <div className="section-eyebrow">Integrations</div>
            <h2 className="section-title">CONNECTED TOOLS</h2>
            <p className="section-sub">Every tool is discovered dynamically at runtime via MCP — no hardcoded integrations.</p>
          </div>
          <ToolGrid activeTools={activeTools} stage={stage} toolCallCount={toolCallCount} actingTool={actingTool} />
        </section>
      )}

      {activePage === 'algorithm' && (
        /* ── LOOP EXPLAINER ── */
        <section id="loop">
          <div className="reveal visible">
            <div className="section-eyebrow">Core Algorithm</div>
            <h2 className="section-title">THE REACT LOOP</h2>
            <p className="section-sub">The agent doesn't run once — it loops. Reason, Act, Observe, repeat until the answer is complete.</p>
          </div>
          <ReActLoop loopState={loopState} iteration={iteration} maxIter={maxIter} activeNode={activeNode} decidedYes={decidedYes} currentTool={currentTool} finalAnswer={finalAnswer} />
          <ContextWindow contextLog={contextLog} iteration={iteration} maxIter={maxIter} loopState={loopState} />
        </section>
      )}

      {activePage === 'architecture' && (
        <>
          <CodeDemo />
          {/* ── TECH STACK ── */}
          <section id="stack">
            <div className="reveal visible">
              <div className="section-eyebrow">Infrastructure</div>
              <h2 className="section-title">TECH STACK</h2>
              <p className="section-sub">Four clean layers from user interface to enterprise data — each responsible for one thing.</p>
            </div>
            <TechStack />
          </section>
        </>
      )}

      <Footer />
    </>
  );
}
