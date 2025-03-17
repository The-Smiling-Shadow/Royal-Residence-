import React from 'react';
import { Crown, Award, Shield, Users, Globe, Sparkles } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div 
        className="relative h-[400px] bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-cyan-900/70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-3xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">About Royal Residences</h1>
            <p className="text-lg text-cyan-50">
              The National Hotel Authority's premier collection of luxury accommodations,
              setting the standard for hospitality excellence across India
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            To establish and maintain world-class hospitality standards across India while preserving
            our rich cultural heritage. We strive to provide unparalleled luxury experiences that
            blend traditional Indian hospitality with modern amenities and service excellence.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Crown className="w-8 h-8 text-cyan-600" />,
                title: "Excellence",
                description: "Setting the highest standards in luxury hospitality and service quality"
              },
              {
                icon: <Shield className="w-8 h-8 text-cyan-600" />,
                title: "Integrity",
                description: "Maintaining transparency and ethical practices in all our operations"
              },
              {
                icon: <Users className="w-8 h-8 text-cyan-600" />,
                title: "Guest-Centric",
                description: "Putting our guests' comfort and satisfaction at the heart of everything we do"
              }
            ].map((value, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-gray-50">
                <div className="inline-block p-3 bg-cyan-50 rounded-full mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History Timeline */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-display font-bold text-center mb-12">Our Journey</h2>
        <div className="max-w-4xl mx-auto">
          {[
            {
              year: "1950",
              title: "Establishment",
              description: "Formation of the National Hotel Authority to oversee India's hospitality sector"
            },
            {
              year: "1975",
              title: "Expansion",
              description: "Launch of the first Royal Residences property in New Delhi"
            },
            {
              year: "2000",
              title: "Modernization",
              description: "Implementation of international hospitality standards across all properties"
            },
            {
              year: "2025",
              title: "Digital Innovation",
              description: "Introduction of smart hotel technology and sustainable practices"
            }
          ].map((event, index) => (
            <div key={index} className="flex mb-8 last:mb-0">
              <div className="flex-shrink-0 w-24 pt-1">
                <span className="text-lg font-bold text-cyan-600">{event.year}</span>
              </div>
              <div className="flex-grow pl-8 border-l-2 border-cyan-200">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-600">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-cyan-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <Globe className="w-8 h-8" />, number: "25+", label: "Cities" },
              { icon: <Crown className="w-8 h-8" />, number: "50+", label: "Properties" },
              { icon: <Award className="w-8 h-8" />, number: "100+", label: "Awards" },
              { icon: <Sparkles className="w-8 h-8" />, number: "1M+", label: "Happy Guests" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-block mb-4">{stat.icon}</div>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-cyan-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-display font-bold text-center mb-12">Our Leadership</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Rajesh Kumar",
              position: "Chairman",
              image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
            },
            {
              name: "Priya Sharma",
              position: "Managing Director",
              image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
            },
            {
              name: "Arun Patel",
              position: "Operations Director",
              image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
            }
          ].map((leader, index) => (
            <div key={index} className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-4">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">{leader.name}</h3>
              <p className="text-gray-600">{leader.position}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}