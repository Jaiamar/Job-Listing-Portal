import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiBriefcase, FiArrowRight } from 'react-icons/fi';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'seeker';

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: defaultRole, phone: '', companyName: ''
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all required fields');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.role === 'employer' && !form.companyName) return toast.error('Please enter your company name');

    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Account created! Welcome to JobPortal, ${user.name.split(' ')[0]}! 🎉`);
      const map = { seeker: '/seeker', employer: '/employer' };
      navigate(map[user.role] || '/');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm({...form, [field]: e.target.value});

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">
            <div className="navbar-logo-icon"><FiBriefcase size={24} /></div>
            <span className="navbar-logo-text">Job<span className="logo-accent">Portal</span></span>
          </div>
          <h2 className="auth-left-title">Start your journey to a better career today.</h2>
          <p className="auth-left-subtitle">Free forever for job seekers. Simple and powerful for employers.</p>
          <div className="auth-role-cards">
            <div className={`auth-role-card ${form.role === 'seeker' ? 'active' : ''}`} onClick={() => setForm({...form, role: 'seeker'})}>
              <FiUser size={22} />
              <div>
                <p className="auth-role-title">Job Seeker</p>
                <p className="auth-role-desc">Find & apply for jobs</p>
              </div>
            </div>
            <div className={`auth-role-card ${form.role === 'employer' ? 'active' : ''}`} onClick={() => setForm({...form, role: 'employer'})}>
              <FiBriefcase size={22} />
              <div>
                <p className="auth-role-title">Employer</p>
                <p className="auth-role-desc">Post jobs & hire talent</p>
              </div>
            </div>
          </div>
        </div>
        <div className="auth-left-pattern"></div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrapper animate-slideup">
          <div className="auth-form-header">
            <h1 className="auth-form-title">Create your account</h1>
            <p className="auth-form-subtitle">Join thousands of {form.role === 'seeker' ? 'professionals finding jobs' : 'companies hiring talent'}</p>
          </div>

          {/* Role Selector (Mobile) */}
          <div className="auth-role-toggle">
            {['seeker', 'employer'].map(r => (
              <button key={r} type="button"
                className={`auth-role-btn ${form.role === r ? 'active' : ''}`}
                onClick={() => setForm({...form, role: r})}
              >
                {r === 'seeker' ? 'Job Seeker' : 'Employer'}
              </button>
            ))}
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <div className="input-icon-wrapper">
                  <FiUser className="input-icon" size={16} />
                  <input type="text" className="form-input input-with-icon" placeholder="John Doe" value={form.name} onChange={set('name')} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input type="tel" className="form-input" placeholder="+91 9876543210" value={form.phone} onChange={set('phone')} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <div className="input-icon-wrapper">
                <FiMail className="input-icon" size={16} />
                <input type="email" className="form-input input-with-icon" placeholder="you@example.com" value={form.email} onChange={set('email')} />
              </div>
            </div>

            {form.role === 'employer' && (
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <div className="input-icon-wrapper">
                  <FiBriefcase className="input-icon" size={16} />
                  <input type="text" className="form-input input-with-icon" placeholder="Acme Corp" value={form.companyName} onChange={set('companyName')} />
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password *</label>
                <div className="input-icon-wrapper">
                  <FiLock className="input-icon" size={16} />
                  <input type={showPw ? 'text' : 'password'} className="form-input input-with-icon input-with-action" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} />
                  <button type="button" className="input-action" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <div className="input-icon-wrapper">
                  <FiLock className="input-icon" size={16} />
                  <input type={showPw ? 'text' : 'password'} className="form-input input-with-icon" placeholder="Repeat password" value={form.confirmPassword} onChange={set('confirmPassword')} />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <span className="spinner"></span> : <><span>Create Account</span><FiArrowRight size={18}/></>}
            </button>

            <p className="auth-terms">By creating an account you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</p>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="auth-link">Sign in here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
