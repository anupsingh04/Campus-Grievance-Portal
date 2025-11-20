import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from './ui/Button';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  const isActive = (path) => {
    return location.pathname === path ? "text-violet-600 bg-violet-50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50";
  };

  const linkClass = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                CP
              </div>
              <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                Campus Portal
              </Link>
            </div>
            <div className="hidden sm:flex sm:space-x-2">
              {user.role === 'student' && (
                <>
                  <Link to="/student" className={`${linkClass} ${isActive('/student')}`}>
                    Dashboard
                  </Link>
                  <Link to="/raise-grievance" className={`${linkClass} ${isActive('/raise-grievance')}`}>
                    Raise Grievance
                  </Link>
                </>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className={`${linkClass} ${isActive('/admin')}`}>
                  Admin Dashboard
                </Link>
              )}
              {user.role === 'superadmin' && (
                <Link to="/super-admin" className={`${linkClass} ${isActive('/super-admin')}`}>
                  Super Admin
                </Link>
              )}
              <Link to="/forum" className={`${linkClass} ${isActive('/forum')}`}>
                Forum
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <div className="text-sm font-medium text-slate-900">{user.name}</div>
              <div className="text-xs text-slate-500">{user.collegeName || 'Campus Portal'}</div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="text-sm">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
