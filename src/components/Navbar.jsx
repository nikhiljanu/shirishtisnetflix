import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, X, ChevronDown, Check, User, HelpCircle, ArrowRight, Settings } from 'lucide-react';
import '../styles/navbar.css';

export default function Navbar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  myListCount,
  onResetHome
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 200);
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'tv', label: 'TV Shows' },
    { id: 'movies', label: 'Movies' },
    { id: 'popular', label: 'New & Popular' },
    { id: 'my-list', label: `My List ${myListCount > 0 ? `(${myListCount})` : ''}` },
    { id: 'languages', label: 'Browse by Languages' }
  ];

  return (
    <nav className={`netflix-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-left">
        {/* Netflix Brand Logo */}
        <div 
          className="brand-logo" 
          onClick={onResetHome}
          title="Netflix Home"
        >
          <span className="netflix-brand-text">NETFLIX</span>
        </div>

        {/* Navigation Items */}
        <ul className="nav-menu">
          {navLinks.map((link) => (
            <li 
              key={link.id}
              className={`nav-item ${activeTab === link.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(link.id);
                if (link.id === 'home') onResetHome();
              }}
            >
              {link.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="nav-right">
        {/* Search Bar */}
        <div className={`search-box ${isSearchOpen || searchQuery ? 'open' : ''}`}>
          <button 
            className="search-btn" 
            onClick={handleSearchToggle}
            aria-label="Search"
            title="Search"
          >
            <Search size={19} />
          </button>
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            placeholder="Titles, people, genres"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="search-clear-btn" 
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Children Profile Mode */}
        <button className="children-mode-btn" title="Children's Profile">
          Children
        </button>

        {/* Notifications */}
        <div className="nav-action-wrapper">
          <button 
            className="icon-btn bell-btn" 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            title="Notifications"
          >
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>

          {showNotifications && (
            <div className="dropdown-panel notifications-dropdown">
              <div className="dropdown-header">
                <span>Recent Notifications</span>
              </div>
              <div className="dropdown-list">
                <div className="notification-item">
                  <img src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=120&q=80" alt="Squid Game" />
                  <div className="notif-content">
                    <p className="notif-title">New Season Coming Soon</p>
                    <p className="notif-desc">Squid Game Season 2 is arriving shortly.</p>
                    <span className="notif-time">2 days ago</span>
                  </div>
                </div>
                <div className="notification-item">
                  <img src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=120&q=80" alt="Why Did I Get Married Again" />
                  <div className="notif-content">
                    <p className="notif-title">Now Streaming</p>
                    <p className="notif-desc">Tyler Perry's Why Did I Get Married Again?</p>
                    <span className="notif-time">Today</span>
                  </div>
                </div>
                <div className="notification-item">
                  <img src="https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=120&q=80" alt="Wednesday" />
                  <div className="notif-content">
                    <p className="notif-title">Top 10 in India</p>
                    <p className="notif-desc">Wednesday is trending #4 in India today.</p>
                    <span className="notif-time">4 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="nav-action-wrapper">
          <div 
            className="profile-trigger"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
          >
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
              alt="Profile avatar" 
              className="profile-avatar"
            />
            <ChevronDown size={15} className={`chevron-icon ${showProfileMenu ? 'rotated' : ''}`} />
          </div>

          {showProfileMenu && (
            <div className="dropdown-panel profile-dropdown">
              <div className="profile-list">
                <div className="profile-switch-item active">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                    alt="Deepanshu" 
                    className="avatar-small" 
                  />
                  <span>deepanshusaini796</span>
                  <Check size={16} className="active-check" />
                </div>
                <div className="profile-switch-item">
                  <div className="avatar-small kids-avatar">Kids</div>
                  <span>Children</span>
                </div>
              </div>

              <div className="dropdown-divider" />

              <div className="menu-links">
                <div className="menu-link-item">
                  <Settings size={16} />
                  <span>Manage Profiles</span>
                </div>
                <div className="menu-link-item">
                  <User size={16} />
                  <span>Account</span>
                </div>
                <div className="menu-link-item">
                  <HelpCircle size={16} />
                  <span>Help Center</span>
                </div>
              </div>

              <div className="dropdown-divider" />

              <div className="signout-btn">
                <span>Sign Out of Netflix</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
