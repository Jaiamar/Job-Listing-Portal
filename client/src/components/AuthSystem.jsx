import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, User, Building2, Shield } from 'lucide-react';


const AuthSystem = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'job_seeker' // default
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Validation
  useEffect(() => {
    const newErrors = {};
    if (touched.email) {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    }
    
    if (touched.name && !isLogin && !formData.name) {
      newErrors.name = 'Name is required';
    }

    if (touched.password) {
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Must be at least 8 characters';
    }

    if (touched.confirmPassword && !isLogin) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
  }, [formData, touched, isLogin]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    // Touch all fields
    const allTouched = { email: true, password: true };
    if (!isLogin) {
      allTouched.name = true;
      allTouched.confirmPassword = true;
    }
    setTouched(allTouched);

    if (Object.keys(errors).length === 0 && formData.email && formData.password) {
      setIsLoading(true);
      
      const endpoint = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password, confirmPassword: formData.confirmPassword, role: formData.role };

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Something went wrong');
        }

        // Success
        localStorage.setItem('token', data.accessToken);
        setAuthSuccess(true);
        
        // Redirect after short delay
        setTimeout(() => {
          if (data.user.role === 'admin') {
            navigate('/admin/dashboard');
          } else if (data.user.role === 'employer') {
            navigate('/employer/profile');
          } else {
            navigate('/job-seeker/profile');
          }
        }, 1500);

      } catch (err) {
        setServerError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setTouched({});
    setServerError('');
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef] text-slate-800 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {authSuccess ? (
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-sm p-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Welcome!</h2>
          <p className="text-slate-500 text-center mb-6">Redirecting to your network...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 tracking-tight flex items-center justify-center gap-2">
              JobPortal<span className="text-slate-900">Network</span>
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              {isLogin ? 'Make the most of your professional life' : 'Join the largest professional network'}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden p-6 md:p-8">
            
            {serverError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md flex items-start gap-2 border border-red-100">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>{serverError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {!isLogin && (
                <div className="space-y-3 mb-6">
                  <label className="block text-sm font-semibold text-slate-700">I am joining as a:</label>
                  <div className="flex gap-4">
                    <label className={`flex-1 p-3 border rounded-lg cursor-pointer transition-all duration-200 flex flex-col items-center gap-2 ${formData.role === 'job_seeker' ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' : 'border-slate-300 hover:border-blue-400'}`}>
                      <input type="radio" name="role" value="job_seeker" checked={formData.role === 'job_seeker'} onChange={handleChange} className="hidden"/>
                      <User className={`w-6 h-6 ${formData.role === 'job_seeker' ? 'text-blue-600' : 'text-slate-500'}`} />
                      <span className={`text-sm font-semibold ${formData.role === 'job_seeker' ? 'text-blue-700' : 'text-slate-600'}`}>Job Seeker</span>
                    </label>
                    <label className={`flex-1 p-3 border rounded-lg cursor-pointer transition-all duration-200 flex flex-col items-center gap-2 ${formData.role === 'employer' ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' : 'border-slate-300 hover:border-blue-400'}`}>
                      <input type="radio" name="role" value="employer" checked={formData.role === 'employer'} onChange={handleChange} className="hidden"/>
                      <Building2 className={`w-6 h-6 ${formData.role === 'employer' ? 'text-blue-600' : 'text-slate-500'}`} />
                      <span className={`text-sm font-semibold ${formData.role === 'employer' ? 'text-blue-700' : 'text-slate-600'}`}>Employer</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Name Field */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name {formData.role === 'employer' && '/ Company Name'}</label>
                  <input
                    type="text" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur}
                    className={`w-full px-3 py-2 bg-transparent border rounded-md outline-none text-slate-900 transition-colors focus:ring-1 focus:ring-blue-600 ${touched.name && errors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-400 focus:border-blue-600'}`}
                  />
                  {touched.name && errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur}
                  className={`w-full px-3 py-2 bg-transparent border rounded-md outline-none text-slate-900 transition-colors focus:ring-1 focus:ring-blue-600 ${touched.email && errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-400 focus:border-blue-600'}`}
                />
                {touched.email && errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} onBlur={handleBlur}
                    className={`w-full px-3 py-2 pr-10 bg-transparent border rounded-md outline-none text-slate-900 transition-colors focus:ring-1 focus:ring-blue-600 ${touched.password && errors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-400 focus:border-blue-600'}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-600 font-semibold text-sm">
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {touched.password && errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur}
                      className={`w-full px-3 py-2 bg-transparent border rounded-md outline-none text-slate-900 transition-colors focus:ring-1 focus:ring-blue-600 ${touched.confirmPassword && errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-slate-400 focus:border-blue-600'}`}
                    />
                  </div>
                  {touched.confirmPassword && errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                </div>
              )}

              {isLogin && (
                <div className="pt-2">
                  <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors hover:underline">
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold transition-colors disabled:opacity-70 mt-6 text-lg"
              >
                {isLoading ? 'Please wait...' : (isLogin ? 'Sign in' : 'Agree & Join')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                {isLogin ? 'New to JobPortalNetwork? ' : 'Already on JobPortalNetwork? '}
                <button type="button" onClick={toggleMode} className="font-semibold text-blue-600 hover:text-blue-800 hover:underline">
                  {isLogin ? 'Join now' : 'Sign in'}
                </button>
              </p>
            </div>

          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-down { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-up { 
          from { opacity: 0; transform: translateY(15px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-down { animation: slide-down 0.2s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
      `}} />
    </div>
  );
};

export default AuthSystem;
