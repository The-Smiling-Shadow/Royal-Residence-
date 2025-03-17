import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Crown, Calendar, Shield, Award, Phone } from 'lucide-react';

export function Home() {
  return (
    <div className="space-y-20 bg-pattern">
      {/* Hero Section */}
      <div 
        className="relative min-h-[700px] bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl space-y-8">
              <div className="space-y-4">
                <h1 className="font-display text-7xl font-bold text-white leading-tight">
                  Experience <span className="text-amber-400">Royal</span> Hospitality
                </h1>
                <div className="w-24 h-1 bg-amber-400"></div>
              </div>
              <p className="text-2xl text-stone-200 font-light">
                Discover the finest accommodations across the nation, curated and managed by the National Hotel Authority
              </p>
              
              <div className="bg-white/95 backdrop-blur-sm p-8 space-y-6 border-l-4 border-amber-800">
                <h2 className="text-xl font-semibold text-stone-800 uppercase tracking-wider">Find Your Accommodation</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700 uppercase tracking-wider">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-800" />
                      <input
                        type="text"
                        placeholder="Select Destination"
                        className="input-primary pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700 uppercase tracking-wider">Check-in Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-800" />
                      <input
                        type="date"
                        className="input-primary pl-10"
                      />
                    </div>
                  </div>
                </div>
                <button className="btn-primary w-full">
                  Search Available Properties
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <div className="container mx-auto px-4">
        <div className="text-center space-y-8 mb-16">
          <h2 className="heading-decoration font-display text-4xl font-bold">Distinguished Properties</h2>
          <p className="text-stone-600 max-w-2xl mx-auto text-lg">
            Explore our collection of nationally recognized establishments, each offering unparalleled service and accommodation
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "The Presidential Suite",
              image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              location: "Capital City",
              description: "Official state guest house with diplomatic quarters"
            },
            {
              name: "Heritage Palace Hotel",
              image: "https://images.unsplash.com/photo-1590073844006-33379778ae09?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              location: "Historic District",
              description: "19th century architectural marvel with modern amenities"
            },
            {
              name: "National Grand Hotel",
              image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              location: "Metropolitan Center",
              description: "Landmark hotel representing modern excellence"
            }
          ].map((property, i) => (
            <div key={i} className="card group">
              <div className="relative overflow-hidden">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-72 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Crown className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <div className="p-8 space-y-4">
                <div>
                  <h3 className="text-2xl font-display font-bold">{property.name}</h3>
                  <div className="flex items-center text-stone-600 mt-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm uppercase tracking-wider">{property.location}</span>
                  </div>
                </div>
                <p className="text-stone-600">{property.description}</p>
                <Link
                  to="/hotels"
                  className="btn-secondary block text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-stone-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 mb-16">
            <h2 className="heading-decoration font-display text-4xl font-bold">National Standards</h2>
            <p className="text-stone-600 max-w-2xl mx-auto text-lg">
              Our properties maintain the highest standards of service and quality
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <Shield className="w-12 h-12 text-amber-800" />,
                title: 'Official Certification',
                description: 'All properties are certified and regularly inspected by national authorities'
              },
              {
                icon: <Award className="w-12 h-12 text-amber-800" />,
                title: 'Excellence Standard',
                description: 'Maintaining the highest levels of service and accommodation quality'
              },
              {
                icon: <Phone className="w-12 h-12 text-amber-800" />,
                title: 'Dedicated Support',
                description: 'Direct access to our national hospitality support network'
              }
            ].map((feature, i) => (
              <div key={i} className="text-center group bg-white p-8 border-t-4 border-amber-800">
                <div className="inline-block p-4 rounded-full bg-stone-50 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 uppercase tracking-wider">{feature.title}</h3>
                <p className="text-stone-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Official Notice Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-stone-900 p-12">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <Crown className="w-16 h-16 text-amber-400 mx-auto" />
            <h2 className="text-3xl font-display font-bold text-white">
              Official Government Accommodation Portal
            </h2>
            <p className="text-stone-300 text-lg">
              This is the official platform for booking government-approved accommodations. 
              All properties listed here are verified and maintained to national standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/about" className="btn-primary">
                Learn More
              </Link>
              <Link to="/contact" className="btn-secondary text-white hover:text-stone-900">
                Contact Authority
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}