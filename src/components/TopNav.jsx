import { useState, useEffect } from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';
import '../styles/figma-ui.css';

export default function TopNav({ activeMenu = 'Home' }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`top-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-left">
        <div className="netflix-logo" onClick={() => window.scrollTo(0,0)}>SHRISHTI'S</div>
        <ul className="nav-links">
          <li className={activeMenu === 'Home' ? 'active' : ''}>Home</li>
          <li className={activeMenu === 'Shows' ? 'active' : ''}>Shows</li>
          <li className={activeMenu === 'Movies' ? 'active' : ''}>Movies</li>
          <li className={activeMenu === 'New & Popular' ? 'active' : ''}>New & Popular</li>
          <li className={activeMenu === 'My List' ? 'active' : ''}>My List</li>
        </ul>
      </div>
      <div className="nav-right">
        <Search size={22} className="nav-icon" />
        <span className="nav-icon" style={{ fontSize: '14px', fontWeight: 'bold' }}>Kids</span>
        <Bell size={22} className="nav-icon" />
        <div className="nav-icon">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&q=80" alt="Avatar" className="avatar" />
          <ChevronDown size={16} style={{ marginLeft: '4px' }} />
        </div>
      </div>
    </nav>
  );
}
