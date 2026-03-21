import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Shield, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/auth');
          return;
        }

        const res = await fetch('http://localhost:5000/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Not authorized or server error');
        }

        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-slate-900 text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Shield className="text-blue-400" />
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-800 rounded-md transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Users className="text-blue-600" size={20} />
              Registered Accounts
            </h2>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
              {users.length} Total
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading accounts...</div>
          ) : error ? (
            <div className="p-12 text-center text-red-500">Error: {error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Email</th>
                    <th className="p-4 font-semibold">Role</th>
                    <th className="p-4 font-semibold">Date Joined</th>
                    <th className="p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-500">No accounts found.</td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="p-4 font-medium text-slate-800">{user.name}</td>
                        <td className="p-4 text-slate-600">{user.email}</td>
                        <td className="p-4">
                          <span className={"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize " + (
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                            user.role === 'employer' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                          )}>
                            {user.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-sm font-medium">
                          {user.isLocked ? (
                            <span className="text-red-600">Locked</span>
                          ) : (
                            <span className="text-green-600">Active</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
