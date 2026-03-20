import React, { useState, useEffect } from 'react';

// Common Icons (inline to avoid external dependencies)
const Mail = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const Lock = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const Eye = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
);
const EyeOff = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
);
const AlertCircle = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
);
const CheckCircle2 = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
);
const User = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const AuthSystem = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [jwtToken, setJwtToken] = useState(null);

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
      else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Must include uppercase, lowercase, and number';
      }
    }

    if (touched.confirmPassword && !isLogin) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
  }, [formData, touched, isLogin]);

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length > 7) strength += 25;
    if (/(?=.*[a-z])/.test(password)) strength += 25;
    if (/(?=.*[A-Z])/.test(password)) strength += 25;
    if (/(?=.*\d)(?=.*[@$!%*?&])/.test(password)) strength += 25;
    return strength;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Touch all fields
    const allTouched = { email: true, password: true };
    if (!isLogin) {
      allTouched.name = true;
      allTouched.confirmPassword = true;
    }
    setTouched(allTouched);

    if (Object.keys(errors).length === 0 && formData.email && formData.password) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        // Mock token generation
        const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
        const payload = btoa(JSON.stringify({
          sub: "1234567890",
          name: formData.name || "User",
          email: formData.email,
          role: "user",
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (60 * 60)
        }));
        const signature = btoa("mock-signature-do-not-use");
        setJwtToken(`${header}.${payload}.${signature}`);
      }, 1500);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setTouched({});
    setJwtToken(null);
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordColor = 
    passwordStrength < 50 ? 'bg-red-500' :
    passwordStrength < 75 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4 font-sans relative overflow-hidden selection:bg-blue-500/20">
      
      {/* Background ambient light effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/20 rounded-full blur-[120px] pointer-events-none" />

      {jwtToken ? (
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 transform transition-all animate-fade-in-up">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Authentication Successful</h2>
          <p className="text-slate-500 text-center mb-6">Welcome back, <span className="font-medium text-slate-700">{formData.email}</span></p>
          
          <div className="bg-slate-50 rounded-xl p-5 mb-6 border border-slate-100 overflow-hidden shadow-inner">
            <p className="text-xs text-blue-600 font-bold mb-3 uppercase tracking-wider">Generated JWT Token</p>
            <p className="font-mono text-sm break-all leading-relaxed whitespace-pre-wrap">
              <span className="text-pink-600 font-semibold">{jwtToken.split('.')[0]}</span>.
              <span className="text-indigo-600 font-semibold">{jwtToken.split('.')[1]}</span>.
              <span className="text-teal-600 font-semibold">{jwtToken.split('.')[2]}</span>
            </p>
          </div>
          
          <button 
            onClick={() => setJwtToken(null)}
            className="w-full py-3.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold shadow-sm transition-all duration-200"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.08)] overflow-hidden transition-all duration-500 relative ring-1 ring-slate-900/5">
            
            {/* Header / Tabs */}
            <div className="flex p-1.5 bg-slate-100/80 m-3 rounded-2xl">
              <button
                type="button"
                onClick={() => !isLogin && toggleMode()}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  isLogin ? 'bg-white text-blue-600 shadow-[0_2px_8px_rgb(0,0,0,0.08)]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => isLogin && toggleMode()}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  !isLogin ? 'bg-white text-blue-600 shadow-[0_2px_8px_rgb(0,0,0,0.08)]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                Sign Up
              </button>
            </div>

            <div className="p-8 pt-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
                  {isLogin ? 'Welcome back' : 'Create an account'}
                </h2>
                <p className="text-sm text-slate-500">
                  {isLogin ? 'Enter your details to access your dashboard' : 'Start your journey with us today'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name Field (Sign up only) */}
                {!isLogin && (
                  <div className="animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className={`w-5 h-5 transition-colors duration-200 ${touched.name && errors.name ? 'text-red-500' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full pl-12 pr-4 py-3.5 bg-white border transition-all duration-200 rounded-xl outline-none text-slate-900 placeholder-slate-400 focus:bg-white ${
                          touched.name && errors.name 
                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
                            : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300'
                        }`}
                        placeholder="John Doe"
                      />
                    </div>
                    {touched.name && errors.name && (
                      <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1.5 ml-1 animate-slide-down">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                      </p>
                    )}
                  </div>
                )}

                {/* Email Field */}
                <div className={!isLogin ? "animate-fade-in-up" : ""} style={{ animationDelay: !isLogin ? '50ms' : '0ms' }}>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className={`w-5 h-5 transition-colors duration-200 ${touched.email && errors.email ? 'text-red-500' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-12 pr-4 py-3.5 bg-white border transition-all duration-200 rounded-xl outline-none text-slate-900 placeholder-slate-400 focus:bg-white ${
                        touched.email && errors.email 
                          ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
                          : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300'
                      }`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {touched.email && errors.email && (
                    <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1.5 ml-1 animate-slide-down">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className={!isLogin ? "animate-fade-in-up" : ""} style={{ animationDelay: !isLogin ? '100ms' : '0ms' }}>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className={`w-5 h-5 transition-colors duration-200 ${touched.password && errors.password ? 'text-red-500' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-12 pr-12 py-3.5 bg-white border transition-all duration-200 rounded-xl outline-none text-slate-900 placeholder-slate-400 focus:bg-white ${
                        touched.password && errors.password 
                          ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
                          : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors bg-transparent border-none outline-none focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {touched.password && errors.password && (
                    <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1.5 ml-1 animate-slide-down">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.password}
                    </p>
                  )}

                  {/* Password Strength Indicator (Sign up only) */}
                  {!isLogin && formData.password && (
                    <div className="mt-3 animate-fade-in px-1">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs text-slate-500 font-medium">Password strength</span>
                        <span className={`text-xs font-bold ${passwordStrength < 50 ? 'text-red-500' : passwordStrength < 75 ? 'text-yellow-600' : 'text-green-500'}`}>
                          {passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Good' : 'Strong'}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ease-out ${passwordColor}`}
                          style={{ width: `${passwordStrength}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password (Sign up only) */}
                {!isLogin && (
                  <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Confirm Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className={`w-5 h-5 transition-colors duration-200 ${touched.confirmPassword && errors.confirmPassword ? 'text-red-500' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full pl-12 pr-12 py-3.5 bg-white border transition-all duration-200 rounded-xl outline-none text-slate-900 placeholder-slate-400 focus:bg-white ${
                          touched.confirmPassword && errors.confirmPassword 
                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
                            : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300'
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors bg-transparent border-none outline-none focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {touched.confirmPassword && errors.confirmPassword && (
                      <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1.5 ml-1 animate-slide-down">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}

                {/* Forgot Password Link */}
                {isLogin && (
                  <div className="flex justify-between items-center px-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-colors cursor-pointer" />
                      <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors select-none">Remember me</span>
                    </label>
                    <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-6"
                >
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      isLogin ? 'Sign In' : 'Create Account'
                    )}
                  </span>
                </button>
              </form>

              {/* Providers separator */}
              <div className="mt-8 flex items-center before:flex-1 before:border-t before:border-slate-200 after:flex-1 after:border-t after:border-slate-200">
                <p className="px-4 text-xs tracking-widest text-slate-400 uppercase font-bold">Or continue with</p>
              </div>

              {/* Social Login */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all duration-200 shadow-sm hover:shadow group">
                  <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="text-sm font-semibold text-slate-700">Google</span>
                </button>
                <button className="flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all duration-200 shadow-sm hover:shadow group">
                  <svg className="w-5 h-5 text-slate-900 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-semibold text-slate-700">GitHub</span>
                </button>
              </div>

            </div>
          </div>
          
          {/* Footer limits info */}
          <p className="text-center text-sm text-slate-500 mt-8 max-w-sm mx-auto leading-relaxed">
            By continuing, you agree to our <a href="#" className="font-semibold text-slate-700 hover:text-blue-600 transition-colors">Terms of Service</a> and <a href="#" className="font-semibold text-slate-700 hover:text-blue-600 transition-colors">Privacy Policy</a>.
          </p>
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
