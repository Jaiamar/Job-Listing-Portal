import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '20px', textAlign: 'center', background: 'var(--color-bg)' }}>
          <FiAlertTriangle size={64} color="var(--color-danger)" style={{ marginBottom: '20px' }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '10px' }}>Something went wrong.</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>We apologize for the inconvenience. Please try refreshing the page.</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
