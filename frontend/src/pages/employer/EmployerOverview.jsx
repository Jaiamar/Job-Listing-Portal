import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiBriefcase, FiUsers, FiEye } from 'react-icons/fi';

export default function EmployerOverview() {
  const [stats, setStats] = useState({ activeJobs: 0, totalApplicants: 0, totalViews: 0 });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [{ data: jobsResp }, { data: appsResp }] = await Promise.all([
          api.get('/jobs/employer/mine'),
          api.get('/applications/employer/all')
        ]);
        const jobs = jobsResp.data;
        const apps = appsResp.data;
        
        setStats({
          activeJobs: jobs.filter(j => j.status === 'Active').length,
          totalApplicants: apps.length,
          totalViews: jobs.reduce((acc, job) => acc + (job.viewsCount || 0), 0)
        });

        // Slice top 3 most recent and count applicants dynamically
        const recent = jobs.slice(0, 3).map(job => ({
          ...job,
          applicantsCount: apps.filter(a => a.jobId?._id === job._id).length
        }));
        setRecentJobs(recent);
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
        <h1 className="dashboard-title">Employer Overview</h1>
        <p className="dashboard-subtitle">Monitor your job postings and applicants.</p>
      </div>

      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper"><FiBriefcase className="stat-icon" /></div>
          <div className="stat-info">
            <h3>{stats.activeJobs}</h3>
            <p>Active Jobs</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            <FiUsers className="stat-icon" />
          </div>
          <div className="stat-info">
            <h3>{stats.totalApplicants}</h3>
            <p>Total Applicants</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'var(--color-info-light)', color: 'var(--color-info)' }}>
            <FiEye className="stat-icon" />
          </div>
          <div className="stat-info">
            <h3>{stats.totalViews}</h3>
            <p>Job Views</p>
          </div>
        </div>
      </div>

      <div className="dashboard-card mt-8">
        <div className="dashboard-card-header">
          <h3>Recent Postings</h3>
          <Link to="/employer/jobs" className="btn btn-ghost btn-sm">Manage All</Link>
        </div>
        <div className="dashboard-card-body p-0">
          {recentJobs.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Status</th>
                    <th>Applicants</th>
                    <th>Posted</th>
                  </tr>
                </thead>
                <tbody>
                  {recentJobs.map(job => (
                    <tr key={job._id}>
                      <td className="font-bold">{job.title}</td>
                      <td><span className={`badge ${job.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>{job.status}</span></td>
                      <td>{job.applicantsCount || 0}</td>
                      <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
             <div className="empty-state p-6">
                <FiBriefcase size={32} color="var(--color-text-muted)" />
                <p className="mt-2">You haven't posted any jobs yet.</p>
                <Link to="/employer/jobs" className="btn btn-primary mt-3">Post a Job</Link>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
