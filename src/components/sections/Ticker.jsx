import styled, { keyframes } from 'styled-components';

const tickerItems = [
  { dot: '',      text: 'DYNAMIC TOOL DISCOVERY' },
  { dot: 'cyan',  text: 'REACT REASONING LOOP' },
  { dot: 'green', text: 'MULTI-STEP ORCHESTRATION' },
  { dot: '',      text: 'ENTERPRISE INTEGRATIONS' },
  { dot: 'cyan',  text: 'CONTEXT-AWARE REASONING' },
  { dot: 'green', text: 'CLAUDE SONNET 4.6' },
  { dot: '',      text: 'POSTGRESQL · CRM · SLACK · SHEETS' },
  { dot: 'cyan',  text: 'PRODUCTION AI SYSTEMS' },
  { dot: 'green', text: 'AGENTIC ARCHITECTURE' },
  { dot: '',      text: 'MCP PROTOCOL v1.0' },
];

const tickerAnim = keyframes`
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
`;

const TickerWrap = styled.div`
  position: relative;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: var(--bg2);
  overflow: hidden;
  padding: 12px 0;
  z-index: 1;
`;

const TickerTrack = styled.div`
  display: flex;
  gap: 0;
  animation: ${tickerAnim} 22s linear infinite;
  white-space: nowrap;
`;

const TickerItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 0 32px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--gray2);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  border-right: 1px solid var(--border);
`;

const TickerDot = styled.span`
  width: 6px; height: 6px;
  border-radius: 50%;
  background: ${({ $color }) => 
    $color === 'cyan' ? 'var(--cyan)' : 
    $color === 'green' ? 'var(--green)' : 
    'var(--violet)'};
  flex-shrink: 0;
`;

export default function Ticker() {
  return (
    <TickerWrap>
      <TickerTrack>
        {[...tickerItems, ...tickerItems].map((i, idx) => (
          <TickerItem key={idx}>
            <TickerDot $color={i.dot} />{i.text}
          </TickerItem>
        ))}
      </TickerTrack>
    </TickerWrap>
  );
}
