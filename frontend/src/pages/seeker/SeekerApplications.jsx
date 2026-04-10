import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function SeekerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/seeker')
      .then(res => setApplications(res.data.data))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" style={{ margin: 'auto' }}></div>;

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Applications</h1>
        <p className="dashboard-subtitle">Track your applied jobs and hiring status.</p>
      </div>

      <div className="dashboard-card">
        {applications.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Job Detail</th>
                  <th>Company</th>
                  <th>Applied On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app._id}>
                    <td>
                      <div>
                        <strong className="font-bold block">{app.jobId?.title || 'Job Unavailable'}</strong>
                        <span className="text-xs text-muted">{app.jobId?.location}</span>
                      </div>
                    </td>
                    <td>{app.jobId?.employer?.companyName || 'Unknown'}</td>
                    <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge status-${app.status.toLowerCase().replace(' ', '-')}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state p-8">
            <p>You haven't applied for any jobs yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
