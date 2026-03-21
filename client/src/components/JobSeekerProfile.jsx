import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, GraduationCap, MapPin, Mail, Phone, FileText, 
  Camera, Edit2, Check, User, Code, Plus, X, Trash2, Calendar
} from 'lucide-react';

const JobSeekerProfile = () => {
  const [profile, setProfile] = useState({ experience: [], education: [], skills: [] });
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  // Modals state
  const [showExpModal, setShowExpModal] = useState(false);
  const [expForm, setExpForm] = useState({ title: '', company: '', location: '', startDate: '', endDate: '', description: '', current: false });
  
  const [showEduModal, setShowEduModal] = useState(false);
  const [eduForm, setEduForm] = useState({ school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' });

  const [skillInput, setSkillInput] = useState('');

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
        setProfile({
          ...data.profile,
          experience: data.profile.experience || [],
          education: data.profile.education || [],
          skills: data.profile.skills || []
        });
        setUser(data.user);
        setEditData({
          headline: data.profile.headline,
          location: data.profile.location,
          about: data.profile.about,
          contactEmail: data.profile.contactEmail,
          contactPhone: data.profile.contactPhone
        });
      } else navigate('/auth');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const syncProfile = async (updatedProfileData) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/profiles/job-seeker', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedProfileData)
      });
      if (res.ok) {
        const data = await res.json();
        setProfile({
          ...data.profile,
          experience: data.profile.experience || [],
          education: data.profile.education || [],
          skills: data.profile.skills || []
        });
      }
    } catch (err) {
      console.error('Error updating:', err);
    }
  };

  const handleSaveBasic = () => {
    syncProfile({ ...profile, ...editData });
    setIsEditingBasic(false);
  };

  // --- Experience Logic ---
  const handleAddExp = (e) => {
    e.preventDefault();
    const updatedExp = [...profile.experience, expForm];
    syncProfile({ ...profile, experience: updatedExp });
    setShowExpModal(false);
    setExpForm({ title: '', company: '', location: '', startDate: '', endDate: '', description: '', current: false });
  };

  const handleDeleteExp = (idx) => {
    const updatedExp = profile.experience.filter((_, i) => i !== idx);
    syncProfile({ ...profile, experience: updatedExp });
  };

  // --- Education Logic ---
  const handleAddEdu = (e) => {
    e.preventDefault();
    const updatedEdu = [...profile.education, eduForm];
    syncProfile({ ...profile, education: updatedEdu });
    setShowEduModal(false);
    setEduForm({ school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' });
  };

  const handleDeleteEdu = (idx) => {
    const updatedEdu = profile.education.filter((_, i) => i !== idx);
    syncProfile({ ...profile, education: updatedEdu });
  };

  // --- Skills Logic ---
  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim() !== '') {
      e.preventDefault();
      if (!profile.skills.includes(skillInput.trim())) {
        const updatedSkills = [...profile.skills, skillInput.trim()];
        syncProfile({ ...profile, skills: updatedSkills });
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = profile.skills.filter(s => s !== skillToRemove);
    syncProfile({ ...profile, skills: updatedSkills });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  if (isLoading && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans text-slate-900 pb-16 relative">
      <nav className="bg-white/80 backdrop-blur-md px-6 py-3 border-b border-slate-200 sticky top-0 z-40 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl drop-shadow-sm">
          <Briefcase className="w-6 h-6" fill="currentColor"/>
          <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">JobPortal</span>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-600 transition-colors">
          <LogOutIcon className="w-4 h-4"/> Logout
        </button>
      </nav>

      <div className="h-64 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 absolute top-0 w-full z-0 opacity-90 rounded-b-[40px] shadow-lg pointer-events-none"></div>

      <main className="max-w-5xl mx-auto mt-20 px-4 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        
        {/* Main Column */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 p-8 pt-16 relative border border-slate-100/50 backdrop-blur-sm">
            
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-tr from-blue-50 to-slate-100 absolute -top-16 left-8 shadow-md flex items-center justify-center overflow-hidden group">
              <User className="w-16 h-16 text-blue-300" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-6 h-6 text-white"/>
              </div>
            </div>

            <div className="flex justify-end absolute top-6 right-6">
              {isEditingBasic ? (
                <button onClick={handleSaveBasic} className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2 rounded-full font-bold hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                  <Check className="w-4 h-4" /> Save
                </button>
              ) : (
                <button onClick={() => setIsEditingBasic(true)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{user?.name}</h1>
            
            {isEditingBasic ? (
              <input 
                type="text" value={editData.headline || ''} onChange={e => setEditData({...editData, headline: e.target.value})}
                placeholder="E.g., Senior Full Stack Engineer"
                className="w-full mt-3 text-xl border-b-2 border-blue-200 focus:border-blue-600 outline-none pb-1 font-semibold text-slate-700 transition-colors"
              />
            ) : (
              <p className="text-xl text-slate-600 mt-2 font-medium">{profile.headline || 'Add a professional headline'}</p>
            )}
            
            <div className="flex items-center gap-4 text-sm mt-4 text-slate-500 font-medium">
              <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                <MapPin className="w-4 h-4 text-red-400" />
                {isEditingBasic ? (
                  <input 
                    type="text" value={editData.location || ''} onChange={e => setEditData({...editData, location: e.target.value})}
                    placeholder="City, Country" className="outline-none bg-transparent w-full text-slate-700"
                  />
                ) : (
                  <span>{profile.location || 'Location missing'}</span>
                )}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500"/> About
              </h2>
              {isEditingBasic ? (
                <textarea 
                  rows="4" value={editData.about || ''} onChange={e => setEditData({...editData, about: e.target.value})}
                  placeholder="Share your years of experience, industry, and main achievements..."
                  className="w-full border-2 border-blue-100 rounded-xl p-4 outline-none focus:border-blue-500 resize-y text-slate-700 font-medium"
                />
              ) : (
                <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                  {profile.about || 'Write a summary to highlight your personality or work experience.'}
                </p>
              )}
            </div>
          </div>

          {/* Experience Section */}
          <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 p-8 border border-slate-100/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-500"/> Experience
              </h2>
              <button onClick={() => setShowExpModal(true)} className="flex items-center gap-1 text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full font-bold text-sm transition-colors">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            
            <div className="space-y-6">
              {profile.experience.length > 0 ? profile.experience.map((exp, idx) => (
                <div key={idx} className="relative pl-8 pb-6 border-l-2 border-indigo-100 last:border-0 last:pb-0 group">
                  <div className="absolute w-4 h-4 bg-indigo-500 rounded-full -left-[9px] top-1 shadow-[0_0_0_4px_white]"></div>
                  <button onClick={() => handleDeleteExp(idx)} className="absolute right-0 top-0 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 p-1.5 rounded-full">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <h3 className="text-lg font-bold text-slate-800">{exp.title}</h3>
                  <p className="text-md font-semibold text-indigo-600">{exp.company}</p>
                  <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5"/>
                    {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                    {exp.location && <><span className="mx-1">•</span>{exp.location}</>}
                  </p>
                  <p className="text-slate-600 mt-3 text-sm leading-relaxed">{exp.description}</p>
                </div>
              )) : (
                <div className="text-center py-8 text-slate-400 font-medium">No experience listed. Add your past roles here!</div>
              )}
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 p-8 border border-slate-100/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-purple-500"/> Education
              </h2>
              <button onClick={() => setShowEduModal(true)} className="flex items-center gap-1 text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-full font-bold text-sm transition-colors">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            
            <div className="space-y-6">
              {profile.education.length > 0 ? profile.education.map((edu, idx) => (
                <div key={idx} className="flex gap-5 group relative">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <button onClick={() => handleDeleteEdu(idx)} className="absolute right-0 top-0 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 p-1.5 rounded-full">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <h3 className="font-bold text-slate-800 text-lg">{edu.school}</h3>
                    <p className="text-slate-700 font-medium">{edu.degree}{edu.fieldOfStudy && `, ${edu.fieldOfStudy}`}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-slate-400 font-medium">Where did you study? Add your education.</div>
              )}
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Skills Section */}
          <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 p-6 border border-slate-100/50">
            <h2 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-teal-500"/> Skills
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.skills.map((skill, idx) => (
                <span key={idx} className="bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 group transition-colors hover:bg-teal-100">
                  {skill}
                  <X className="w-3 h-3 cursor-pointer opacity-50 group-hover:opacity-100" onClick={() => handleRemoveSkill(skill)} />
                </span>
              ))}
            </div>
            <input 
              type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleAddSkill}
              placeholder="Type a skill and press Enter"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-medium"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 p-6 border border-slate-100/50">
            <h2 className="font-bold text-lg text-slate-800 mb-4">Contact Details</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wide">Email</h3>
                  {isEditingBasic ? (
                    <input type="text" value={editData.contactEmail || ''} onChange={e => setEditData({...editData, contactEmail: e.target.value})} className="text-sm font-medium w-full bg-white mt-1 px-2 py-1 rounded outline-none border border-blue-200"/>
                  ) : (
                    <p className="text-sm font-semibold text-slate-700 truncate">{profile.contactEmail || user?.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Phone</h3>
                  {isEditingBasic ? (
                    <input type="text" value={editData.contactPhone || ''} onChange={e => setEditData({...editData, contactPhone: e.target.value})} className="text-sm font-medium w-full bg-white mt-1 px-2 py-1 rounded outline-none border border-emerald-200"/>
                  ) : (
                    <p className="text-sm font-semibold text-slate-700">{profile.contactPhone || 'Not added'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      {/* Experience Modal */}
      {showExpModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-down">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800">Add Experience</h3>
              <button onClick={() => setShowExpModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleAddExp} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Job Title *</label>
                <input required type="text" value={expForm.title} onChange={e=>setExpForm({...expForm, title: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 font-medium"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Company *</label>
                <input required type="text" value={expForm.company} onChange={e=>setExpForm({...expForm, company: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 font-medium"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location</label>
                <input type="text" value={expForm.location} onChange={e=>setExpForm({...expForm, location: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 font-medium"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Start Date</label>
                  <input type="month" value={expForm.startDate} onChange={e=>setExpForm({...expForm, startDate: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 font-medium"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center justify-between">
                    End Date 
                    <label className="flex items-center gap-1 normal-case text-indigo-600 cursor-pointer">
                      <input type="checkbox" checked={expForm.current} onChange={e=>setExpForm({...expForm, current: e.target.checked})} className="rounded"/> Current
                    </label>
                  </label>
                  <input type="month" disabled={expForm.current} value={expForm.endDate} onChange={e=>setExpForm({...expForm, endDate: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 font-medium disabled:opacity-50 disabled:bg-slate-100"/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea rows="3" value={expForm.description} onChange={e=>setExpForm({...expForm, description: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 font-medium resize-none"></textarea>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={()=>setShowExpModal(false)} className="px-5 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-full transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors shadow-md shadow-indigo-600/20">Save Experience</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Education Modal */}
      {showEduModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-down">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800">Add Education</h3>
              <button onClick={() => setShowEduModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleAddEdu} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">School / University *</label>
                <input required type="text" value={eduForm.school} onChange={e=>setEduForm({...eduForm, school: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-purple-500 font-medium"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Degree</label>
                <input type="text" value={eduForm.degree} placeholder="e.g. Bachelor of Science" onChange={e=>setEduForm({...eduForm, degree: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-purple-500 font-medium"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Field of Study</label>
                <input type="text" value={eduForm.fieldOfStudy} placeholder="e.g. Computer Science" onChange={e=>setEduForm({...eduForm, fieldOfStudy: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-purple-500 font-medium"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Start Date</label>
                  <input type="month" value={eduForm.startDate} onChange={e=>setEduForm({...eduForm, startDate: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-purple-500 font-medium"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">End Date</label>
                  <input type="month" value={eduForm.endDate} onChange={e=>setEduForm({...eduForm, endDate: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-purple-500 font-medium"/>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={()=>setShowEduModal(false)} className="px-5 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-full transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-full transition-colors shadow-md shadow-purple-600/20">Save Education</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// SVG component missing from standard lucide sometimes
const LogOutIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

export default JobSeekerProfile;
