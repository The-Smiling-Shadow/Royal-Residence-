import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { MapPin, Users, Calendar, Wifi, Coffee, Bath, Wind, Tv, Car } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';
import { useAuth } from '../contexts/AuthContext';

type Hotel = Database['public']['Tables']['hotels']['Row'];
type Room = Database['public']['Tables']['rooms']['Row'];

export function HotelDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchHotelDetails();
    }
  }, [id]);

  async function fetchHotelDetails() {
    try {
      const [hotelData, roomsData] = await Promise.all([
        supabase.from('hotels').select('*').eq('id', id).single(),
        supabase.from('rooms').select('*').eq('hotel_id', id)
      ]);

      if (hotelData.error) throw hotelData.error;
      if (roomsData.error) throw roomsData.error;

      setHotel(hotelData.data);
      setRooms(roomsData.data || []);
    } catch (error) {
      console.error('Error fetching hotel details:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleReservation() {
    if (!user || !selectedRoom) return;

    try {
      const nights = Math.ceil(
        (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
      );
      const totalPrice = selectedRoom.price_per_night * nights;

      const { error } = await supabase.from('bookings').insert({
        user_id: user.id,
        room_id: selectedRoom.id,
        check_in_date: checkIn,
        check_out_date: checkOut,
        total_price: totalPrice,
        guest_count: guests
      });

      if (error) throw error;
      alert('Reservation successful!');
    } catch (error) {
      console.error('Error making reservation:', error);
      alert('Failed to make reservation. Please try again.');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4">
          <div className="text-red-600">Hotel not found</div>
        </div>
      </div>
    );
  }

  const amenities = [
    { icon: <Wifi className="w-5 h-5" />, name: 'Free WiFi' },
    { icon: <Coffee className="w-5 h-5" />, name: 'Restaurant' },
    { icon: <Bath className="w-5 h-5" />, name: 'Spa' },
    { icon: <Wind className="w-5 h-5" />, name: 'Air Conditioning' },
    { icon: <Tv className="w-5 h-5" />, name: 'Smart TV' },
    { icon: <Car className="w-5 h-5" />, name: 'Parking' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hotel Images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <img
                  src={hotel.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'}
                  alt={hotel.name}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
              </div>
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Room view"
                className="w-full h-48 object-cover rounded-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1590073844006-33379778ae09?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Room interior"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>

            {/* Hotel Info */}
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{hotel.name}</h1>
                  <div className="flex items-center text-gray-600 mt-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{hotel.location}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(hotel.rating || 0)].map((_, i) => (
                    <span key={i} className="text-cyan-500">★</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600">{hotel.description}</p>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2 text-gray-600">
                    {amenity.icon}
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reservation Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Make a Reservation</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      min={format(new Date(), 'yyyy-MM-dd')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      min={checkIn}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      min="1"
                      max="10"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Room</label>
                  <select
                    value={selectedRoom?.id || ''}
                    onChange={(e) => setSelectedRoom(rooms.find(r => r.id === e.target.value) || null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="">Select a room</option>
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name} - ₹{room.price_per_night}/night
                      </option>
                    ))}
                  </select>
                </div>

                {selectedRoom && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Room Rate</span>
                      <span>₹{selectedRoom.price_per_night}/night</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>₹{selectedRoom.price_per_night * (checkIn && checkOut ? 
                        Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 1)}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleReservation}
                  disabled={!user || !selectedRoom || !checkIn || !checkOut}
                  className="w-full bg-cyan-600 text-white py-3 rounded-lg font-medium hover:bg-cyan-700 
                    transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {user ? 'Reserve Now' : 'Sign in to Reserve'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}