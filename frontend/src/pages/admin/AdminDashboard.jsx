import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../seeker/SeekerDashboard.css'; 

export default function AdminDashboard() {
  const { user } = useAuth();
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-user">
          <div className="avatar avatar-md">{user?.name?.slice(0, 2).toUpperCase()}</div>
          <div className="sidebar-user-info">
            <h4>{user?.name}</h4>
            <p>Administrator</p>
          </div>
        </div>
      </aside>
      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1 className="dashboard-title">System Admin</h1>
            <p className="dashboard-subtitle">Manage platform-wide settings.</p>
          </div>
          <div className="dashboard-card p-8 text-center">
            <p className="text-muted">Admin functionalities are mapped for future releases.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
