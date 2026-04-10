import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import JobCard from '../../components/JobCard';

export default function SeekerSaved() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = () => {
    api.get('/saved')
      .then(res => setSavedJobs(res.data.data.map(item => item.jobId).filter(Boolean)))
      .catch(() => toast.error('Failed to load saved jobs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleUnsave = async (jobId) => {
    try {
      await api.delete(`/saved/${jobId}`);
      toast.success('Job removed from saved list');
      fetchSaved(); // Refresh list
    } catch (err) {
      toast.error('Failed to remove job');
    }
  };

  if (loading) return <div className="spinner" style={{ margin: 'auto' }}></div>;

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Saved Jobs</h1>
        <p className="dashboard-subtitle">Jobs you have bookmarked for later.</p>
      </div>

      {savedJobs.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-5)' }}>
          {savedJobs.map(job => (
            <JobCard key={job._id} job={job} showSave={true} isSaved={true} onSave={handleUnsave} />
          ))}
        </div>
      ) : (
        <div className="dashboard-card">
          <div className="empty-state p-8">
            <p>You have no saved jobs.</p>
          </div>
        </div>
      )}
    </div>
  );
}
