import { useState } from 'react';
import { LAYERS } from '../data/techStackData';

export default function TechStack() {
  const [activeNode, setActiveNode] = useState(null);

  const getActiveNodeData = () => {
    if (!activeNode) return null;
    const layer = LAYERS.find(l => l.id === activeNode.layerId);
    return layer?.nodes.find(n => n.id === activeNode.nodeId) ?? null;
  };
  const nodeData = getActiveNodeData();

  return (
    <>
      <div className="stack-layers reveal visible">
        {LAYERS.map((layer) => (
          <div key={layer.id} className="stack-row">
            <div className="stack-label">
              <span className="stack-layer-num">Layer {layer.number}</span>
              <span className="stack-layer-name">{layer.label.split('—')[1]?.trim() ?? layer.label}</span>
            </div>
            <div className="stack-items">
              {layer.nodes.map(node => (
                <button
                  key={node.id}
                  className="stack-chip"
                  onClick={() => setActiveNode({ layerId: layer.id, nodeId: node.id })}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: activeNode?.nodeId === node.id ? 'var(--violet)' : undefined,
                    color: activeNode?.nodeId === node.id ? 'var(--white)' : undefined,
                    borderColor: activeNode?.nodeId === node.id ? 'var(--violet)' : undefined,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseOver={(e) => {
                    if (activeNode?.nodeId !== node.id) {
                      e.target.style.borderColor = 'var(--cyan)';
                      e.target.style.color = 'var(--cyan)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (activeNode?.nodeId !== node.id) {
                      e.target.style.borderColor = 'var(--border)';
                      e.target.style.color = 'var(--gray)';
                    }
                  }}
                >
                  {node.icon && <span>{node.icon}</span>}
                  <span>{node.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Deep Dive Drawer (Modal style for single page) */}
      {nodeData && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(5, 8, 20, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--violet)',
            boxShadow: '0 0 40px rgba(123, 47, 255, 0.15)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '30px',
            position: 'relative'
          }}>
            <button 
              onClick={() => setActiveNode(null)}
              style={{
                position: 'absolute', top: '20px', right: '20px',
                background: 'none', border: 'none', color: 'var(--gray)', cursor: 'pointer',
                fontSize: '20px'
              }}
            >
              ✕
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <span style={{ fontSize: '32px' }}>{nodeData.icon}</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '24px', color: 'var(--white)', fontFamily: 'var(--font-display)', letterSpacing: '1px' }}>{nodeData.label}</h3>
                <div style={{ color: 'var(--cyan)', fontSize: '12px', fontFamily: 'var(--font-mono)', letterSpacing: '1px' }}>DEEP DIVE</div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ color: 'var(--gray)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>What it does</h4>
              <p style={{ color: 'var(--gray)', fontSize: '14px', lineHeight: 1.6 }}>{nodeData.what}</p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ color: 'var(--gray)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>How to implement</h4>
              <ul style={{ paddingLeft: '20px', color: 'var(--gray)', fontSize: '14px', lineHeight: 1.6 }}>
                {nodeData.how.map((step, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: step.replace(/`([^`]+)`/g, '<code style="background:var(--bg2);padding:2px 6px;border-radius:4px;color:var(--cyan);font-family:var(--font-mono);font-size:12px;">$1</code>') }} />
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ color: 'var(--gray)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Code Snippet</h4>
              <pre style={{ background: 'var(--bg2)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)', overflowX: 'auto', color: 'var(--green)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                <code>{nodeData.code}</code>
              </pre>
            </div>

            <div>
              <h4 style={{ color: 'var(--gray)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Install</h4>
              <pre style={{ background: 'var(--bg2)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)', overflowX: 'auto', color: 'var(--white)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                <code>{nodeData.install}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
