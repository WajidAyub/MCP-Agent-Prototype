import styles from './Header.module.css';

export default function Header({ apiKey, setApiKey, stage }) {
  const isRunning = !['idle', 'done', 'error'].includes(stage || 'idle');
  const hasKey    = apiKey && apiKey.trim().length > 10;

  const statusMode = isRunning ? 'running' : hasKey ? 'live' : 'demo';
  const statusConfig = {
    running: { dot: styles.dotRunning, label: 'Running…',          cls: styles.statusRunning  },
    live:    { dot: styles.dotLive,    label: 'Live · Claude Sonnet', cls: styles.statusLive    },
    demo:    { dot: styles.dotDemo,    label: 'Demo Mode',            cls: styles.statusDemo    },
  }[statusMode];

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Logo + Title */}
        <div className={styles.brand}>
          <div className={styles.logoMark}>
            <span className={styles.logoIcon}>⬡</span>
            <span className={styles.logoIconInner}>⬡</span>
          </div>
          <div>
            <h1 className={styles.title}>MCP Agent</h1>
            <p className={styles.subtitle}>Model Context Protocol · AI Assistant</p>
          </div>
        </div>

        {/* Status Pill + API Key */}
        <div className={styles.controls}>
          <div className={`${styles.statusRow} ${statusConfig.cls}`}>
            <span className={`${styles.statusDot} ${statusConfig.dot}`} />
            <span className={styles.statusLabel}>{statusConfig.label}</span>
          </div>

          <div className={styles.apiKeyWrap}>
            <span className={styles.keyIcon}>🔑</span>
            <input
              id="api-key-input"
              type="password"
              className={styles.apiKeyInput}
              placeholder="sk-ant-… (optional — uses demo mode without key)"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      {/* Gradient line */}
      <div className={styles.gradLine} />
    </header>
  );
}
