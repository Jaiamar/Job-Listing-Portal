import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiDownload, FiCheck, FiX, FiClock } from 'react-icons/fi';

const STATUS_CHOICES = ['Submitted', 'Under Review', 'Shortlisted', 'Interview', 'Offer Extended', 'Rejected'];

export default function EmployerApplicants() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplicants = () => {
    setLoading(true);
    api.get('/applications/employer/all')
      .then(res => setApplications(res.data.data))
      .catch(() => toast.error('Failed to load applicants'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchApplicants(); }, []);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.put(`/applications/${appId}/status`, { status: newStatus });
      toast.success('Status updated');
      setApplications(applications.map(app => app._id === appId ? { ...app, status: newStatus } : app));
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="spinner" style={{ margin: 'auto' }}></div>;

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Review Applicants</h1>
        <p className="dashboard-subtitle">Manage candidate pipeline for your active jobs.</p>
      </div>

      <div className="dashboard-card">
        {applications.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Applied For</th>
                  <th>Status</th>
                  <th>Resume/Cover</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar avatar-sm">{app.seekerId?.name?.slice(0, 2).toUpperCase() || 'NA'}</div>
                        <div>
                          <strong className="block text-sm">{app.seekerId?.name || 'Unknown'}</strong>
                          <span className="text-xs text-muted">{app.seekerId?.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="font-bold">{app.jobId?.title || 'Unknown Job'}</span>
                      <span className="block text-xs mt-1">{new Date(app.appliedAt).toLocaleDateString()}</span>
                    </td>
                    <td>
                      <span className={`badge status-${app.status.toLowerCase().replace(' ', '-')}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {app.resumeUrl && (
                           <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" title="View Resume">
                             <FiDownload />
                           </a>
                        )}
                        {app.coverLetter && (
                          <div className="tooltip-wrapper" title={app.coverLetter}>
                            <button className="btn btn-ghost btn-sm"><FiClock /></button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <select 
                        className="form-select" 
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      >
                        {STATUS_CHOICES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state p-8 text-center">
            <p>No applications received yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
