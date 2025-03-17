import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, addDays, differenceInDays } from 'date-fns';
import { Calendar, Users, CreditCard, BedDouble, Clock, MapPin, Wifi, Coffee, Tv, Wind } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../types/supabase';

type Room = Database['public']['Tables']['rooms']['Row'];
type RoomType = Database['public']['Tables']['room_types']['Row'];

export function Booking() {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [roomType, setRoomType] = useState<RoomType | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const [bookingDetails, setBookingDetails] = useState({
    checkIn: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    checkOut: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    guests: 2,
    specialRequests: '',
    paymentMethod: 'card',
  });

  useEffect(() => {
    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId]);

  async function fetchRoomDetails() {
    try {
      const [roomData, roomTypeData] = await Promise.all([
        supabase.from('rooms').select('*').eq('id', roomId).single(),
        supabase.from('room_types').select('*').eq('id', room?.room_type_id).single()
      ]);

      if (roomData.error) throw roomData.error;
      if (roomTypeData.error) throw roomTypeData.error;

      setRoom(roomData.data);
      setRoomType(roomTypeData.data);
    } catch (error) {
      console.error('Error fetching room details:', error);
      setError('Failed to load room details');
    } finally {
      setLoading(false);
    }
  }

  const calculateTotalPrice = () => {
    if (!room) return 0;
    const nights = differenceInDays(
      new Date(bookingDetails.checkOut),
      new Date(bookingDetails.checkIn)
    );
    return room.price_per_night * nights;
  };

  const handleBooking = async () => {
    if (!user || !room) return;

    try {
      setLoading(true);
      const totalPrice = calculateTotalPrice();

      const { error: bookingError } = await supabase.from('bookings').insert({
        user_id: user.id,
        room_id: room.id,
        check_in_date: bookingDetails.checkIn,
        check_out_date: bookingDetails.checkOut,
        total_price: totalPrice,
        guest_count: bookingDetails.guests,
        special_requests: bookingDetails.specialRequests,
        status: 'pending',
        payment_status: 'pending'
      });

      if (bookingError) throw bookingError;

      navigate('/booking-confirmation');
    } catch (error) {
      console.error('Error creating booking:', error);
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  if (!room || !roomType) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4">
          <div className="text-red-600">Room not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {['Room Details', 'Guest Information', 'Payment'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${index + 1 === bookingStep ? 'bg-cyan-600 text-white' : 
                      index + 1 < bookingStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}
                  `}>
                    {index + 1 < bookingStep ? '✓' : index + 1}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-600">{step}</span>
                  {index < 2 && (
                    <div className="w-24 h-1 mx-4 bg-gray-200">
                      <div className={`h-full ${index + 1 < bookingStep ? 'bg-green-500' : 'bg-gray-200'}`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Room Preview */}
            <div className="relative h-64">
              <img
                src={room.image_url || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'}
                alt={room.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <h1 className="text-2xl font-bold text-white">{room.name}</h1>
                <div className="flex items-center text-white/90 mt-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">Room {room.room_number}</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {bookingStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="date"
                          value={bookingDetails.checkIn}
                          onChange={(e) => setBookingDetails({ ...bookingDetails, checkIn: e.target.value })}
                          min={format(new Date(), 'yyyy-MM-dd')}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="date"
                          value={bookingDetails.checkOut}
                          onChange={(e) => setBookingDetails({ ...bookingDetails, checkOut: e.target.value })}
                          min={bookingDetails.checkIn}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        value={bookingDetails.guests}
                        onChange={(e) => setBookingDetails({ ...bookingDetails, guests: parseInt(e.target.value) })}
                        min="1"
                        max={room.capacity}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: <BedDouble className="w-5 h-5" />, label: `${room.capacity} Guests` },
                      { icon: <Wifi className="w-5 h-5" />, label: 'Free WiFi' },
                      { icon: <Coffee className="w-5 h-5" />, label: 'Breakfast' },
                      { icon: <Wind className="w-5 h-5" />, label: 'AC' },
                    ].map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-2 text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {amenity.icon}
                        <span className="text-sm">{amenity.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {bookingStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                    <textarea
                      value={bookingDetails.specialRequests}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, specialRequests: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Any special requests or preferences..."
                    />
                  </div>
                </div>
              )}

              {bookingStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <div className="space-y-3">
                      {['card', 'upi', 'netbanking'].map((method) => (
                        <label key={method} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method}
                            checked={bookingDetails.paymentMethod === method}
                            onChange={(e) => setBookingDetails({ ...bookingDetails, paymentMethod: e.target.value })}
                            className="h-4 w-4 text-cyan-600 focus:ring-cyan-500"
                          />
                          <div className="ml-3">
                            <span className="block text-sm font-medium text-gray-900">
                              {method === 'card' ? 'Credit/Debit Card' : 
                               method === 'upi' ? 'UPI Payment' : 'Net Banking'}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Room Rate</span>
                      <span>₹{room.price_per_night}/night</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Number of Nights</span>
                      <span>{differenceInDays(
                        new Date(bookingDetails.checkOut),
                        new Date(bookingDetails.checkIn)
                      )}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>₹{calculateTotalPrice()}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-between">
                {bookingStep > 1 && (
                  <button
                    onClick={() => setBookingStep(bookingStep - 1)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={() => {
                    if (bookingStep < 3) {
                      setBookingStep(bookingStep + 1);
                    } else {
                      handleBooking();
                    }
                  }}
                  disabled={loading}
                  className="ml-auto px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 
                   bookingStep < 3 ? 'Continue' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}