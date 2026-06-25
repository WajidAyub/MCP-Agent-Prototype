import styled, { keyframes } from 'styled-components';
import QueryPanel from '../QueryPanel';
import ReportOutput from '../ReportOutput';

const hexPulse = keyframes`
  0% { opacity: .8; transform: scale(.6); }
  100% { opacity: 0; transform: scale(1); }
`;

const HeroContainer = styled.div`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  padding: 120px 24px 60px;
  overflow: hidden;
  z-index: 1;
`;

const Eyebrow = styled.div`
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 3px;
  color: var(--cyan);
  text-transform: uppercase;
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before, &::after {
    content: '';
    display: block;
    width: 32px; height: 4px;
    background: var(--border);
    opacity: 1;
  }
`;

const HexWrap = styled.div`
  position: relative;
  width: 180px; height: 180px;
  margin: 0 auto 36px;
`;

const HexPulseWrap = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HexRing = styled.div`
  position: absolute;
  border: 1px solid var(--violet);
  opacity: 0;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  animation: ${hexPulse} 3s ease-out infinite;

  &:nth-child(1) { width: 100%; height: 100%; animation-delay: 0s; }
  &:nth-child(2) { width: 130%; height: 130%; animation-delay: .6s; border-color: var(--cyan); }
  &:nth-child(3) { width: 165%; height: 165%; animation-delay: 1.2s; border-color: var(--violet2); }
`;

const HexCore = styled.svg`
  position: relative;
  width: 120px; height: 120px;
  z-index: 2;
`;

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(72px, 13vw, 130px);
  letter-spacing: 6px;
  line-height: .95;
  margin-bottom: 12px;
  color: var(--white);
  text-shadow: 6px 6px 0 var(--cyan);
`;

const SubtitleLine = styled.p`
  font-family: var(--font-display);
  font-size: clamp(18px, 3vw, 28px);
  letter-spacing: 8px;
  color: var(--gray);
  margin-bottom: 24px;
  text-transform: uppercase;
`;

const Desc = styled.p`
  max-width: 560px;
  font-size: 16px;
  color: var(--gray);
  line-height: 1.7;
  margin-bottom: 44px;
  font-weight: 300;

  strong {
    color: var(--white);
    font-weight: 500;
  }
`;

const Ctas = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
`;

const BtnPrimary = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  border-radius: 0;
  background: var(--violet);
  border: 3px solid var(--border);
  box-shadow: 6px 6px 0 0 var(--border);
  color: var(--bg2);
  font-family: var(--font-display);
  font-size: 20px;
  letter-spacing: 2px;
  text-decoration: none;
  font-weight: normal;
  cursor: pointer;
  transition: transform .2s, box-shadow .2s;

  &:hover {
    transform: translate(3px, 3px);
    box-shadow: 3px 3px 0 0 var(--border);
  }
`;

const BtnGhost = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  border-radius: 0;
  background: var(--green);
  border: 3px solid var(--border);
  box-shadow: 6px 6px 0 0 var(--border);
  color: var(--border);
  font-family: var(--font-display);
  font-size: 20px;
  letter-spacing: 2px;
  text-decoration: none;
  font-weight: normal;
  cursor: pointer;
  transition: transform .2s, box-shadow .2s;

  &:hover {
    transform: translate(3px, 3px);
    box-shadow: 3px 3px 0 0 var(--border);
  }
`;

const StatsBar = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 64px;
`;

const Stat = styled.div`
  padding: 20px 36px;
  border-radius: 0;
  border: 3px solid var(--border);
  box-shadow: 6px 6px 0 0 var(--border);
  background: var(--bg2);
  text-align: center;
  flex: 1;
`;

const StatNum = styled.span`
  font-family: var(--font-display);
  font-size: 32px;
  letter-spacing: 2px;
  color: var(--white);
  display: block;
`;

const StatLabel = styled.span`
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--gray2);
  text-transform: uppercase;
  margin-top: 4px;
  display: block;
`;

export default function Hero({ onRun, isRunning, onReset, apiKey, onKeyChange, report, stage, error }) {
  return (
    <HeroContainer id="hero">
      <Eyebrow>Model Context Protocol</Eyebrow>

      <HexWrap>
        <HexPulseWrap>
          <HexRing />
          <HexRing />
          <HexRing />
        </HexPulseWrap>
        <HexCore viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5" fill="var(--cyan)" stroke="var(--border)" strokeWidth="4"/>
          <polygon points="50,20 78,35 78,65 50,80 22,65 22,35" fill="var(--green)" stroke="var(--border)" strokeWidth="4"/>
          <polygon points="50,32 68,42 68,62 50,72 32,62 32,42" fill="var(--violet)" stroke="var(--border)" strokeWidth="4"/>
        </HexCore>
      </HexWrap>

      <Title>MCP AGENT</Title>
      <SubtitleLine>AI · Enterprise · Automation</SubtitleLine>
      <Desc>
        An <strong>MCP-powered AI assistant</strong> that takes natural language queries,
        discovers tools dynamically, connects to enterprise services, and
        returns production-grade reports — all in a single <strong>ReAct loop</strong>.
      </Desc>

      <div style={{ width: '100%', maxWidth: '1024px', marginBottom: '40px', zIndex: 10, position: 'relative' }}>
        <QueryPanel onRun={onRun} isRunning={isRunning} onReset={onReset} apiKey={apiKey} onKeyChange={onKeyChange} />
      </div>

      {report && (
        <div style={{ width: '100%', maxWidth: '1024px', marginBottom: '60px', zIndex: 10, position: 'relative', textAlign: 'left' }}>
          <ReportOutput report={report} stage={stage} error={error} />
        </div>
      )}

      <Ctas>
        <BtnPrimary href="#demo">EXPLORE THE CODE →</BtnPrimary>
        <BtnGhost href="#pipeline">VIEW PIPELINE</BtnGhost>
      </Ctas>

      <StatsBar>
        <Stat>
          <StatNum>15+</StatNum>
          <StatLabel>Enterprise Tools</StatLabel>
        </Stat>
        <Stat>
          <StatNum>4</StatNum>
          <StatLabel>Architecture Layers</StatLabel>
        </Stat>
        <Stat>
          <StatNum>∞</StatNum>
          <StatLabel>ReAct Iterations</StatLabel>
        </Stat>
        <Stat>
          <StatNum>&lt;1s</StatNum>
          <StatLabel>Tool Discovery</StatLabel>
        </Stat>
      </StatsBar>
    </HeroContainer>
  );
}
