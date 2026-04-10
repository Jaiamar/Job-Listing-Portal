import { Routes, Route, NavLink } from 'react-router-dom';
import { FiUser, FiBriefcase, FiBookmark, FiSettings } from 'react-icons/fi';
import SeekerOverview from './SeekerOverview';
import SeekerProfile from './SeekerProfile';
import SeekerApplications from './SeekerApplications';
import SeekerSaved from './SeekerSaved';
import { useAuth } from '../../context/AuthContext';
import './SeekerDashboard.css';

export default function SeekerDashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-user">
          <div className="avatar avatar-md">{user?.name?.slice(0, 2).toUpperCase()}</div>
          <div className="sidebar-user-info">
            <h4>{user?.name}</h4>
            <p>Job Seeker</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/seeker" end className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FiUser /> Overview
          </NavLink>
          <NavLink to="/seeker/profile" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FiSettings /> My Profile
          </NavLink>
          <NavLink to="/seeker/applications" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FiBriefcase /> Applications
          </NavLink>
          <NavLink to="/seeker/saved" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FiBookmark /> Saved Jobs
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <Routes>
          <Route path="/" element={<SeekerOverview />} />
          <Route path="profile" element={<SeekerProfile />} />
          <Route path="applications" element={<SeekerApplications />} />
          <Route path="saved" element={<SeekerSaved />} />
        </Routes>
      </main>
    </div>
  );
}
