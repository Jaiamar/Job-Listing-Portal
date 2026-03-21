import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthSystem from './components/AuthSystem';
import JobSeekerProfile from './components/JobSeekerProfile';
import EmployerProfile from './components/EmployerProfile';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<AuthSystem />} />
        <Route path="/job-seeker/profile" element={<JobSeekerProfile />} />
        <Route path="/employer/profile" element={<EmployerProfile />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
