import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiFilter, FiX } from 'react-icons/fi';
import api from '../services/api';
import JobCard from '../components/JobCard';
import './Jobs.css';

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 });
  
  // Filters State
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    jobType: searchParams.get('jobType') || '',
    salaryMin: searchParams.get('salaryMin') || '',
    datePosted: searchParams.get('datePosted') || '',
    sort: searchParams.get('sort') || 'newest',
    page: searchParams.get('page') || 1
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      const { data } = await api.get(`/jobs?${params.toString()}`);
      setJobs(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // Sync URL
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    setSearchParams(params, { replace: true });
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      keyword: '', location: '', jobType: '', salaryMin: '', datePosted: '', sort: 'newest', page: 1
    });
  };

  const hasActiveFilters = filters.keyword || filters.location || filters.jobType || filters.salaryMin || filters.datePosted;

  return (
    <div className="page-content jobs-page">
      <div className="jobs-header-banner">
        <div className="container">
          <h1 className="jobs-page-title">Find Your Next Role</h1>
          <p className="jobs-page-subtitle">Discover {pagination.total > 0 ? pagination.total : 'thousands of'} opportunities across top companies.</p>
          
          <div className="jobs-main-search">
            <div className="jobs-search-input-wrap">
              <FiSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Job title, skills, or company" 
                value={filters.keyword}
                onChange={e => handleFilterChange('keyword', e.target.value)}
              />
            </div>
            <div className="jobs-search-divider"></div>
            <div className="jobs-search-input-wrap">
              <FiMapPin className="search-icon" />
              <input 
                type="text" 
                placeholder="City, state, or remote" 
                value={filters.location}
                onChange={e => handleFilterChange('location', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container jobs-layout">
        <button className="mobile-filters-toggle btn btn-outline btn-full" onClick={() => setMobileFiltersOpen(true)}>
          <FiFilter /> Show Filters
        </button>

        {/* Sidebar Filters */}
        <aside className={`jobs-sidebar ${mobileFiltersOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Filters</h3>
            {hasActiveFilters && (
              <button className="btn-ghost btn-sm" onClick={handleClearFilters}>Clear all</button>
            )}
            <button className="close-filters-btn" onClick={() => setMobileFiltersOpen(false)}><FiX size={20}/></button>
          </div>

          <div className="filter-group">
            <label className="form-label">Sort By</label>
            <select className="form-select" value={filters.sort} onChange={e => handleFilterChange('sort', e.target.value)}>
              <option value="newest">Most Recent</option>
              <option value="salary-high">Salary: High to Low</option>
              <option value="salary-low">Salary: Low to High</option>
              <option value="company">Company Name</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="form-label">Date Posted</label>
            <div className="radio-group">
              <label className="radio-label">
                <input type="radio" name="datePosted" value="" checked={filters.datePosted === ''} onChange={() => handleFilterChange('datePosted', '')}/>
                Any time
              </label>
              <label className="radio-label">
                <input type="radio" name="datePosted" value="24h" checked={filters.datePosted === '24h'} onChange={() => handleFilterChange('datePosted', '24h')}/>
                Past 24 hours
              </label>
              <label className="radio-label">
                <input type="radio" name="datePosted" value="7d" checked={filters.datePosted === '7d'} onChange={() => handleFilterChange('datePosted', '7d')}/>
                Past 7 days
              </label>
              <label className="radio-label">
                <input type="radio" name="datePosted" value="30d" checked={filters.datePosted === '30d'} onChange={() => handleFilterChange('datePosted', '30d')}/>
                Past 30 days
              </label>
            </div>
          </div>

          <div className="filter-group">
            <label className="form-label">Job Type</label>
            <div className="radio-group">
              <label className="radio-label">
                <input type="radio" name="jobType" value="" checked={filters.jobType === ''} onChange={() => handleFilterChange('jobType', '')}/>
                All Types
              </label>
              {['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Remote'].map(type => (
                <label key={type} className="radio-label">
                  <input type="radio" name="jobType" value={type} checked={filters.jobType === type} onChange={() => handleFilterChange('jobType', type)}/>
                  {type}
                </label>
              ))}
            </div>
          </div>
          
          <div className="filter-group">
            <label className="form-label">Minimum Salary (₹ per year)</label>
            <input 
              type="number" 
              className="form-input" 
              placeholder="e.g. 500000"
              value={filters.salaryMin}
              onChange={e => handleFilterChange('salaryMin', e.target.value)}
              step="100000"
            />
          </div>
        </aside>

        {/* Results */}
        <main className="jobs-results">
          {loading ? (
            <div className="jobs-skeleton-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="job-skeleton-card">
                   <div className="skeleton" style={{ width: 52, height: 52, borderRadius: 12 }}></div>
                   <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                     <div className="skeleton" style={{ height: 18, width: '70%' }}></div>
                     <div className="skeleton" style={{ height: 14, width: '45%' }}></div>
                   </div>
                </div>
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <>
              <div className="jobs-count-text">
                Showing {jobs.length} of {pagination.total} jobs
              </div>
              <div className="jobs-grid">
                {jobs.map(job => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
              
              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="pagination">
                  <button 
                    disabled={pagination.page === 1} 
                    onClick={() => handleFilterChange('page', pagination.page - 1)}
                    className="btn btn-outline"
                  >
                    Previous
                  </button>
                  <span className="page-info">Page {pagination.page} of {pagination.pages}</span>
                  <button 
                    disabled={pagination.page === pagination.pages} 
                    onClick={() => handleFilterChange('page', pagination.page + 1)}
                    className="btn btn-outline"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📄</div>
              <h3>No jobs found</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
              {hasActiveFilters && (
                <button className="btn btn-primary" onClick={handleClearFilters}>Clear all filters</button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
