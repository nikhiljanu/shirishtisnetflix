import { useState, useEffect, useRef } from 'react';
import { Search, Bell, ChevronDown, X, Check } from 'lucide-react';
import '../styles/figma-ui.css';

export default function TopNav({ 
  activeMenu = 'Home', 
  onSelectMenu, 
  searchQuery = '', 
  onSearchChange,
  isKidsMode = false,
  onToggleKids,
  notificationThumb
}) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const searchInputRef = useRef(null);

  const menuItems = ['Home', 'Shows', 'Movies', 'New & Popular', 'My List'];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.nav-dropdown-wrapper') && !e.target.closest('.nav-browse-mobile')) {
        setNotifOpen(false);
        setProfileOpen(false);
        setBrowseOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearchToggle = () => {
    if (!searchOpen) {
      setSearchOpen(true);
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else if (!searchQuery) {
      setSearchOpen(false);
    }
  };

  return (
    <nav className={`top-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-left">
        {/* Original Netflix Logo */}
        <div 
          className="netflix-logo" 
          onClick={() => {
            onSelectMenu?.('Home');
            onSearchChange?.('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          title="Netflix Home"
        >
          NETFLIX
        </div>

        {/* Desktop Nav Links */}
        <ul className="nav-links">
          {menuItems.map((item) => (
            <li 
              key={item}
              className={activeMenu === item && !searchQuery ? 'active' : ''}
              onClick={() => {
                onSelectMenu?.(item);
                onSearchChange?.('');
              }}
            >
              {item}
            </li>
          ))}
        </ul>

        {/* Mobile / Tablet 'Browse' Dropdown */}
        <div className="nav-browse-mobile">
          <button 
            className="browse-btn" 
            onClick={() => setBrowseOpen(!browseOpen)}
            aria-label="Browse Menu"
          >
            <span>{activeMenu}</span>
            <ChevronDown size={14} className={`browse-caret ${browseOpen ? 'open' : ''}`} />
          </button>

          {browseOpen && (
            <div className="browse-dropdown-menu">
              <div className="browse-dropdown-notch" />
              {menuItems.map((item) => (
                <div 
                  key={item} 
                  className={`browse-dropdown-item ${activeMenu === item ? 'active' : ''}`}
                  onClick={() => {
                    onSelectMenu?.(item);
                    onSearchChange?.('');
                    setBrowseOpen(false);
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="nav-right">
        {/* Interactive Search Bar */}
        <div className={`nav-search-box ${searchOpen || searchQuery ? 'open' : ''}`}>
          <button 
            className="nav-search-btn" 
            onClick={handleSearchToggle}
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          
          {(searchOpen || searchQuery) && (
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Titles, people, genres" 
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="nav-search-input"
            />
          )}

          {searchQuery && (
            <button 
              className="nav-search-clear" 
              onClick={() => {
                onSearchChange?.('');
                searchInputRef.current?.focus();
              }}
              aria-label="Clear Search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Kids Mode Toggle */}
        <button 
          className={`nav-kids-btn ${isKidsMode ? 'active' : ''}`}
          onClick={onToggleKids}
          title={isKidsMode ? "Exit Kids Mode" : "Switch to Kids Mode"}
        >
          Kids
        </button>

        {/* Notifications Dropdown */}
        <div className="nav-dropdown-wrapper">
          <button 
            className="nav-icon-btn" 
            onClick={(e) => {
              e.stopPropagation();
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="notif-badge">2</span>
          </button>

          {notifOpen && (
            <div className="nav-dropdown notif-dropdown">
              <div className="dropdown-notch" />
              <div className="notif-dropdown-header">Notifications</div>
              <div className="notif-list">
                <div 
                  className="notif-item" 
                  onClick={() => {
                    onSelectMenu?.('Shows');
                    setNotifOpen(false);
                  }}
                >
                  {notificationThumb && (
                    <img src={notificationThumb} alt="Notification Preview" className="notif-thumb" />
                  )}
                  <div className="notif-details">
                    <div className="notif-title">New Arrival: Diwali Diaries</div>
                    <div className="notif-desc">Watch the latest trending episode now.</div>
                    <div className="notif-time">Just now</div>
                  </div>
                </div>

                <div 
                  className="notif-item" 
                  onClick={() => {
                    onSelectMenu?.('Movies');
                    setNotifOpen(false);
                  }}
                >
                  <div className="notif-details">
                    <div className="notif-title">Top 10 in your country today</div>
                    <div className="notif-desc">Explore today's most-watched blockbusters.</div>
                    <div className="notif-time">1 day ago</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Dropdown */}
        <div className="nav-dropdown-wrapper">
          <div 
            className="nav-profile-trigger" 
            onClick={(e) => {
              e.stopPropagation();
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
          >
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&q=80" 
              alt="Profile Avatar" 
              className="avatar" 
            />
            <ChevronDown size={14} className={`profile-caret ${profileOpen ? 'open' : ''}`} />
          </div>

          {profileOpen && (
            <div className="nav-dropdown profile-dropdown">
              <div className="dropdown-notch" />
              
              <div className="profile-menu-item active-profile">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&q=80" 
                  alt="Avatar" 
                  className="avatar-sm" 
                />
                <span>User</span>
                <Check size={16} style={{ marginLeft: 'auto', color: '#E50914' }} />
              </div>
              
              <div className="profile-menu-divider" />
              
              <div className="profile-menu-item" onClick={() => setProfileOpen(false)}>Manage Profiles</div>
              <div className="profile-menu-item" onClick={() => setProfileOpen(false)}>Transfer Profile</div>
              <div className="profile-menu-item" onClick={() => setProfileOpen(false)}>Account</div>
              <div className="profile-menu-item" onClick={() => setProfileOpen(false)}>Help Centre</div>
              
              <div className="profile-menu-divider" />
              
              <div 
                className="profile-menu-item logout" 
                onClick={() => {
                  setProfileOpen(false);
                  alert('You have signed out of Netflix.');
                }}
              >
                Sign out of Netflix
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
