import { useState } from 'react';

const PRESETS = [
  { label: '▤ Sales Report',     query: 'Generate a quarterly sales performance report comparing Q2 vs Q1...' },
  { label: '◎ CRM Sync',         query: 'Identify high-risk churning customers in our CRM...' },
  { label: '▲ Deploy Alert',      query: 'Summarize recent GitHub deployments...' },
];

export default function QueryPanel({ onRun, isRunning, onReset, apiKey, onKeyChange }) {
  const [query, setQuery] = useState('');

  const handlePreset = (preset) => setQuery(preset.query);

  const handleRun = () => {
    if (!query.trim() || isRunning) return;
    onRun(query.trim());
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleRun();
  };

  return (
    <div style={{
      background: 'var(--bg2)',
      border: '3px solid var(--border)',
      borderRadius: '0',
      padding: '30px',
      boxShadow: '8px 8px 0 0 var(--border)',
      width: '100%',
      textAlign: 'left'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div className="section-eyebrow" style={{ margin: 0 }}>Natural Language Query</div>
        <div style={{ fontSize: '11px', color: 'var(--gray)', fontFamily: 'var(--font-mono)' }}>Ctrl+Enter to run</div>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {PRESETS.map(p => (
          <button
            key={p.label}
            onClick={() => handlePreset(p)}
            disabled={isRunning}
            style={{
              background: query === p.query ? 'var(--cyan)' : 'var(--bg2)',
              color: query === p.query ? 'var(--bg2)' : 'var(--white)',
              border: '2px solid var(--border)',
              padding: '8px 16px',
              borderRadius: '0',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 'bold',
              boxShadow: query === p.query ? '1px 1px 0 0 var(--border)' : '4px 4px 0 0 var(--border)',
              transform: query === p.query ? 'translate(3px, 3px)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div style={{ position: 'relative' }}>
        <textarea
          style={{
            width: '100%',
            background: 'var(--bg2)',
            border: '3px solid var(--border)',
            borderRadius: '0',
            color: 'var(--white)',
            padding: '16px',
            fontFamily: 'var(--font-body)',
            fontWeight: 'bold',
            fontSize: '15px',
            lineHeight: 1.6,
            resize: 'vertical',
            minHeight: '120px',
            outline: 'none',
            transition: 'border-color 0.2s',
            boxShadow: '4px 4px 0 0 var(--border)'
          }}
          placeholder="Ask anything about your enterprise data...&#10;e.g. 'Show me Q2 sales vs Q1 for the West Coast region...'"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isRunning}
          onFocus={(e) => e.target.style.borderColor = 'var(--cyan)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
        />
        <div style={{ position: 'absolute', bottom: '15px', right: '15px', fontSize: '11px', color: 'var(--gray)', fontFamily: 'var(--font-mono)' }}>
          {query.length} chars
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginTop: '20px', alignItems: 'center' }}>
        {isRunning ? (
          <button onClick={onReset} className="btn-ghost" style={{ background: 'var(--bg2)', border: '3px solid var(--border)', borderRadius: '0', padding: '12px 24px', fontWeight: 'bold', fontFamily: 'var(--font-mono)', boxShadow: '4px 4px 0 0 var(--border)', cursor: 'pointer', color: 'var(--violet)' }}>
            ■ Stop Agent
          </button>
        ) : (
          <button onClick={handleRun} disabled={!query.trim()} className="btn-primary" style={{ background: 'var(--green)', border: '3px solid var(--border)', borderRadius: '0', padding: '12px 24px', fontWeight: 'bold', fontFamily: 'var(--font-mono)', boxShadow: '4px 4px 0 0 var(--border)', cursor: 'pointer', color: 'var(--border)', opacity: !query.trim() ? 0.5 : 1 }}>
            ▶ Run Agent
          </button>
        )}
        
        {!isRunning && (
          <button onClick={() => setQuery('')} disabled={!query} style={{ background: 'none', border: 'none', color: 'var(--gray)', cursor: 'pointer', fontSize: '13px' }}>
            Clear
          </button>
        )}

        {/* API Key Input */}
        <input 
          type="password"
          placeholder="Anthropic API Key (sk-ant-...)"
          value={apiKey || ''}
          onChange={(e) => onKeyChange && onKeyChange(e.target.value)}
          disabled={isRunning}
          style={{
            marginLeft: 'auto',
            background: 'var(--bg)',
            border: '3px solid var(--border)',
            borderRadius: '0',
            color: 'var(--white)',
            fontWeight: 'bold',
            padding: '10px 14px',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            width: '240px',
            outline: 'none',
            boxShadow: '4px 4px 0 0 var(--border)'
          }}
        />
      </div>
    </div>
  );
}
