import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiBriefcase, FiArrowRight } from 'react-icons/fi';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}! 👋`);
      const map = { seeker: '/seeker', employer: '/employer', admin: '/admin' };
      navigate(map[user.role] || '/');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Invalid credentials';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">
            <div className="navbar-logo-icon"><FiBriefcase size={24} /></div>
            <span className="navbar-logo-text">Job<span className="logo-accent">Portal</span></span>
          </div>
          <h2 className="auth-left-title">Your next career move starts here.</h2>
          <p className="auth-left-subtitle">Join thousands of professionals finding their dream roles every day.</p>
          <div className="auth-left-features">
            {['12,000+ active opportunities', '3,200+ verified employers', 'Real-time application tracking', 'One-click easy apply'].map(f => (
              <div key={f} className="auth-feature">
                <span className="auth-feature-dot"></span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="auth-left-pattern"></div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrapper animate-slideup">
          <div className="auth-form-header">
            <h1 className="auth-form-title">Welcome back</h1>
            <p className="auth-form-subtitle">Sign in to continue your job search journey</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrapper">
                <FiMail className="input-icon" size={16} />
                <input
                  type="email"
                  className="form-input input-with-icon"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <a href="#" className="auth-forgot">Forgot password?</a>
              </div>
              <div className="input-icon-wrapper">
                <FiLock className="input-icon" size={16} />
                <input
                  type={showPw ? 'text' : 'password'}
                  className="form-input input-with-icon input-with-action"
                  placeholder="Your password"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  autoComplete="current-password"
                />
                <button type="button" className="input-action" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <span className="spinner"></span> : <><span>Sign In</span><FiArrowRight size={18}/></>}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register" className="auth-link">Create one free</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
