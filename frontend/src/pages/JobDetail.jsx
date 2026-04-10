import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiMapPin, FiClock, FiDollarSign, FiBriefcase, FiUsers, FiBookmark, FiArrowLeft, FiCheckCircle, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow, formatSalary } from '../utils/helpers';
import './JobDetail.css';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isSeeker } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data.data);
      } catch (err) {
        toast.error('Job not found');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  useEffect(() => {
    if (user && isSeeker && job) {
      // Check saved status
      api.get('/saved').then(({ data }) => {
        setIsSaved(data.data.some(s => s.jobId?._id === id));
      }).catch(() => {});
      
      // Check applied status
      api.get('/applications/seeker').then(({ data }) => {
        setHasApplied(data.data.some(app => app.jobId?._id === id));
      }).catch(() => {});
    }
  }, [user, id, job]);

  const handleSave = async () => {
    if (!user) return toast.error('Please login to save jobs');
    if (!isSeeker) return toast.error('Only job seekers can save jobs');
    
    setSaving(true);
    try {
      if (isSaved) {
        await api.delete(`/saved/${id}`);
        setIsSaved(false);
        toast.success('Job removed from saved list');
      } else {
        await api.post(`/saved/${id}`);
        setIsSaved(true);
        toast.success('Job saved successfully');
      }
    } catch (err) {
      toast.error('Error saving job');
    } finally {
      setSaving(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      await api.post('/applications', { jobId: id, coverLetter });
      toast.success('Application submitted successfully! 🎉');
      setHasApplied(true);
      setShowApplyModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="page-loader">
      <div className="spinner" style={{ width: 40, height: 40 }}></div>
      <p>Loading job details...</p>
    </div>
  );

  if (!job) return (
    <div className="page-content empty-state">
      <div className="empty-state-icon">🚫</div>
      <h3>Job not found</h3>
      <Link to="/jobs" className="btn btn-primary mt-4">Back to Jobs</Link>
    </div>
  );

  const { title, employer, location, jobType, salaryRange, description, qualifications, responsibilities, createdAt, deadline } = job;
  const isClosed = job.status === 'Closed' || new Date(deadline) < new Date();

  return (
    <div className="page-content job-detail-page bg-light">
      <div className="container">
        
        <Link to="/jobs" className="back-link">
          <FiArrowLeft /> Back to search
        </Link>

        {isClosed && (
          <div className="alert alert-warning" style={{ marginBottom: 20 }}>
            This job listing is closed and no longer accepting applications.
          </div>
        )}

        <div className="job-detail-layout">
          
          {/* MAIN CONTENT */}
          <div className="job-detail-main">
            <div className="card job-header-card">
              <div className="card-body">
                <div className="job-header-top">
                  {employer?.logoUrl ? (
                    <img src={employer.logoUrl} alt={employer.companyName} className="header-logo" />
                  ) : (
                     <div className="company-logo-placeholder header-logo">{employer?.companyName?.slice(0, 2).toUpperCase()}</div>
                  )}
                  <div className="job-header-info">
                    <h1 className="job-title">{title}</h1>
                    <div className="job-meta">
                      <span className="meta-item"><FiBriefcase/> {employer?.companyName}</span>
                      <span className="meta-item"><FiMapPin/> {location}</span>
                      <span className="meta-item"><FiClock/> {formatDistanceToNow(createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="job-badges">
                  <span className={`badge badge-primary`}>{jobType}</span>
                  {(salaryRange?.min || salaryRange?.max) && (
                    <span className="badge badge-success"><FiDollarSign size={12}/> {formatSalary(salaryRange.min, salaryRange.max)}</span>
                  )}
                  {employer?.industry && <span className="badge badge-neutral">{employer.industry}</span>}
                </div>
              </div>
            </div>

            <div className="card job-body-card">
              <div className="card-body">
                <h3 className="section-heading">Job Description</h3>
                <div className="job-description-content">
                  {/* Using pre-wrap or dangerouslySetInnerHTML if using a rich text editor. 
                      Since it's text right now, we use rendering with line breaks */}
                  {description.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                {responsibilities && responsibilities.length > 0 && (
                  <>
                    <h3 className="section-heading mt-6">Key Responsibilities</h3>
                    <ul className="job-list">
                      {responsibilities.map((req, i) => (
                        <li key={i}><FiCheckCircle className="list-icon" /> <span>{req}</span></li>
                      ))}
                    </ul>
                  </>
                )}

                {qualifications && qualifications.length > 0 && (
                  <>
                    <h3 className="section-heading mt-6">Qualifications & Requirements</h3>
                    <ul className="job-list">
                      {qualifications.map((req, i) => (
                        <li key={i}><FiCheckCircle className="list-icon" /> <span>{req}</span></li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="job-detail-sidebar">
            <div className="card action-card">
              <div className="card-body">
                {hasApplied ? (
                  <button className="btn btn-success btn-full btn-lg mb-3" disabled>
                    <FiCheckCircle size={18}/> Applied Successfully
                  </button>
                ) : (
                  <button 
                    className="btn btn-primary btn-full btn-lg mb-3 shadow-brand"
                    onClick={() => {
                       if (!user) return navigate('/login');
                       if (!isSeeker) return toast.error('Only job seekers can apply');
                       setShowApplyModal(true);
                    }}
                    disabled={isClosed}
                  >
                    {isClosed ? 'Positions Closed' : 'Apply Now'}
                  </button>
                )}
                
                <button 
                  className={`btn btn-outline btn-full ${isSaved ? 'active' : ''}`}
                  onClick={handleSave}
                  disabled={saving || isClosed}
                >
                  <FiBookmark fill={isSaved ? 'currentColor' : 'none'} /> 
                  {isSaved ? 'Saved to Profile' : 'Save for Later'}
                </button>
                
                <div className="job-summary-list mt-5">
                  <div className="summary-item">
                    <span className="summary-label">Job Type</span>
                    <span className="summary-val">{jobType}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Location</span>
                    <span className="summary-val">{location}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Industry</span>
                    <span className="summary-val">{employer?.industry || 'Not specified'}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Deadline</span>
                    <span className="summary-val">{new Date(deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card company-card">
              <div className="card-body">
                <h4 className="mb-3">About the Company</h4>
                <div className="company-small-header">
                  {employer?.logoUrl ? (
                    <img src={employer.logoUrl} alt={employer.companyName} className="comp-small-logo" />
                  ) : <div className="comp-small-logo bg-primary text-white flex-center font-bold">{employer?.companyName?.slice(0, 2).toUpperCase()}</div>}
                  <div>
                    <h5 className="font-bold">{employer?.companyName}</h5>
                    <a href={employer?.website} target="_blank" rel="noreferrer" className="text-primary text-sm">Visit Website</a>
                  </div>
                </div>
                {employer?.description && (
                  <p className="text-sm text-muted mt-3 line-clamp-4">{employer.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="modal-overlay" onClick={(e) => {
          if(e.target.classList.contains('modal-overlay')) setShowApplyModal(false);
        }}>
          <div className="modal-box">
            <div className="modal-header">
              <h3>Apply for {title}</h3>
              <button className="btn-ghost" onClick={() => setShowApplyModal(false)}><FiX size={20}/></button>
            </div>
            <form onSubmit={handleApply}>
              <div className="modal-body">
                <div className="alert alert-info mb-4">
                  Your profile details and uploaded resume will be sent automatically with this application.
                </div>
                <div className="form-group">
                  <label className="form-label">Cover Letter (Optional)</label>
                  <textarea 
                    className="form-textarea" 
                    placeholder="Why are you a good fit for this role?"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={5}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowApplyModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={applying}>
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
