import styled from 'styled-components';

const FooterContainer = styled.footer`
  position: relative;
  z-index: 1;
  border-top: 1px solid var(--border);
  padding: 48px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;
  background: var(--bg2);
`;

const FooterBrand = styled.div`
  font-family: var(--font-display);
  font-size: 22px;
  letter-spacing: 3px;
  color: var(--gray2);
  
  span {
    color: var(--violet);
  }
`;

const FooterMeta = styled.div`
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--gray2);
  letter-spacing: 1px;
  text-align: right;
`;

export default function Footer() {
  return (
    <FooterContainer>
      <FooterBrand>MCP<span>AGENT</span></FooterBrand>
      <FooterMeta>
        BUILT WITH ANTHROPIC CLAUDE SONNET 4.6<br />
        MODEL CONTEXT PROTOCOL · REACT LOOP · ENTERPRISE AI
      </FooterMeta>
    </FooterContainer>
  );
}
