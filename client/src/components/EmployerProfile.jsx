import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, MapPin, Globe, Camera, Edit2, Check, Users, 
  Briefcase, Mail, Phone, ChevronRight, Plus
} from 'lucide-react';

const EmployerProfile = () => {
  const [profile, setProfile] = useState({});
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/auth');
    try {
      const res = await fetch('http://localhost:5000/api/profiles/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setUser(data.user);
        setEditData({
          companyName: data.profile.companyName,
          tagline: data.profile.tagline,
          industry: data.profile.industry,
          companySize: data.profile.companySize,
          aboutUs: data.profile.aboutUs,
          website: data.profile.website,
          contactEmail: data.profile.contactEmail,
          contactPhone: data.profile.contactPhone,
          headquarters: data.profile.headquarters
        });
      } else navigate('/auth');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/profiles/employer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error updating company:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  const handlePostJob = () => {
    alert("Job Posting functionality would connect to the 'Jobs' database collection!");
  };

  if (isLoading && !profile.companyName) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans text-slate-900 pb-16 relative">
      <nav className="bg-slate-900 text-white px-6 py-3 sticky top-0 z-40 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Building2 className="w-6 h-6 text-blue-400" fill="currentColor"/>
          <span>JobPortal <span className="text-blue-400 font-normal">Business</span></span>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors bg-slate-800 px-4 py-2 rounded-lg">
          <LogOutIcon className="w-4 h-4"/> Sign Out
        </button>
      </nav>

      <div className="h-48 bg-slate-800 absolute top-0 w-full z-0 opacity-100 rounded-b-[40px] pointer-events-none"></div>

      <main className="max-w-5xl mx-auto mt-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        
        {/* Main Column */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 pt-16 relative border border-slate-200">
            
            <div className="w-32 h-32 rounded-2xl border-4 border-white bg-slate-100 absolute -top-16 left-8 shadow-md flex items-center justify-center overflow-hidden group">
              <Building2 className="w-16 h-16 text-slate-400" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-bold flex-col gap-1">
                <Camera className="w-6 h-6"/> Upload Logo
              </div>
            </div>

            <div className="flex justify-end absolute top-6 right-6">
              {isEditing ? (
                <button onClick={handleSave} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-lg font-bold hover:bg-slate-800 transition-all shadow-md">
                  <Check className="w-4 h-4" /> Save Details
                </button>
              ) : (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-slate-200 transition-all">
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <input 
                type="text" value={editData.companyName || ''} onChange={e => setEditData({...editData, companyName: e.target.value})}
                placeholder="Company Name"
                className="w-full mt-2 text-3xl font-black border-b-2 border-slate-300 focus:border-slate-800 outline-none pb-1 text-slate-900 transition-colors"
              />
            ) : (
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">{profile.companyName}</h1>
            )}
            
            {isEditing ? (
              <input 
                type="text" value={editData.tagline || ''} onChange={e => setEditData({...editData, tagline: e.target.value})}
                placeholder="Company Tagline / Catchphrase"
                className="w-full mt-3 text-lg border-b-2 border-slate-300 focus:border-slate-800 outline-none pb-1 font-medium text-slate-600 transition-colors"
              />
            ) : (
              <p className="text-xl text-slate-600 mt-2 font-medium">{profile.tagline || 'Add a company tagline'}</p>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-sm mt-6 text-slate-600 font-semibold">
              <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <Briefcase className="w-4 h-4 text-slate-500" />
                {isEditing ? (
                  <input type="text" value={editData.industry || ''} onChange={e => setEditData({...editData, industry: e.target.value})} placeholder="Industry" className="outline-none bg-transparent w-32 text-slate-800"/>
                ) : (
                  <span>{profile.industry || 'Industry unspecified'}</span>
                )}
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <MapPin className="w-4 h-4 text-slate-500" />
                {isEditing ? (
                  <input type="text" value={editData.headquarters || ''} onChange={e => setEditData({...editData, headquarters: e.target.value})} placeholder="Headquarters" className="outline-none bg-transparent w-32 text-slate-800"/>
                ) : (
                  <span>{profile.headquarters || 'No location'}</span>
                )}
              </div>
            </div>

            {/* About Section */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                About us
              </h2>
              {isEditing ? (
                <textarea 
                  rows="6" value={editData.aboutUs || ''} onChange={e => setEditData({...editData, aboutUs: e.target.value})}
                  placeholder="Share an overview of your company, its mission, history, and culture..."
                  className="w-full border-2 border-slate-200 bg-slate-50 rounded-xl p-4 outline-none focus:border-slate-800 resize-y text-slate-700 font-medium"
                />
              ) : (
                <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                  {profile.aboutUs || 'Write a summary about your company to attract the best talent.'}
                </p>
              )}
            </div>
          </div>

          {/* Jobs Section */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-900">Recent Job Postings</h2>
              <button onClick={handlePostJob} className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm">
                <Plus className="w-4 h-4" /> Post a Job
              </button>
            </div>
            
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-slate-50">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8 text-blue-600"/>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">No active jobs</h3>
              <p className="text-slate-500 font-medium mb-6 max-w-sm">You haven't posted any jobs yet. Start hiring top talent by creating your first job post.</p>
              <button onClick={handlePostJob} className="font-bold text-blue-600 hover:text-blue-800 hover:underline">
                Create a posting &rarr;
              </button>
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 border border-slate-200">
            <h2 className="font-bold text-lg text-slate-900 mb-5">Company Details</h2>
            <div className="space-y-5">
              
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5"/> Website</h3>
                {isEditing ? (
                  <input type="text" value={editData.website || ''} onChange={e => setEditData({...editData, website: e.target.value})} className="text-sm font-semibold w-full bg-slate-50 px-3 py-2 rounded border border-slate-200 outline-none focus:border-slate-800"/>
                ) : (
                  <a href={profile.website} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-600 hover:underline">{profile.website || 'Add website'}</a>
                )}
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Users className="w-3.5 h-3.5"/> Company Size</h3>
                {isEditing ? (
                  <select value={editData.companySize || ''} onChange={e => setEditData({...editData, companySize: e.target.value})} className="text-sm font-semibold w-full bg-slate-50 px-3 py-2 rounded border border-slate-200 outline-none focus:border-slate-800">
                    <option value="">Select size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                ) : (
                  <p className="text-sm font-bold text-slate-800">{profile.companySize || 'Not specified'}</p>
                )}
              </div>

            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 border border-slate-200">
            <h2 className="font-bold text-lg text-slate-900 mb-5">Contact Info</h2>
            <div className="space-y-5">
              
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5"/> Public Email</h3>
                {isEditing ? (
                  <input type="email" value={editData.contactEmail || ''} onChange={e => setEditData({...editData, contactEmail: e.target.value})} className="text-sm font-semibold w-full bg-slate-50 px-3 py-2 rounded border border-slate-200 outline-none focus:border-slate-800"/>
                ) : (
                  <p className="text-sm font-bold text-slate-800 truncate">{profile.contactEmail || user?.email}</p>
                )}
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5"/> Phone Number</h3>
                {isEditing ? (
                  <input type="text" value={editData.contactPhone || ''} onChange={e => setEditData({...editData, contactPhone: e.target.value})} className="text-sm font-semibold w-full bg-slate-50 px-3 py-2 rounded border border-slate-200 outline-none focus:border-slate-800"/>
                ) : (
                  <p className="text-sm font-bold text-slate-800">{profile.contactPhone || 'Not provided'}</p>
                )}
              </div>

            </div>
          </div>

        </div>
      </main>

    </div>
  );
};

const LogOutIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

export default EmployerProfile;
