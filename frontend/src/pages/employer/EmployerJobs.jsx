import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';

const INIT_JOB = {
  title: '', description: '', location: '', jobType: 'Full-Time',
  salaryRange: { min: '', max: '' },
  qualifications: '', responsibilities: '', deadline: ''
};

export default function EmployerJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [form, setForm] = useState(INIT_JOB);
  const [saving, setSaving] = useState(false);

  const fetchJobs = () => {
    setLoading(true);
    api.get('/jobs/employer/my-jobs')
      .then(res => setJobs(res.data.data))
      .catch(() => toast.error('Failed to load jobs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(); }, []);

  const openForm = (job = null) => {
    if (job) {
      setForm({
        ...job,
        qualifications: job.qualifications.join('\n'),
        responsibilities: job.responsibilities.join('\n'),
        deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : ''
      });
      setEditingJob(job);
    } else {
      setForm(INIT_JOB);
      setEditingJob(null);
    }
    setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleNestedChange = (e, field, subfield) => {
    setForm({ ...form, [field]: { ...form[field], [subfield]: e.target.value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        qualifications: form.qualifications.split('\n').filter(Boolean),
        responsibilities: form.responsibilities.split('\n').filter(Boolean),
      };

      if (editingJob) {
        await api.put(`/jobs/${editingJob._id}`, payload);
        toast.success('Job updated');
      } else {
        await api.post('/jobs', payload);
        toast.success('Job created successfully');
      }
      setShowModal(false);
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job posting permanently?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      toast.success('Job deleted');
      fetchJobs();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="spinner" style={{ margin: 'auto' }}></div>;

  return (
    <div className="dashboard-content">
      <div className="dashboard-header flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="dashboard-title">Manage Jobs</h1>
          <p className="dashboard-subtitle">Create and edit your job listings.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openForm(null)}>
          <FiPlus className="mr-2" /> Post New Job
        </button>
      </div>

      <div className="dashboard-card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Type / Location</th>
                <th>Views</th>
                <th>Applicants</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job._id}>
                  <td className="font-bold">{job.title}</td>
                  <td>
                    <span className="block text-sm">{job.jobType}</span>
                    <span className="text-xs text-muted">{job.location}</span>
                  </td>
                  <td>{job.viewsCount}</td>
                  <td>{job.applicantsCount}</td>
                  <td><span className={`badge ${job.status === 'Open' ? 'badge-success' : 'badge-neutral'}`}>{job.status}</span></td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-outline btn-sm" onClick={() => openForm(job)}><FiEdit/></button>
                      <button className="btn btn-ghost btn-sm" style={{color: 'var(--color-danger)'}} onClick={() => handleDelete(job._id)}><FiTrash2/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr><td colSpan="6" className="text-center p-6 text-muted">No jobs posted yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => { if(e.target.className === 'modal-overlay') setShowModal(false) }}>
          <div className="modal-box" style={{ maxWidth: 700, maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3>{editingJob ? 'Edit Job Listing' : 'Create New Job'}</h3>
              <button className="btn-ghost" onClick={() => setShowModal(false)}><FiX size={20}/></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Job Title *</label>
                  <input type="text" className="form-input" name="title" value={form.title} onChange={handleChange} required />
                </div>
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Location *</label>
                    <input type="text" className="form-input" name="location" value={form.location} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Job Type *</label>
                    <select className="form-select" name="jobType" value={form.jobType} onChange={handleChange} required>
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </div>

                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Min Salary (Optional)</label>
                    <input type="number" className="form-input" value={form.salaryRange.min} onChange={e => handleNestedChange(e, 'salaryRange', 'min')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Max Salary (Optional)</label>
                    <input type="number" className="form-input" value={form.salaryRange.max} onChange={e => handleNestedChange(e, 'salaryRange', 'max')} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Job Description *</label>
                  <textarea className="form-textarea" rows="4" name="description" value={form.description} onChange={handleChange} required></textarea>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Key Responsibilities (One per line)</label>
                  <textarea className="form-textarea" rows="3" name="responsibilities" value={form.responsibilities} onChange={handleChange}></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Qualifications (One per line)</label>
                  <textarea className="form-textarea" rows="3" name="qualifications" value={form.qualifications} onChange={handleChange}></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Application Deadline</label>
                  <input type="date" className="form-input" name="deadline" value={form.deadline} onChange={handleChange} />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Job'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
