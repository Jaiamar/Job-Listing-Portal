import { Routes, Route, NavLink } from 'react-router-dom';
import { FiGrid, FiBriefcase, FiUsers, FiSettings } from 'react-icons/fi';
import EmployerOverview from './EmployerOverview';
import EmployerProfile from './EmployerProfile';
import EmployerJobs from './EmployerJobs';
import EmployerApplicants from './EmployerApplicants';
import { useAuth } from '../../context/AuthContext';
import '../seeker/SeekerDashboard.css'; // Inheriting shared structure styles

export default function EmployerDashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-user">
          <div className="avatar avatar-md">{user?.name?.slice(0, 2).toUpperCase()}</div>
          <div className="sidebar-user-info">
            <h4>{user?.name}</h4>
            <p>Employer</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/employer" end className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FiGrid /> Overview
          </NavLink>
          <NavLink to="/employer/profile" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FiSettings /> Company Profile
          </NavLink>
          <NavLink to="/employer/jobs" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FiBriefcase /> Manage Jobs
          </NavLink>
          <NavLink to="/employer/applicants" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FiUsers /> Applicants
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <Routes>
          <Route path="/" element={<EmployerOverview />} />
          <Route path="profile" element={<EmployerProfile />} />
          <Route path="jobs" element={<EmployerJobs />} />
          <Route path="applicants" element={<EmployerApplicants />} />
        </Routes>
      </main>
    </div>
  );
}
