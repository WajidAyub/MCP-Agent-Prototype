import { useEffect, useRef } from 'react';
import { TOOLS } from '../lib/toolDetector';
import styles from './ContextWindow.module.css';

const TOOL_COLORS = {
  postgres: '#336791',
  crm:      '#00a1e0',
  sheets:   '#0f9d58',
  slack:    '#611f69',
  email:    '#ea4335',
  github:   '#6e40c9',
};

export default function ContextWindow({ contextLog, iteration, maxIter, loopState }) {
  const bottomRef = useRef(null);

  // Auto-scroll to latest entry
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [contextLog]);

  const isIdle = loopState === 'idle';
  const isDone = loopState === 'done';

  return (
    <div className={`glass-card ${styles.panel}`}>
      <div className={styles.header}>
        <span className="section-label">Context Window</span>
        <div className={styles.headerRight}>
          {!isIdle && (
            <span className={styles.tokenCount}>
              ~{contextLog.length * 340 + 120} tokens
            </span>
          )}
          {isDone && (
            <span className={`chip chip-green ${styles.fullChip}`}>Context Full</span>
          )}
        </div>
      </div>

      {/* Token bar */}
      {!isIdle && (
        <div className={styles.tokenBar}>
          <div
            className={styles.tokenFill}
            style={{ width: `${Math.min((contextLog.length / maxIter) * 100, 100)}%` }}
          />
        </div>
      )}

      {/* Empty state */}
      {isIdle && (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🗂️</span>
          <span>Tool call history will appear here as the agent reasons…</span>
        </div>
      )}

      {/* Log entries */}
      {!isIdle && (
        <div className={styles.logWrap}>
          {contextLog.length === 0 && (
            <div className={styles.waitRow}>
              <span className={styles.waitDot} /> Waiting for first iteration…
            </div>
          )}

          {contextLog.map((entry, i) => (
            <div
              key={i}
              className={`${styles.entry} ${entry.isFinal ? styles.entryFinal : ''}`}
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              {/* Iteration badge */}
              <div className={styles.entryHeader}>
                <span className={styles.iterBadge}>#{entry.iteration}</span>
                {entry.tool && (
                  <span
                    className={styles.toolTag}
                    style={{ borderColor: TOOL_COLORS[entry.tool] + '55', color: TOOL_COLORS[entry.tool] }}
                  >
                    {TOOLS.find(t => t.id === entry.tool)?.icon}{' '}
                    {entry.toolLabel || entry.tool}
                  </span>
                )}
                {entry.isFinal && (
                  <span className={styles.finalTag}>✅ Final Answer</span>
                )}
              </div>

              {/* Thought */}
              <div className={styles.thought}>
                <span className={styles.thoughtLabel}>THINK</span>
                <span className={styles.thoughtText}>{entry.thought}</span>
              </div>

              {/* Result */}
              <div className={`${styles.result} ${entry.isFinal ? styles.resultFinal : ''}`}>
                <span className={styles.resultLabel}>{entry.isFinal ? 'EXIT' : 'OBSERVE'}</span>
                <span className={styles.resultText}>{entry.result}</span>
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>
      )}

      {/* Footer */}
      {!isIdle && (
        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            <span className={styles.footerDot} />
            <span className={styles.footerText}>
              {isDone
                ? `Loop exited · ${contextLog.length} iterations · context synthesized`
                : `Iteration ${iteration} of ~${maxIter} running…`}
            </span>
          </div>
          <span className={styles.footerEntries}>{contextLog.length} entries</span>
        </div>
      )}
    </div>
  );
}
