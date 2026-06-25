export default function ReActLoop({
  loopState, iteration, maxIter, activeNode,
  decidedYes, currentTool, finalAnswer,
}) {
  const isRunning = loopState !== 'idle' && loopState !== 'done';
  
  // Helpers to check active state
  const isThink   = isRunning && (activeNode === 'think' || activeNode === 'decide');
  const isAct     = isRunning && activeNode === 'act';
  const isObserve = isRunning && activeNode === 'observe';
  const isRepeat  = isRunning && activeNode === 'update';

  return (
    <div className="loop-wrap reveal visible">
      
      {/* 01: THINK */}
      <div className="loop-step" style={isThink ? { borderColor: 'var(--cyan)', boxShadow: '0 0 15px rgba(0, 212, 255, 0.1)' } : {}}>
        <div className="loop-step-head">
          <span className="loop-n" style={isThink ? { background: 'var(--cyan)', color: 'var(--bg)' } : {}}>01</span>
          <span className="loop-step-title" style={isThink ? { color: 'var(--cyan)' } : {}}>THINK</span>
        </div>
        <p>LLM receives the full conversation history plus available tools. It reasons about what information it still needs and which tool can provide it.</p>
        <div className="loop-code">
          {isThink && iteration > 0 ? (
            <span style={{ color: 'var(--cyan)' }}>▶ Iteration {iteration}: Reasoning...</span>
          ) : (
            'stop_reason → "tool_use"'
          )}
        </div>
      </div>

      {/* 02: ACT */}
      <div className="loop-step" style={isAct ? { borderColor: 'var(--violet2)', boxShadow: '0 0 15px rgba(155, 94, 255, 0.1)' } : {}}>
        <div className="loop-step-head">
          <span className="loop-n" style={isAct ? { background: 'var(--violet2)', color: 'var(--bg)' } : {}}>02</span>
          <span className="loop-step-title" style={isAct ? { color: 'var(--violet2)' } : {}}>ACT</span>
        </div>
        <p>Agent extracts the tool_use block from the response and calls execute_tool() — a real API call, database query, or external service request.</p>
        <div className="loop-code">
          {isAct && currentTool ? (
            <span style={{ color: 'var(--violet2)' }}>▶ execute_tool({currentTool})</span>
          ) : (
            'execute_tool(name, input)'
          )}
        </div>
      </div>

      {/* 03: OBSERVE */}
      <div className="loop-step" style={isObserve ? { borderColor: 'var(--green)', boxShadow: '0 0 15px rgba(0, 255, 148, 0.1)' } : {}}>
        <div className="loop-step-head">
          <span className="loop-n" style={isObserve ? { background: 'var(--green)', color: 'var(--bg)' } : {}}>03</span>
          <span className="loop-step-title" style={isObserve ? { color: 'var(--green)' } : {}}>OBSERVE</span>
        </div>
        <p>Tool result is appended to the message history as a tool_result block. The entire updated context is sent back to the model in the next iteration.</p>
        <div className="loop-code">
          {isObserve ? (
            <span style={{ color: 'var(--green)' }}>▶ Parsing result...</span>
          ) : (
            'messages.append(tool_results)'
          )}
        </div>
      </div>

      {/* 04: REPEAT */}
      <div className="loop-step" style={isRepeat ? { borderColor: 'var(--white)', boxShadow: '0 0 15px rgba(240, 244, 255, 0.1)' } : {}}>
        <div className="loop-step-head">
          <span className="loop-n" style={isRepeat || finalAnswer ? { background: 'var(--white)', color: 'var(--bg)' } : {}}>04</span>
          <span className="loop-step-title" style={isRepeat || finalAnswer ? { color: 'var(--white)' } : {}}>REPEAT</span>
        </div>
        <p>The loop continues — up to {maxIter} iterations — until the model returns stop_reason "end_turn", signaling it has enough data to produce the final report.</p>
        <div className="loop-code">
          {isRepeat ? (
            <span style={{ color: 'var(--white)' }}>▶ Updating Context & Looping...</span>
          ) : finalAnswer ? (
            <span style={{ color: 'var(--green)' }}>stop_reason → "end_turn" ✓</span>
          ) : (
            'stop_reason → "end_turn"'
          )}
        </div>
      </div>

    </div>
  );
}
