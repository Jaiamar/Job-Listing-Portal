import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiUpload } from 'react-icons/fi';

export default function EmployerProfile() {
  const [profile, setProfile] = useState({
    companyName: '', industry: '', website: '', description: '', location: ''
  });
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/profiles/employer')
      .then(res => {
        const data = res.data.data || {};
        setProfile({
          companyName: data.companyName || '',
          industry: data.industry || '',
          website: data.website || '',
          description: data.description || '',
          location: data.location || ''
        });
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/profiles/employer', profile);
      toast.success('Company profile updated');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    e.preventDefault();
    if (!logoFile) return toast.error('Select an image file');
    const formData = new FormData();
    formData.append('logo', logoFile);
    
    try {
      await api.post('/profiles/employer/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Logo uploaded successfully');
      setLogoFile(null);
    } catch (err) {
      toast.error('Logo upload failed');
    }
  };

  if (loading) return <div className="spinner" style={{ margin: 'auto' }}></div>;

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Company Profile</h1>
        <p className="dashboard-subtitle">Manage how candidates view your company.</p>
      </div>

      <div className="dashboard-card mb-6">
        <div className="dashboard-card-header">
          <h3>Company Information</h3>
        </div>
        <div className="dashboard-card-body">
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input type="text" className="form-input" name="companyName" value={profile.companyName} onChange={handleChange} required />
            </div>
            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Industry</label>
                <input type="text" className="form-input" name="industry" value={profile.industry} onChange={handleChange} placeholder="e.g. Information Technology" />
              </div>
              <div className="form-group">
                <label className="form-label">Headquarters Location</label>
                <input type="text" className="form-input" name="location" value={profile.location} onChange={handleChange} placeholder="City, State" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Company Website</label>
              <input type="url" className="form-input" name="website" value={profile.website} onChange={handleChange} placeholder="https://example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Company Description</label>
              <textarea className="form-textarea" name="description" value={profile.description} onChange={handleChange} rows="5" placeholder="Briefly describe your company culture and mission..."></textarea>
            </div>
            <button type="submit" className="btn btn-primary mt-4" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h3>Company Logo</h3>
        </div>
        <div className="dashboard-card-body">
          <form onSubmit={handleLogoUpload} className="flex gap-4 items-end">
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label className="form-label">Upload public logo (PNG, JPG)</label>
              <input 
                type="file" 
                className="form-input" 
                accept="image/jpeg,image/png"
                onChange={e => setLogoFile(e.target.files[0])}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={!logoFile}>
              <FiUpload className="mr-2" /> Upload Logo
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
