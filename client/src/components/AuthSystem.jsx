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
    <div className="min-h-screen bg-white text-slate-800 font-sans relative flex flex-col md:flex-row">
      
      {/* Left Area - Form */}
      <div className="w-full md:w-1/2 lg:w-[45%] flex flex-col justify-center items-center p-6 sm:p-12 relative z-10 min-h-screen overflow-y-auto">
        {authSuccess ? (
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-lg p-8 flex flex-col items-center animate-fade-in-up">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome!</h2>
            <p className="text-slate-500 text-center mb-8 font-medium">Redirecting to your network...</p>
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="w-full max-w-md animate-fade-in-up">
            <div className="mb-10 lg:mb-12">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-blue-600 tracking-tight flex items-center gap-2 mb-3">
                JobPortal<span className="text-slate-900">Network</span>
              </h1>
              <p className="text-slate-500 font-medium text-lg">
                {isLogin ? 'Welcome back! Please enter your details.' : 'Create an account to jumpstart your career.'}
              </p>
            </div>

            <div className="bg-white">
              {serverError && (
                <div className="mb-6 p-4 bg-red-50/80 text-red-600 text-sm rounded-xl flex items-start gap-3 border border-red-100">
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <p className="font-medium">{serverError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="space-y-3 mb-8">
                    <label className="block text-sm font-bold text-slate-700">I am joining as a:</label>
                    <div className="flex gap-4">
                      <label className={`flex-1 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center gap-3 ${formData.role === 'job_seeker' ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-500/10' : 'border-slate-200 hover:border-blue-300 bg-slate-50/50'}`}>
                        <input type="radio" name="role" value="job_seeker" checked={formData.role === 'job_seeker'} onChange={handleChange} className="hidden"/>
                        <div className={`p-3 rounded-full ${formData.role === 'job_seeker' ? 'bg-blue-100' : 'bg-slate-200'}`}>
                          <User className={`w-6 h-6 ${formData.role === 'job_seeker' ? 'text-blue-600' : 'text-slate-500'}`} />
                        </div>
                        <span className={`text-sm font-bold ${formData.role === 'job_seeker' ? 'text-blue-700' : 'text-slate-600'}`}>Job Seeker</span>
                      </label>
                      <label className={`flex-1 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center gap-3 ${formData.role === 'employer' ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-500/10' : 'border-slate-200 hover:border-blue-300 bg-slate-50/50'}`}>
                        <input type="radio" name="role" value="employer" checked={formData.role === 'employer'} onChange={handleChange} className="hidden"/>
                        <div className={`p-3 rounded-full ${formData.role === 'employer' ? 'bg-blue-100' : 'bg-slate-200'}`}>
                          <Building2 className={`w-6 h-6 ${formData.role === 'employer' ? 'text-blue-600' : 'text-slate-500'}`} />
                        </div>
                        <span className={`text-sm font-bold ${formData.role === 'employer' ? 'text-blue-700' : 'text-slate-600'}`}>Employer</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Name Field */}
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name {formData.role === 'employer' && '/ Company Name'}</label>
                    <input
                      type="text" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur}
                      className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl outline-none text-slate-900 font-medium transition-colors focus:bg-white focus:ring-4 focus:ring-blue-600/10 ${touched.name && errors.name ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'}`}
                    />
                    {touched.name && errors.name && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.name}</p>}
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Email</label>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl outline-none text-slate-900 font-medium transition-colors focus:bg-white focus:ring-4 focus:ring-blue-600/10 ${touched.email && errors.email ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'}`}
                  />
                  {touched.email && errors.email && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} onBlur={handleBlur}
                      className={`w-full px-4 py-3 pr-12 bg-slate-50 border-2 rounded-xl outline-none text-slate-900 font-medium transition-colors focus:bg-white focus:ring-4 focus:ring-blue-600/10 ${touched.password && errors.password ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'}`}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-600 transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {touched.password && errors.password && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur}
                        className={`w-full px-4 py-3 pr-12 bg-slate-50 border-2 rounded-xl outline-none text-slate-900 font-medium transition-colors focus:bg-white focus:ring-4 focus:ring-blue-600/10 ${touched.confirmPassword && errors.confirmPassword ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'}`}
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-600 transition-colors">
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {touched.confirmPassword && errors.confirmPassword && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.confirmPassword}</p>}
                  </div>
                )}

                {isLogin && (
                  <div className="pt-2 flex justify-between items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                      <span className="text-sm font-semibold text-slate-600">Remember me</span>
                    </label>
                    <button type="button" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all disabled:opacity-70 mt-8 text-lg shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5"
                >
                  {isLoading ? 'Please wait...' : (isLogin ? 'Sign in' : 'Agree & Join')}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-slate-600 font-medium">
                  {isLogin ? "Don't have an account? " : "Already on JobPortalNetwork? "}
                  <button type="button" onClick={toggleMode} className="font-bold text-blue-600 hover:text-blue-800 transition-colors">
                    {isLogin ? 'Join now' : 'Sign in'}
                  </button>
                </p>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Right Area - Image */}
      <div className="hidden md:flex md:w-1/2 lg:w-[55%] relative flex-col justify-end items-center overflow-hidden bg-slate-900">
         <img 
           src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
           alt="Professionals working" 
           className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay transition-transform duration-10000 hover:scale-105" 
         />
         <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-900/40 to-transparent"></div>
         
         <div className="relative z-10 text-center px-12 text-white pb-24 max-w-2xl animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 drop-shadow-md leading-tight">
              A Platform Where Features Work Fast <br />& Correctly!
            </h2>
            <p className="text-lg lg:text-xl font-medium text-slate-200 drop-shadow-md max-w-xl mx-auto leading-relaxed">
              Connect with industry leaders, discover exciting opportunities, and accelerate your professional growth effortlessly.
            </p>
            
            <div className="mt-10 flex items-center justify-center gap-6 text-sm font-bold text-slate-300">
              <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-blue-400"/> Secure Data</div>
              <div className="flex items-center gap-2"><User className="w-5 h-5 text-blue-400"/> 10k+ Users</div>
              <div className="flex items-center gap-2"><Building2 className="w-5 h-5 text-blue-400"/> Top Companies</div>
            </div>
         </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-down { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-up { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-down { animation: slide-down 0.2s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
};

export default AuthSystem;
