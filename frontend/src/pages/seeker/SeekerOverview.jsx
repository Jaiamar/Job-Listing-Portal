import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiBookmark, FiMessageSquare } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function SeekerOverview() {
  const [stats, setStats] = useState({ applications: 0, savedJobs: 0, activeInterviews: 0 });
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [appsRes, savedRes] = await Promise.all([
          api.get('/applications/seeker'),
          api.get('/saved')
        ]);
        
        const apps = appsRes.data.data;
        setStats({
          applications: apps.length,
          savedJobs: savedRes.data.data.length,
          activeInterviews: apps.filter(a => a.status === 'Interview' || a.status === 'Shortlisted').length
        });
        
        // Setup recent applications (last 3)
        setRecentApps(apps.slice(0, 3));
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="spinner" style={{ margin: 'auto' }}></div>;

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard Overview</h1>
        <p className="dashboard-subtitle">Track your career progress.</p>
      </div>

      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper"><FiBriefcase className="stat-icon" /></div>
          <div className="stat-info">
            <h3>{stats.applications}</h3>
            <p>Total Applications</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            <FiBookmark className="stat-icon" />
          </div>
          <div className="stat-info">
            <h3>{stats.savedJobs}</h3>
            <p>Saved Jobs</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
            <FiMessageSquare className="stat-icon" />
          </div>
          <div className="stat-info">
            <h3>{stats.activeInterviews}</h3>
            <p>Active Interviews</p>
          </div>
        </div>
      </div>

      <div className="dashboard-card mt-8">
        <div className="dashboard-card-header">
          <h3>Recent Applications</h3>
          <Link to="/seeker/applications" className="btn btn-ghost btn-sm">View All</Link>
        </div>
        <div className="dashboard-card-body p-0">
          {recentApps.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Job Role</th>
                    <th>Company</th>
                    <th>Applied On</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApps.map(app => (
                    <tr key={app._id}>
                      <td className="font-bold">{app.jobId?.title || 'Unknown Job'}</td>
                      <td>{app.jobId?.employer?.companyName || 'Unknown Company'}</td>
                      <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                      <td><span className={`badge status-${app.status.toLowerCase().replace(' ', '-')}`}>{app.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
             <div className="empty-state p-6">
                <FiBriefcase size={32} color="var(--color-text-muted)" />
                <p className="mt-2">You haven't applied to any jobs yet.</p>
                <Link to="/jobs" className="btn btn-primary mt-3">Browse Jobs</Link>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
