import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

const SuperAdminDashboard = () => {
  const [colleges, setColleges] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    domain: '',
    address: ''
  });

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/colleges`);
      setColleges(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/colleges`, formData);
      setShowForm(false);
      setFormData({ name: '', slug: '', domain: '', address: '' });
      fetchColleges();
    } catch (err) {
      console.error(err);
      alert('Error creating college: ' + (err.response?.data?.message || 'Server Error'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Super Admin Dashboard</h1>
          <p className="text-slate-500">Manage colleges and subscriptions</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add New College'}
        </Button>
      </div>

      {showForm && (
        <Card className="max-w-2xl mx-auto border-violet-200 shadow-violet-100">
          <h2 className="text-xl font-bold mb-4">Register New College</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="College Name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Harvard University"
            />
            <Input
              label="Slug (Subdomain)"
              id="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              placeholder="e.g., harvard (for harvard.edu)"
            />
            <Input
              label="Domain"
              id="domain"
              value={formData.domain}
              onChange={handleChange}
              required
              placeholder="e.g., harvard.edu"
            />
            <Input
              label="Address"
              id="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="City, State"
            />
            <div className="flex justify-end">
              <Button type="submit">Create College</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {colleges.map((college) => (
          <Card key={college._id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-xl">
                {college.name.charAt(0)}
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                Active
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{college.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{college.address}</p>
            <div className="pt-4 border-t border-slate-100 space-y-1">
              <p className="text-xs font-mono text-slate-400">Slug: {college.slug}</p>
              <p className="text-xs font-mono text-slate-400">Domain: {college.domain}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
