import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Hotel, 
  Calendar, 
  LogOut, 
  LayoutDashboard 
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        <nav className="mt-6">
          <Link
            to="/admin"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link
            to="/admin/bookings"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <Calendar className="w-5 h-5 mr-3" />
            Bookings
          </Link>
          <Link
            to="/admin/users"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <Users className="w-5 h-5 mr-3" />
            Users
          </Link>
          <Link
            to="/admin/hotels"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <Hotel className="w-5 h-5 mr-3" />
            Hotels
          </Link>
        </nav>
        <div className="absolute bottom-0 w-64 p-6">
          <button
            onClick={handleLogout}
            className="flex items-center text-red-600 hover:text-red-800"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}