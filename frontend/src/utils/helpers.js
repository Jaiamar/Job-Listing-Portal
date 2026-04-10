// Date helper
export const formatDistanceToNow = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatSalary = (min, max) => {
  if (!min && !max) return 'Not disclosed';
  const fmt = (n) => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : `₹${(n/1000).toFixed(0)}k`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  return `Up to ${fmt(max)}`;
};

export const getStatusClass = (status) => {
  const map = {
    'Submitted':      'status-submitted',
    'Under Review':   'status-under-review',
    'Shortlisted':    'status-shortlisted',
    'Interview':      'status-interview',
    'Offer Extended': 'status-offer-extended',
    'Rejected':       'status-rejected',
    'Withdrawn':      'status-withdrawn'
  };
  return map[status] || 'badge-neutral';
};

export const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const truncate = (str, len = 120) => {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '…' : str;
};
