import { STAGES } from '../hooks/useAgentPipeline';

const STAGE_CONTENT = {
  parsing:     { n: '01', icon: '●', title: 'User Query', desc: 'Natural language input. No SQL. No API keys. Just intent.', tag: 'Input Layer' },
  discovering: { n: '02', icon: '◼', title: 'LLM Reasoning', desc: 'Claude parses intent, decomposes the task, and selects the right tools.', tag: 'Claude Sonnet' },
  connecting:  { n: '03', icon: '▲',  title: 'MCP Discovery', desc: 'Dynamic tool registry lookup. Available tools are discovered at runtime.', tag: 'MCP Protocol' },
  retrieving:  { n: '04', icon: '◨', title: 'Service Connect', desc: 'Authenticated connections to PostgreSQL, CRM, Sheets, and Slack.', tag: 'Enterprise APIs' },
  generating:  { n: '05', icon: '▤', title: 'Data Retrieval', desc: 'Multi-source aggregation across all connected services in parallel.', tag: 'Execution' },
  done:        { n: '06', icon: '⊞', title: 'Report Delivery', desc: 'Insights synthesized, report generated, team notified — in one pass.', tag: 'Output Layer' },
};

const STAGE_ORDER = ['parsing', 'discovering', 'connecting', 'retrieving', 'generating', 'done'];

function stageIndex(id) {
  return STAGE_ORDER.indexOf(id);
}

export default function PipelineVisualizer({ stage, stageLog }) {
  const currentIdx = stageIndex(stage);

  return (
    <>
      <div className="steps-grid reveal visible">
        {STAGE_ORDER.map((stageId, idx) => {
          const content = STAGE_CONTENT[stageId];
          const isActive = idx === currentIdx && stage !== 'idle' && stage !== 'error';
          const isDone = idx < currentIdx || stage === 'done';
          const isError = stage === 'error' && idx <= currentIdx;

          // Add a subtle border glow if active
          const borderStyle = isActive ? { borderColor: 'var(--cyan)' } : isDone ? { borderColor: 'var(--violet)' } : isError ? { borderColor: 'var(--violet)' } : {};

          return (
            <div 
              key={stageId} 
              className="pipe-step" 
              data-n={content.n}
              style={{
                boxShadow: isActive ? 'inset 0 0 0 1px var(--cyan)' : 'none',
                background: isActive ? 'var(--surface)' : undefined
              }}
            >
              <div className="pipe-icon" style={borderStyle}>
                {isError ? '✗' : content.icon}
              </div>
              <h3 style={{ color: isActive ? 'var(--cyan)' : undefined }}>
                {content.title}
              </h3>
              <p>{content.desc}</p>
              <span className="pipe-tag" style={isActive ? { color: 'var(--cyan)', borderColor: 'var(--cyan)' } : {}}>
                {content.tag}
              </span>
            </div>
          );
        })}
      </div>

      {/* Execution Log */}
      {stageLog.length > 0 && (
        <div style={{ marginTop: '20px', background: 'var(--bg2)', border: '1px solid var(--border)', padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gray)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Execution Log
          </div>
          <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {stageLog.map((entry, i) => (
              <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--gray)' }}>
                <span style={{ color: 'var(--gray2)', marginRight: '12px' }}>
                  {new Date(entry.time).toLocaleTimeString('en-US', { hour12: false })}
                </span>
                <span style={{ color: 'var(--violet2)', marginRight: '12px' }}>
                  [{entry.stage}]
                </span>
                <span style={{ color: 'var(--white)' }}>{entry.detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
