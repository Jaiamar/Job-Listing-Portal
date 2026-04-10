import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiArrowRight, FiStar, FiBriefcase, FiUsers, FiTrendingUp, FiZap, FiCheckCircle } from 'react-icons/fi';
import api from '../services/api';
import JobCard from '../components/JobCard';
import './Home.css';

const CATEGORIES = [
  { icon: '💻', label: 'Technology', count: '2.4k+ jobs' },
  { icon: '📊', label: 'Finance', count: '1.2k+ jobs' },
  { icon: '🎨', label: 'Design', count: '890+ jobs' },
  { icon: '📣', label: 'Marketing', count: '1.5k+ jobs' },
  { icon: '⚕️', label: 'Healthcare', count: '980+ jobs' },
  { icon: '📚', label: 'Education', count: '650+ jobs' },
  { icon: '🏗️', label: 'Engineering', count: '1.8k+ jobs' },
  { icon: '🤝', label: 'Sales', count: '2.1k+ jobs' },
];

const STATS = [
  { icon: <FiBriefcase />, value: '12,000+', label: 'Active Jobs' },
  { icon: <FiUsers />,    value: '48,000+', label: 'Registered Users' },
  { icon: <FiStar />,     value: '3,200+',  label: 'Top Companies' },
  { icon: <FiTrendingUp />, value: '92%',   label: 'Placement Rate' },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer @ Google',
    text: 'Found my dream job within 3 weeks! The platform is incredibly intuitive and the job feed was perfectly curated for my skills.',
    avatar: 'PS',
    rating: 5
  },
  {
    name: 'Rahul Mehta',
    role: 'Product Manager @ Flipkart',
    text: 'As a hiring manager, I can\'t imagine a smoother tool for posting jobs and reviewing candidates. Saved us hours every week.',
    avatar: 'RM',
    rating: 5
  },
  {
    name: 'Anjali Verma',
    role: 'UX Designer @ Zomato',
    text: 'The resume builder and profile completion tracker were game changers. Got 6 interview calls in my first month!',
    avatar: 'AV',
    rating: 5
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    api.get('/jobs?limit=6&sort=newest')
      .then(({ data }) => setFeaturedJobs(data.data || []))
      .catch(() => {})
      .finally(() => setLoadingJobs(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="home-page">

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-bg-pattern"></div>
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>

        <div className="container hero-content">
          <div className="hero-badge animate-float">
            <FiZap size={14} />
            <span>India's Fastest Growing Job Platform</span>
          </div>

          <h1 className="hero-title animate-float" style={{ animationDelay: '60ms' }}>
            Find Your <span className="hero-title-gradient">Dream Career</span>
            <br />Without the Hustle
          </h1>

          <p className="hero-subtitle animate-float" style={{ animationDelay: '120ms' }}>
            Connect with 3,200+ top companies. Discover roles that match your skills,
            values, and ambitions — all in one beautifully simple platform.
          </p>

          {/* Search Form */}
          <form className="hero-search animate-float" onSubmit={handleSearch} style={{ animationDelay: '180ms' }}>
            <div className="hero-search-field">
              <FiSearch className="hero-search-icon" size={18} />
              <input
                type="text"
                placeholder="Job title, skills, or keyword..."
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                className="hero-search-input"
              />
            </div>
            <div className="hero-search-divider"></div>
            <div className="hero-search-field">
              <FiMapPin className="hero-search-icon" size={18} />
              <input
                type="text"
                placeholder="City or Remote..."
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="hero-search-input"
              />
            </div>
            <button type="submit" className="btn btn-primary hero-search-btn">
              Search Jobs <FiArrowRight size={16} />
            </button>
          </form>

          {/* Popular Searches */}
          <div className="hero-popular animate-float" style={{ animationDelay: '240ms' }}>
            <span className="hero-popular-label">Popular:</span>
            {['React Developer', 'Product Manager', 'UI Designer', 'Data Scientist', 'Remote'].map(t => (
              <button
                key={t}
                className="tag"
                onClick={() => navigate(`/jobs?keyword=${t}`)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="container">
          <div className="hero-stats stagger">
            {STATS.map((s) => (
              <div key={s.label} className="hero-stat animate-float">
                <div className="hero-stat-icon">{s.icon}</div>
                <div>
                  <div className="hero-stat-value">{s.value}</div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Explore by Industry</p>
              <h2 className="section-title">Browse Job <span className="text-gradient">Categories</span></h2>
            </div>
            <Link to="/jobs" className="btn btn-outline" style={{ flexShrink: 0 }}>
              All Categories <FiArrowRight size={15} />
            </Link>
          </div>

          <div className="categories-grid stagger">
            {CATEGORIES.map(cat => (
              <button
                key={cat.label}
                className="category-card animate-float"
                onClick={() => navigate(`/jobs?keyword=${cat.label}`)}
              >
                <span className="category-icon">{cat.icon}</span>
                <div>
                  <p className="category-label">{cat.label}</p>
                  <p className="category-count">{cat.count}</p>
                </div>
                <FiArrowRight size={14} className="category-arrow" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED JOBS ── */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Hand-picked for You</p>
              <h2 className="section-title">Latest <span className="text-gradient">Opportunities</span></h2>
            </div>
            <Link to="/jobs" className="btn btn-outline" style={{ flexShrink: 0 }}>
              View All Jobs <FiArrowRight size={15} />
            </Link>
          </div>

          {loadingJobs ? (
            <div className="jobs-skeleton-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="job-skeleton-card">
                  <div className="skeleton" style={{ width: 52, height: 52, borderRadius: 12 }}></div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="skeleton" style={{ height: 18, width: '70%' }}></div>
                    <div className="skeleton" style={{ height: 14, width: '45%' }}></div>
                    <div className="skeleton" style={{ height: 14, width: '60%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredJobs.length > 0 ? (
            <div className="featured-jobs-grid stagger">
              {featuredJobs.map(job => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>No jobs yet</h3>
              <p>Check back soon — employers are posting new opportunities daily.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section how-section">
        <div className="container">
          <div className="how-inner">
            <div className="how-content">
              <p className="section-eyebrow">Simple Process</p>
              <h2 className="section-title">Land a Job in <span className="text-gradient">4 Easy Steps</span></h2>
              <p className="section-subtitle">Our streamlined process takes you from registration to offer letter with minimal friction.</p>

              <div className="how-steps">
                {[
                  { num: '01', title: 'Create your profile', desc: 'Sign up and build a compelling profile with your skills, experience, and resume.' },
                  { num: '02', title: 'Discover opportunities', desc: 'Browse thousands of curated job listings filtered by your preferences.' },
                  { num: '03', title: 'Apply in one click', desc: 'Submit applications instantly with your pre-filled profile and saved resume.' },
                  { num: '04', title: 'Track & celebrate', desc: 'Monitor application status in real-time and receive notifications at every stage.' },
                ].map((step, i) => (
                  <div key={i} className="how-step">
                    <div className="how-step-num">{step.num}</div>
                    <div>
                      <h4 className="how-step-title">{step.title}</h4>
                      <p className="how-step-desc">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Free <FiArrowRight size={18} />
              </Link>
            </div>

            <div className="how-visual">
              <div className="how-visual-card">
                <div className="how-visual-header">
                  <div className="avatar avatar-md">JD</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>John Doe</p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Senior React Developer</p>
                  </div>
                  <span className="badge badge-success" style={{ marginLeft: 'auto' }}>Available</span>
                </div>
                <div className="how-visual-divider"></div>
                {[
                  { company: 'Google', role: 'Senior Frontend Engineer', status: 'Interview', color: 'status-interview' },
                  { company: 'Microsoft', role: 'React Developer', status: 'Shortlisted', color: 'status-shortlisted' },
                  { company: 'Flipkart', role: 'Lead Engineer', status: 'Under Review', color: 'status-under-review' },
                ].map((app, i) => (
                  <div key={i} className="how-visual-app">
                    <div className="company-logo-placeholder" style={{ width: 36, height: 36, fontSize: 12, borderRadius: 8 }}>
                      {app.company.slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{app.role}</p>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{app.company}</p>
                    </div>
                    <span className={`badge ${app.color}`}>{app.status}</span>
                  </div>
                ))}
                <div className="how-visual-checks">
                  {['Profile 90% complete', 'Resume uploaded', '3 applications sent'].map((c, i) => (
                    <div key={i} className="how-visual-check">
                      <FiCheckCircle size={14} color="var(--color-success)" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section testimonials-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <p className="section-eyebrow">Success Stories</p>
            <h2 className="section-title">Trusted by <span className="text-gradient">Thousands</span></h2>
          </div>
          <div className="testimonials-grid stagger">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card animate-float">
                <div className="testimonial-stars">
                  {[...Array(t.rating)].map((_, j) => <FiStar key={j} size={14} fill="var(--color-warning)" color="var(--color-warning)" />)}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="avatar avatar-sm">{t.avatar}</div>
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-role">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-inner">
            <div className="cta-orb"></div>
            <h2 className="cta-title">Ready to Find Your Next Opportunity?</h2>
            <p className="cta-subtitle">Join over 48,000 professionals already using JobPortal to advance their careers.</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-xl" style={{ background: '#fff', color: 'var(--color-primary)', fontWeight: 700 }}>
                Start for Free <FiArrowRight size={20} />
              </Link>
              <Link to="/jobs" className="btn btn-xl" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '2px solid rgba(255,255,255,0.3)' }}>
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="navbar-logo" style={{ marginBottom: 12 }}>
                <div className="navbar-logo-icon"><FiBriefcase size={18} /></div>
                <span className="navbar-logo-text">Job<span className="logo-accent">Portal</span></span>
              </div>
              <p className="footer-brand-desc">Connecting talent with opportunity across India and beyond.</p>
            </div>
            <div className="footer-col">
              <h5>Job Seekers</h5>
              <Link to="/jobs">Browse Jobs</Link>
              <Link to="/register?role=seeker">Create Account</Link>
              <Link to="/login">Sign In</Link>
            </div>
            <div className="footer-col">
              <h5>Employers</h5>
              <Link to="/register?role=employer">Post a Job</Link>
              <Link to="/employer">Employer Dashboard</Link>
            </div>
            <div className="footer-col">
              <h5>Company</h5>
              <a href="#">About Us</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 JobPortal by Amdox Technologies. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
