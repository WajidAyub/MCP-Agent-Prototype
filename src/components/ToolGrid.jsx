import { TOOLS } from '../lib/toolDetector';

const MOCK_METRICS = {
  postgres: { latency: '142ms', rows: '4,821 rows', status: 'CONNECTED' },
  crm:      { latency: '98ms',  rows: '1,247 records', status: 'CONNECTED' },
  sheets:   { latency: '65ms',  rows: '1,240 cells', status: 'CONNECTED' },
  slack:    { latency: '31ms',  rows: '3 channels', status: 'CONNECTED' },
  email:    { latency: '87ms',  rows: '14 events', status: 'CONNECTED' },
  github:   { latency: '110ms', rows: '8 commits', status: 'CONNECTED' },
};

export default function ToolGrid({ activeTools, stage, toolCallCount = {}, actingTool = null }) {
  const isConnecting = stage === 'connecting' || stage === 'retrieving' || stage === 'generating' || stage === 'done';
  const totalCalls   = Object.values(toolCallCount).reduce((a, b) => a + b, 0);

  return (
    <>
      {totalCalls > 0 && (
        <div style={{ marginBottom: '20px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--cyan)' }}>
          &gt; ReAct loop made {totalCalls} tool calls across {Object.keys(toolCallCount).length} services
        </div>
      )}

      <div className="tools-grid reveal visible">
        {TOOLS.map(tool => {
          const isActive   = activeTools.includes(tool.id);
          const isActing   = actingTool === tool.id;
          const callCount  = toolCallCount[tool.id] || 0;
          const metrics    = MOCK_METRICS[tool.id];

          // Determine styling based on state
          const borderStyle = isActing 
            ? { borderColor: 'var(--cyan)', boxShadow: '6px 6px 0 0 var(--cyan)', transform: 'translate(-2px, -2px)' } 
            : isActive 
            ? { borderColor: 'var(--violet)' }
            : {};

          return (
            <div key={tool.id} className="tool-card" style={borderStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="tool-emoji" style={isActing ? { transform: 'scale(1.1)' } : {}}>
                  {tool.icon}
                </div>
                {callCount > 0 && (
                  <div style={{ background: 'var(--cyan)', color: 'var(--bg2)', padding: '2px 6px', borderRadius: '0', border: '2px solid var(--border)', fontSize: '11px', fontWeight: 'bold' }}>
                    {callCount}×
                  </div>
                )}
              </div>
              <div className="tool-name">{tool.name}</div>
              <div className="tool-desc">
                {tool.desc || tool.subtitle}
                {isActive && isConnecting && !isActing && (
                  <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--gray)', display: 'flex', gap: '10px' }}>
                    <span>◆ {metrics.latency}</span>
                    <span>{metrics.rows}</span>
                  </div>
                )}
                {isActing && (
                  <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--cyan)', animation: 'pulse 1.5s infinite' }}>
                    ▶ Executing Tool...
                  </div>
                )}
              </div>
              <div className="tool-status" style={{ color: isActive ? 'var(--green)' : 'var(--gray2)' }}>
                {isActive ? 'CONNECTED' : 'STANDBY'}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
