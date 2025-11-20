import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useCollege } from '../context/CollegeContext';

const Signup = () => {
  const navigate = useNavigate();
  const { college } = useCollege(); // Get context
  const [colleges, setColleges] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    collegeId: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/colleges`);
        setColleges(res.data);
        
        // If we are on a subdomain (college exists in context), use it.
        if (college) {
          setFormData(prev => ({ ...prev, collegeId: college._id }));
        } else if (res.data.length > 0) {
          // Default to first if not on subdomain
          setFormData(prev => ({ ...prev, collegeId: res.data[0]._id }));
        }
      } catch (err) {
        console.error('Failed to fetch colleges', err);
      }
    };
    fetchColleges();
  }, [college]); // Re-run if college context changes

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
          <p className="text-slate-500">
            {college ? `Join ${college.name}` : 'Join your campus community'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
          />
          <Input
            label="Email Address"
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="john@college.edu"
          />
          <Input
            label="Password"
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
          />
          
          <div>
            <label htmlFor="collegeId" className="block text-sm font-medium text-slate-700 mb-1">Select College</label>
            <select
              id="collegeId"
              value={formData.collegeId}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-100 disabled:text-slate-500"
              required
              disabled={!!college} // Disable if on subdomain
            >
              <option value="" disabled>Select your college</option>
              {colleges.map(c => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" className="w-full mt-6">Sign Up</Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-600 hover:text-violet-700 font-medium">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
