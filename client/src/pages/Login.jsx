import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

import { useCollege } from '../context/CollegeContext';

const Login = () => {
  const { college } = useCollege();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('user', JSON.stringify(res.data));
      
      if (res.data.role === 'student') navigate('/student');
      else if (res.data.role === 'admin') navigate('/admin');
      else if (res.data.role === 'superadmin') navigate('/super-admin');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex overflow-hidden">
        {/* Left Side - Decorative */}
        <div className="md:w-1/2 bg-gradient-to-br from-violet-600 to-indigo-700 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
            <h1 className="text-4xl font-bold mb-4">{college ? college.name : 'Campus Portal'}</h1>
            <p className="text-indigo-100 text-lg">
              {college 
                ? `Welcome to the official portal of ${college.name}.` 
                : 'Streamline your campus experience. Raise queries, track grievances, and stay connected.'}
            </p>
          </div>
          <div className="relative z-10 text-sm text-indigo-200">
            &copy; 2025 Campus Portal
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Welcome Back!</h2>
            <p className="text-slate-500">Please sign in to continue.</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@campus.edu"
              required
            />
            <Input
              label="Password"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">Remember me</label>
              </div>
              <a href="#" className="text-sm font-medium text-violet-600 hover:text-violet-500">Forgot password?</a>
            </div>

            <Button type="submit" className="w-full py-3 text-lg shadow-xl shadow-violet-200">Sign In</Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-violet-600 hover:text-violet-700 font-medium">
              Create one
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-center text-slate-400 uppercase tracking-wider mb-4">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg text-center">
                <p className="text-xs font-bold text-slate-700">Student</p>
                <p className="text-xs text-slate-500">student@campus.edu</p>
                <p className="text-xs text-slate-500">password</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg text-center">
                <p className="text-xs font-bold text-slate-700">Admin</p>
                <p className="text-xs text-slate-500">admin@campus.edu</p>
                <p className="text-xs text-slate-500">admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
