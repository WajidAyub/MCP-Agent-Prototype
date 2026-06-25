import styled from 'styled-components';

const Nav = styled.nav`
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: 60px;
  background: var(--bg2);
  border-bottom: 4px solid var(--border);
`;

const NavLogo = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
`;

const NavHex = styled.svg`
  width: 28px; height: 28px;
`;

const NavWordmark = styled.span`
  font-family: var(--font-display);
  font-size: 20px;
  letter-spacing: 2px;
  color: var(--white);
  
  span {
    color: var(--red);
  }
`;

const NavLinks = styled.ul`
  display: flex;
  gap: 32px;
  list-style: none;
  
  button {
    font-family: var(--font-mono);
    font-size: 12px;
    padding: 8px 16px;
    border-radius: 0;
    color: var(--white);
    font-weight: bold;
    text-decoration: none;
    letter-spacing: 1px;
    transition: all .2s;
    background: transparent;
    border: 2px solid transparent;
    cursor: pointer;
    box-shadow: none;
    
    &:hover {
      background: var(--border);
      color: var(--bg2);
    }
    
    &.active {
      background: var(--violet);
      border: 2px solid var(--border);
      color: var(--white);
      box-shadow: 4px 4px 0 0 var(--border);
    }
  }
`;

const NavBadge = styled.button`
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 8px 16px;
  border-radius: 0;
  color: var(--white);
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all .2s;
  background: var(--cyan);
  border: 2px solid var(--border);
  box-shadow: 4px 4px 0 0 var(--border);
  
  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 0 var(--border);
  }
`;

export default function Navbar({ activePage, setActivePage }) {
  return (
    <Nav>
      <NavLogo href="#" onClick={(e) => { e.preventDefault(); setActivePage('home'); }}>
        <NavHex viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5" fill="var(--cyan)" stroke="var(--border)" strokeWidth="4"/>
          <polygon points="50,20 78,35 78,65 50,80 22,65 22,35" fill="var(--green)" stroke="var(--border)" strokeWidth="4"/>
          <polygon points="50,32 68,42 68,62 50,72 32,62 32,42" fill="var(--violet)" stroke="var(--border)" strokeWidth="4"/>
        </NavHex>
        <NavWordmark>MCP<span>AGENT</span></NavWordmark>
      </NavLogo>
      <NavLinks>
        <li><button className={activePage === 'home' ? 'active' : ''} onClick={() => setActivePage('home')}>HOME</button></li>
        <li><button className={activePage === 'integrations' ? 'active' : ''} onClick={() => setActivePage('integrations')}>INTEGRATIONS</button></li>
        <li><button className={activePage === 'algorithm' ? 'active' : ''} onClick={() => setActivePage('algorithm')}>ALGORITHM</button></li>
        <li><button className={activePage === 'architecture' ? 'active' : ''} onClick={() => setActivePage('architecture')}>ARCHITECTURE</button></li>
      </NavLinks>
      <NavBadge onClick={() => window.open('https://github.com/anthropics/mcp', '_blank')}>
        VIEW ON GITHUB
      </NavBadge>
    </Nav>
  );
}
