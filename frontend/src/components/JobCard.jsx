import { Link } from 'react-router-dom';
import { FiMapPin, FiClock, FiDollarSign, FiBookmark, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { formatDistanceToNow } from '../utils/helpers';
import './JobCard.css';

const jobTypeColors = {
  'Full-Time':  'badge-success',
  'Part-Time':  'badge-warning',
  'Contract':   'badge-secondary',
  'Internship': 'badge-info',
  'Remote':     'badge-primary'
};

export default function JobCard({ job, onSave, isSaved = false, showSave = false }) {
  const { _id, title, jobType, location, salaryRange, createdAt, employer, viewsCount } = job;
  const salary = salaryRange?.min && salaryRange?.max
    ? `₹${(salaryRange.min / 1000).toFixed(0)}k – ₹${(salaryRange.max / 1000).toFixed(0)}k`
    : salaryRange?.min
    ? `₹${(salaryRange.min / 1000).toFixed(0)}k+`
    : null;

  const companyInitials = (employer?.companyName || 'CO').slice(0, 2).toUpperCase();
  const isNew = createdAt && (Date.now() - new Date(createdAt)) < 3 * 24 * 60 * 60 * 1000;

  return (
    <div className="job-card animate-float">
      {isNew && <div className="job-card-new-ribbon">New</div>}

      <div className="job-card-header">
        {employer?.logoUrl ? (
          <img src={employer.logoUrl} alt={employer.companyName} className="company-logo" />
        ) : (
          <div className="company-logo-placeholder">{companyInitials}</div>
        )}

        <div className="job-card-meta">
          <h3 className="job-card-title">
            <Link to={`/jobs/${_id}`}>{title}</Link>
          </h3>
          <p className="job-card-company">{employer?.companyName || 'Company'}</p>
        </div>

        {showSave && (
          <button
            className={`save-btn ${isSaved ? 'saved' : ''}`}
            onClick={() => onSave?.(_id)}
            aria-label={isSaved ? 'Unsave job' : 'Save job'}
            title={isSaved ? 'Remove from saved' : 'Save job'}
          >
            <FiBookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      <div className="job-card-tags">
        <span className={`badge ${jobTypeColors[jobType] || 'badge-neutral'}`}>{jobType}</span>
        {employer?.industry && <span className="tag">{employer.industry}</span>}
        {isNew && <span className="badge badge-success" style={{ fontSize: '10px' }}>🔥 Hot</span>}
      </div>

      <div className="job-card-details">
        <div className="job-detail-item">
          <FiMapPin size={13} />
          <span>{location}</span>
        </div>
        {salary && (
          <div className="job-detail-item">
            <FiDollarSign size={13} />
            <span>{salary}</span>
          </div>
        )}
        {viewsCount > 0 && (
          <div className="job-detail-item">
            <FiUsers size={13} />
            <span>{viewsCount} views</span>
          </div>
        )}
      </div>

      <div className="job-card-footer">
        <span className="job-card-time">
          <FiClock size={12} />
          {createdAt ? formatDistanceToNow(createdAt) : 'Recently'}
        </span>
        <Link to={`/jobs/${_id}`} className="btn btn-outline btn-sm">
          View Job
        </Link>
      </div>
    </div>
  );
}
