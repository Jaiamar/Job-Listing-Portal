import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiBriefcase, FiBell, FiChevronDown, FiUser, FiLogOut, FiSettings, FiMenu, FiX } from 'react-icons/fi';
import api from '../services/api';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isSeeker, isEmployer, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      api.get('/notifications').then(({ data }) => {
        setUnread(data.unreadCount || 0);
        setNotifications(data.data || []);
      }).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const dashboardPath = isSeeker ? '/seeker' : isEmployer ? '/employer' : isAdmin ? '/admin' : '/';
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-inner">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <FiBriefcase size={18} />
          </div>
          <span className="navbar-logo-text">
            Job<span className="logo-accent">Portal</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          <NavLink to="/jobs" className={({isActive}) => `navbar-link ${isActive ? 'active' : ''}`}>
            Browse Jobs
          </NavLink>
          {!user && (
            <>
              <NavLink to="/register?role=employer" className={({isActive}) => `navbar-link ${isActive ? 'active' : ''}`}>
                Post a Job
              </NavLink>
            </>
          )}
          {user && (
            <NavLink to={dashboardPath} className={({isActive}) => `navbar-link ${isActive ? 'active' : ''}`}>
              Dashboard
            </NavLink>
          )}
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          {user ? (
            <>
              {/* Notification Bell */}
              <div className="notif-wrapper" ref={notifRef}>
                <button
                  className="notif-btn"
                  onClick={() => setNotifOpen(!notifOpen)}
                  aria-label="Notifications"
                >
                  <FiBell size={18} />
                  {unread > 0 && <span className="notif-badge">{unread > 9 ? '9+' : unread}</span>}
                </button>
                {notifOpen && (
                  <div className="notif-dropdown">
                    <div className="notif-header">
                      <span>Notifications</span>
                      {unread > 0 && <span className="badge badge-primary">{unread} new</span>}
                    </div>
                    <div className="notif-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {notifications.length > 0 ? notifications.map(n => (
                        <div key={n._id} className={`notif-item ${n.isRead ? 'read' : 'unread'}`} style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', background: n.isRead ? 'transparent' : 'var(--color-primary-light)' }}>
                          <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-primary)', lineHeight: 1.4 }}>{n.message}</p>
                          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>{new Date(n.createdAt).toLocaleDateString()}</span>
                        </div>
                      )) : (
                        <div className="notif-empty">
                          <FiBell size={24} />
                          <p>Check your dashboard for updates</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="user-dropdown-wrapper" ref={dropdownRef}>
                <button
                  className="user-dropdown-trigger"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="avatar avatar-sm">{initials}</div>
                  <span className="user-name">{user.name.split(' ')[0]}</span>
                  <FiChevronDown size={14} className={`chevron ${dropdownOpen ? 'open' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="user-dropdown-menu">
                    <div className="dropdown-user-info">
                      <div className="avatar avatar-md">{initials}</div>
                      <div>
                        <p className="dropdown-user-name">{user.name}</p>
                        <p className="dropdown-user-email">{user.email}</p>
                        <span className="badge badge-primary" style={{ marginTop: 4, fontSize: '10px' }}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to={dashboardPath} className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <FiUser size={15} /> Dashboard
                    </Link>
                    {isSeeker && (
                      <Link to="/seeker/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <FiSettings size={15} /> Edit Profile
                      </Link>
                    )}
                    {isEmployer && (
                      <Link to="/employer/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <FiSettings size={15} /> Company Profile
                      </Link>
                    )}
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item dropdown-item-danger" onClick={handleLogout}>
                      <FiLogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <NavLink to="/jobs" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>Browse Jobs</NavLink>
          {user && <NavLink to={dashboardPath} className="mobile-menu-link" onClick={() => setMenuOpen(false)}>Dashboard</NavLink>}
          {!user && (
            <>
              <Link to="/login" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-full" onClick={() => setMenuOpen(false)} style={{ marginTop: 8 }}>Get Started</Link>
            </>
          )}
          {user && (
            <button className="mobile-menu-link" style={{ color: 'var(--color-danger)', textAlign: 'left' }} onClick={handleLogout}>
              Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
