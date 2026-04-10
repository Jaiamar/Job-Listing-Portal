import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiUpload, FiBriefcase, FiAward, FiBook } from 'react-icons/fi';

export default function SeekerProfile() {
  const [profile, setProfile] = useState({
    title: '', bio: '', skills: '', education: [], experience: []
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/profiles/seeker')
      .then(res => {
        const data = res.data.data || {};
        setProfile({
          title: data.title || '',
          bio: data.bio || '',
          skills: data.skills ? data.skills.join(', ') : '',
          education: data.education || [],
          experience: data.experience || []
        });
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...profile,
        skills: profile.skills.split(',').map(s => s.trim()).filter(Boolean)
      };
      await api.put('/profiles/seeker', payload);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return toast.error('Check file selection');
    const formData = new FormData();
    formData.append('resume', resumeFile);
    
    try {
      const res = await api.post('/profiles/seeker/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Resume uploaded successfully');
      setResumeFile(null);
    } catch (err) {
      toast.error('File upload failed');
    }
  };

  if (loading) return <div className="spinner" style={{ margin: 'auto' }}></div>;

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Profile</h1>
        <p className="dashboard-subtitle">Update your personal information and resume.</p>
      </div>

      <div className="dashboard-card mb-6">
        <div className="dashboard-card-header">
          <h3>Basic Information</h3>
        </div>
        <div className="dashboard-card-body">
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Professional Title</label>
              <input type="text" className="form-input" name="title" value={profile.title} onChange={handleChange} placeholder="e.g. Senior Frontend Engineer" />
            </div>
            <div className="form-group">
              <label className="form-label">Bio Summary</label>
              <textarea className="form-textarea" name="bio" value={profile.bio} onChange={handleChange} rows="4" placeholder="Briefly describe your career goals and expertise..."></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">Skills (comma-separated)</label>
              <input type="text" className="form-input" name="skills" value={profile.skills} onChange={handleChange} placeholder="React, Node.js, Typescript" />
            </div>
            
            <button type="submit" className="btn btn-primary mt-4" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h3>Resume Upload</h3>
        </div>
        <div className="dashboard-card-body">
          <form onSubmit={handleResumeUpload} className="flex gap-4 items-end">
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label className="form-label">Upload new resume (PDF or DOCX)</label>
              <input 
                type="file" 
                className="form-input" 
                accept=".pdf,.doc,.docx"
                onChange={e => setResumeFile(e.target.files[0])}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={!resumeFile}>
              <FiUpload className="mr-2" /> Upload
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
