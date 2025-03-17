import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Hotel = Database['public']['Tables']['hotels']['Row'];
type Room = Database['public']['Tables']['rooms']['Row'];
type Booking = Database['public']['Tables']['bookings']['Row'];

export function AdminDashboard() {
  const { user } = useAuth();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAdminData();
    }
  }, [user]);

  async function fetchAdminData() {
    try {
      const [hotelsData, roomsData, bookingsData] = await Promise.all([
        supabase
          .from('hotels')
          .select('*')
          .eq('admin_id', user?.id),
        supabase
          .from('rooms')
          .select('*')
          .eq('hotel_id', hotels[0]?.id),
        supabase
          .from('bookings')
          .select('*')
          .eq('room_id', rooms[0]?.id)
      ]);

      if (hotelsData.error) throw hotelsData.error;
      if (roomsData.error) throw roomsData.error;
      if (bookingsData.error) throw bookingsData.error;

      setHotels(hotelsData.data || []);
      setRooms(roomsData.data || []);
      setBookings(bookingsData.data || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p>Please sign in to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Hotels</h3>
          <p className="text-3xl font-bold text-blue-600">{hotels.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Rooms</h3>
          <p className="text-3xl font-bold text-blue-600">{rooms.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Active Bookings</h3>
          <p className="text-3xl font-bold text-blue-600">
            {bookings.filter(b => b.status === 'active').length}
          </p>
        </div>
      </div>

      {/* Hotels Management */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Your Hotels</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add New Hotel
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4">Name</th>
                <th className="text-left py-4">Location</th>
                <th className="text-left py-4">Rating</th>
                <th className="text-left py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
                <tr key={hotel.id} className="border-b">
                  <td className="py-4">{hotel.name}</td>
                  <td className="py-4">{hotel.location}</td>
                  <td className="py-4">{hotel.rating}</td>
                  <td className="py-4">
                    <button className="text-blue-600 hover:text-blue-800 mr-4">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4">Booking ID</th>
                <th className="text-left py-4">Check-in</th>
                <th className="text-left py-4">Check-out</th>
                <th className="text-left py-4">Status</th>
                <th className="text-left py-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((booking) => (
                <tr key={booking.id} className="border-b">
                  <td className="py-4">{booking.id.slice(0, 8)}</td>
                  <td className="py-4">{new Date(booking.check_in_date).toLocaleDateString()}</td>
                  <td className="py-4">{new Date(booking.check_out_date).toLocaleDateString()}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      booking.status === 'active' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4">${booking.total_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}