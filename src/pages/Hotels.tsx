import React, { useState, useEffect } from 'react';
import { MapPin, Star, Search, Filter, Calendar, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Hotel = Database['public']['Tables']['hotels']['Row'];

const FEATURED_HOTELS = [
  {
    id: '1',
    name: 'Taj Lake Palace',
    location: 'Udaipur, Rajasthan',
    description: 'A floating marvel on Lake Pichola, this 18th-century palace offers royal Rajasthani luxury.',
    image_url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    rating: 5,
    price_per_night: 35000,
    amenities: ['Spa', 'Pool', 'Fine Dining', 'Lake View']
  },
  {
    id: '2',
    name: 'The Oberoi Amarvilas',
    location: 'Agra, Uttar Pradesh',
    description: 'Every room offers a breathtaking view of the Taj Mahal, just 600 meters away.',
    image_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    rating: 5,
    price_per_night: 45000,
    amenities: ['Taj View', 'Spa', 'Pool', 'Butler Service']
  },
  {
    id: '3',
    name: 'The Leela Palace',
    location: 'New Delhi',
    description: 'A modern palace in the diplomatic enclave of New Delhi.',
    image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    rating: 5,
    price_per_night: 30000,
    amenities: ['Rooftop Pool', 'Spa', 'Fine Dining', 'Butler Service']
  }
];

export function Hotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDates, setSelectedDates] = useState({ checkIn: '', checkOut: '' });
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    fetchHotels();
  }, []);

  async function fetchHotels() {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;
      setHotels(data || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredHotels = FEATURED_HOTELS.filter(hotel =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div 
        className="relative h-[500px] bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-6">
            <h1 className="text-6xl font-display font-bold">Discover Luxury in India</h1>
            <p className="text-xl font-light">Experience the finest hospitality across the nation</p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 -mt-24 mb-16 relative z-10">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Where are you going?"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Check In</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={selectedDates.checkIn}
                  onChange={(e) => setSelectedDates({ ...selectedDates, checkIn: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Check Out</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={selectedDates.checkOut}
                  onChange={(e) => setSelectedDates({ ...selectedDates, checkOut: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Guests</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  min="1"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-display font-bold mb-8">Featured Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredHotels.map((hotel) => (
            <div key={hotel.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={hotel.image_url}
                  alt={hotel.name}
                  className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <span className="text-sm font-medium">{hotel.rating}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold">{hotel.name}</h3>
                  <p className="text-amber-600 font-medium">₹{hotel.price_per_night.toLocaleString('en-IN')}/night</p>
                </div>
                <div className="flex items-center text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{hotel.location}</span>
                </div>
                <p className="text-gray-600 line-clamp-2">{hotel.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {hotel.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}