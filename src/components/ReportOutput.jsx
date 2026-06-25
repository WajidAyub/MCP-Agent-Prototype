import { useState, useEffect } from 'react';
import styles from './ReportOutput.module.css';

/**
 * Very lightweight Markdown → HTML renderer.
 * Supports: h1-h3, bold, italic, code, tables, lists, blockquote, hr, pre blocks.
 */
function renderMarkdown(md) {
  if (!md) return '';
  let html = md;

  // Fenced code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/gm, (_, lang, code) =>
    `<pre><code class="lang-${lang || 'text'}">${escHtml(code.trimEnd())}</code></pre>`
  );

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold / italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Blockquote
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

  // HR
  html = html.replace(/^---+$/gm, '<hr/>');

  // Tables
  html = html.replace(/((?:\|.+\|\n)+)/gm, tableBlock => renderTable(tableBlock));

  // Ordered list
  html = html.replace(/((?:^\d+\. .+\n?)+)/gm, block =>
    '<ol>' + block.split('\n').filter(Boolean).map(l => `<li>${l.replace(/^\d+\. /, '')}</li>`).join('') + '</ol>'
  );

  // Unordered list
  html = html.replace(/((?:^[-*] .+\n?)+)/gm, block =>
    '<ul>' + block.split('\n').filter(Boolean).map(l => `<li>${l.replace(/^[-*] /, '')}</li>`).join('') + '</ul>'
  );

  // Paragraphs (double newline)
  html = html.replace(/\n\n+/g, '</p><p>');
  html = `<p>${html}</p>`;

  // Clean up: remove <p> wrapping around block elements
  html = html.replace(/<p>(<(?:h[123]|ul|ol|pre|blockquote|hr|table)[\s\S]*?<\/(?:h[123]|ul|ol|pre|blockquote|table)>)<\/p>/g, '$1');
  html = html.replace(/<p>(<hr\/>)<\/p>/g, '$1');
  html = html.replace(/<p>\s*<\/p>/g, '');

  return html;
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function renderTable(block) {
  const rows = block.trim().split('\n').filter(r => r.trim());
  if (rows.length < 2) return block;
  const headers = rows[0].split('|').slice(1,-1).map(h => h.trim());
  // skip separator row (index 1)
  const bodyRows = rows.slice(2);
  return `<table>
    <thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${bodyRows.map(r=>{
      const cells = r.split('|').slice(1,-1).map(c=>c.trim());
      return `<tr>${cells.map(c=>`<td>${c}</td>`).join('')}</tr>`;
    }).join('')}</tbody>
  </table>`;
}

export default function ReportOutput({ report, stage, error }) {
  const [copied, setCopied] = useState(false);
  const isDone = stage === 'done';
  const isGenerating = stage === 'generating';
  const hasContent = report.length > 0;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mcp-agent-report.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    // Opens browser print dialog — user can Save as PDF
    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html><html><head>
        <title>MCP Agent Report</title>
        <style>
          body{font-family:system-ui,sans-serif;max-width:800px;margin:40px auto;padding:0 24px;color:#111;line-height:1.7}
          h1{font-size:1.8rem;margin-bottom:8px}h2{font-size:1.3rem;border-bottom:1px solid #e5e7eb;padding-bottom:6px;margin-top:28px}
          h3{color:#4f46e5}pre,code{background:#f3f4f6;border-radius:6px;font-size:13px}pre{padding:12px;overflow-x:auto}
          table{width:100%;border-collapse:collapse}th{background:#f3f4f6;text-align:left;padding:8px 12px}td{padding:8px 12px;border-bottom:1px solid #e5e7eb}
          @media print{body{margin:0}}
        </style>
      </head><body>${document.querySelector('.md-output') ? document.querySelector('.md-output').innerHTML : report}</body></html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  const renderedHtml = renderMarkdown(report);

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
        <span className="section-eyebrow" style={{ margin: 0 }}>Report Output</span>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {hasContent && (
            <>
              <button id="copy-btn" className="btn btn-ghost" onClick={handleCopy}>
                {copied ? '✓ Copied' : '⎘ Copy'}
              </button>
              {isDone && (
                <>
                  <button id="export-btn" className="btn btn-secondary" onClick={handleExport}>
                    ↓ Export .md
                  </button>
                  <button id="print-btn" className="btn btn-secondary" onClick={handlePrint}>
                    🖨 PDF
                  </button>
                </>
              )}
            </>
          )}
          {isGenerating && (
            <span className={styles.streamingPill}>
              <span className={styles.streamDot} />
              Streaming
            </span>
          )}
          {isDone && (
            <span className={`chip chip-green ${styles.donePill}`}>
              ✓ Complete
            </span>
          )}
        </div>
      </div>

      <div className={styles.outputArea}>
        {/* Empty state */}
        {!hasContent && !error && stage === 'idle' && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <div className={styles.emptyTitle}>Report will appear here</div>
            <div className={styles.emptyDesc}>
              Enter a query above and click Run Agent to generate an enterprise report via the MCP pipeline.
            </div>
          </div>
        )}

        {/* Waiting for pipeline stages */}
        {!hasContent && !error && stage !== 'idle' && stage !== 'done' && !isGenerating && (
          <div className={styles.waitingState}>
            <div className={styles.waitSpinner} />
            <span>Pipeline running — report will appear when generation begins…</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className={styles.errorBox}>
            <div className={styles.errorTitle}>⚠️ Pipeline Error</div>
            <div className={styles.errorMsg}>{error}</div>
            <div className={styles.errorHint}>
              Check your API key (sk-ant-…) or try demo mode by leaving the key field empty.
            </div>
          </div>
        )}

        {/* Report content */}
        {hasContent && (
          <>
            <div
              className={`md-output ${styles.mdContent}`}
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
            {isGenerating && (
              <span className={styles.cursor} />
            )}
          </>
        )}
      </div>

      {isDone && (
        <div className={styles.footer}>
          <span className={styles.footerText}>
            ◼ Generated via MCP Agent · {new Date().toLocaleString()}
          </span>
          <span className={styles.wordCount}>
            ~{Math.round(report.split(' ').length)} words
          </span>
        </div>
      )}
    </div>
  );
}
