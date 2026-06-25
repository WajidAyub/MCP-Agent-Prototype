import { useState } from 'react';
import styles from './ArchDiagram.module.css';

/* ── Part 1 nodes ── */
const P1_NODES = [
  { id:'user',      label:'User Query',            sub:'Natural language input',          type:'neutral' },
  { id:'gateway',   label:'API Gateway',           sub:'Auth · rate limiting · routing',  type:'purple'  },
  { id:'llm',       label:'LLM Agent (Claude)',    sub:'Intent parsing · tool selection', type:'indigo'  },
  { id:'mcp',       label:'MCP Tool Layer',        sub:'Dynamic discovery & routing',     type:'teal'    },
  { id:'reasoning', label:'Context-Aware Reasoning',sub:'Synthesize results · generate',  type:'purple'  },
  { id:'report',    label:'Report Delivered',      sub:'To user',                         type:'neutral' },
];

const SERVICES = [
  { id:'pg',     label:'PostgreSQL',     sub:'Sales data',   color:'#336791' },
  { id:'crm',    label:'CRM',           sub:'Leads, deals', color:'#00a1e0' },
  { id:'sheets', label:'Google Sheets', sub:'Export',       color:'#0f9d58' },
  { id:'slack',  label:'Slack',         sub:'Alerts',       color:'#4a154b' },
  { id:'email',  label:'Email/Cal',     sub:'Scheduling',   color:'#ea4335' },
];

const TOOL_MAP = { pg:'postgres', crm:'crm', sheets:'sheets', slack:'slack', email:'email' };

/* ── Part 2 ReAct nodes ── */
const P2_NODES = [
  { id:'receive', label:'Receive query + history', color:'neutral' },
  { id:'think',   label:'THINK (LLM reasons)',     sub:'What do I need? What tool fits?', color:'purple' },
  { id:'decide',  label:'Tool needed?',             sub:'Decision gate',                  color:'amber'  },
  { id:'act',     label:'ACT (call tool)',          sub:'MCP tool invocation',             color:'teal'   },
  { id:'observe', label:'OBSERVE',                  sub:'Parse tool result',               color:'green'  },
  { id:'update',  label:'Update context window',   sub:'Append tool results to history',  color:'indigo' },
  { id:'final',   label:'Final answer',             sub:'Exit loop',                       color:'neutral'},
];

export default function ArchDiagram({ activeTools, activeReActNode, loopState }) {
  const [tab, setTab] = useState('p1');

  return (
    <div className={`glass-card ${styles.panel}`}>
      <div className={styles.header}>
        <span className="section-label">Architecture</span>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'p1' ? styles.tabActive : ''}`}
            onClick={() => setTab('p1')}
          >
            Part 1 · Pipeline
          </button>
          <button
            className={`${styles.tab} ${tab === 'p2' ? styles.tabActive : ''}`}
            onClick={() => setTab('p2')}
          >
            Part 2 · ReAct
          </button>
          <button
            className={styles.tab}
            onClick={() => document.getElementById('tech-stack-section')?.scrollIntoView({ behavior: 'smooth' })}
            title="Jump to the interactive Tech Stack section below"
          >
            Part 3 ↓
          </button>
        </div>
      </div>

      {/* ── Part 1 Diagram ── */}
      {tab === 'p1' && (
        <div className={styles.diagram}>
          {['user','gateway','llm','mcp'].map(id => {
            const n = P1_NODES.find(x => x.id === id);
            return (
              <div key={id} className={styles.nodeGroup}>
                <div className={`${styles.node} ${styles[`type_${n.type}`]}`}>
                  <div className={styles.nodeLabel}>{n.label}</div>
                  <div className={styles.nodeSub}>{n.sub}</div>
                </div>
                <div className={styles.arrow} />
              </div>
            );
          })}

          {/* Services row */}
          <div className={styles.servicesRow}>
            {SERVICES.map(svc => {
              const isActive = activeTools.includes(TOOL_MAP[svc.id]);
              return (
                <div
                  key={svc.id}
                  className={`${styles.serviceNode} ${isActive ? styles.serviceActive : ''}`}
                  style={isActive ? { '--svc-color': svc.color } : {}}
                >
                  <div className={styles.svcLabel}>{svc.label}</div>
                  <div className={styles.svcSub}>{svc.sub}</div>
                </div>
              );
            })}
          </div>

          <div className={styles.arrow} />
          <div className={`${styles.node} ${styles.type_purple}`}>
            <div className={styles.nodeLabel}>{P1_NODES[4].label}</div>
            <div className={styles.nodeSub}>{P1_NODES[4].sub}</div>
          </div>
          <div className={styles.arrow} />
          <div className={`${styles.node} ${styles.type_neutral}`}>
            <div className={styles.nodeLabel}>{P1_NODES[5].label}</div>
            <div className={styles.nodeSub}>{P1_NODES[5].sub}</div>
          </div>
        </div>
      )}

      {tab === 'p2' && (
        <div className={styles.diagram}>
          {/* Receive node */}
          <P2Node node={P2_NODES[0]} active={false} />
          <div className={styles.arrow} />

          {/* Dashed loop box */}
          <div className={styles.loopBox}>
            <div className={styles.loopBoxLabel}>ReAct reasoning loop</div>

            {/* THINK */}
            <P2Node node={P2_NODES[1]} active={activeReActNode === 'think'} />
            <div className={styles.arrowShort} />

            {/* DECIDE row with branches */}
            <div className={styles.decideRow}>
              {/* No branch exits left */}
              <div className={styles.noBranch}>
                <div className={styles.noBranchLine} />
                <div className={`${styles.finalBox} ${loopState === 'done' ? styles.finalBoxActive : ''}`}>
                  <div className={styles.nodeLabel}>Final answer</div>
                  <div className={styles.nodeSub}>Exit loop</div>
                </div>
              </div>

              {/* Center: DECIDE */}
              <div className={styles.decideCenter}>
                <P2Node node={P2_NODES[2]} active={activeReActNode === 'decide'} />
              </div>

              {/* Yes branch goes right */}
              <div className={styles.yesBranch}>
                <div className={styles.yesBranchLine} />
                <P2Node node={P2_NODES[3]} active={activeReActNode === 'act'} small />
              </div>
            </div>

            <div className={styles.arrowShort} />

            {/* OBSERVE */}
            <P2Node node={P2_NODES[4]} active={activeReActNode === 'observe'} />
            <div className={styles.arrowShort} />

            {/* UPDATE */}
            <P2Node node={P2_NODES[5]} active={activeReActNode === 'update'} />

            {/* Loop-back arrow label */}
            <div className={styles.loopBack}>↺ next iteration</div>
          </div>
        </div>
      )}

      <div className={styles.footer}>
        {tab === 'p1'
          ? 'Service nodes highlight as the agent connects to them'
          : 'ReAct nodes glow as the agent reasons through each iteration'}
      </div>
    </div>
  );
}

function P2Node({ node, active, small }) {
  const colorMap = {
    neutral: styles.type_neutral,
    purple:  styles.type_purple,
    amber:   styles.type_amber,
    teal:    styles.type_teal,
    green:   styles.type_green,
    indigo:  styles.type_indigo,
  };

  return (
    <div className={`
      ${styles.node}
      ${colorMap[node.color] || ''}
      ${active ? styles.nodeActive : ''}
      ${small  ? styles.nodeSmall  : ''}
    `}>
      <div className={styles.nodeLabel}>{node.label}</div>
      {node.sub && <div className={styles.nodeSub}>{node.sub}</div>}
    </div>
  );
}
