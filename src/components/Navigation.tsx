import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from './Logo';

export function Navigation() {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-brand-navy border-b-2 border-brand-gold fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-24">
          <Link to="/" className="flex items-center space-x-3">
            <Logo className="text-brand-gold" />
            <div>
              <span className="font-display text-2xl font-bold block text-white">Royal Residences</span>
              <span className="text-sm text-brand-gold uppercase tracking-wider">National Hotel Authority</span>
            </div>
          </Link>
          
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/hotels" className="text-white hover:text-brand-gold transition-colors uppercase tracking-wider text-sm">
              Our Properties
            </Link>
            <Link to="/about" className="text-white hover:text-brand-gold transition-colors uppercase tracking-wider text-sm">
              About
            </Link>
            <Link to="/contact" className="text-white hover:text-brand-gold transition-colors uppercase tracking-wider text-sm">
              Contact
            </Link>
            {user ? (
              <div className="flex items-center space-x-6">
                <Link to="/admin" className="text-white hover:text-brand-gold transition-colors uppercase tracking-wider text-sm">
                  Administration
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-transparent border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white px-6 py-2 rounded-lg transition-colors flex items-center"
                >
                  <UserCircle className="h-5 w-5 mr-2" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-brand-gold text-brand-navy hover:bg-brand-gold/90 px-6 py-2 rounded-lg transition-colors flex items-center"
              >
                <UserCircle className="h-5 w-5 mr-2" />
                Sign In
              </Link>
            )}
          </div>
        </div>

        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} pb-6`}>
          <div className="flex flex-col space-y-4">
            <Link 
              to="/hotels" 
              className="text-white hover:text-brand-gold transition-colors py-2 uppercase tracking-wider text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Our Properties
            </Link>
            <Link 
              to="/about" 
              className="text-white hover:text-brand-gold transition-colors py-2 uppercase tracking-wider text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-white hover:text-brand-gold transition-colors py-2 uppercase tracking-wider text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {user ? (
              <>
                <Link 
                  to="/admin" 
                  className="text-white hover:text-brand-gold transition-colors py-2 uppercase tracking-wider text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Administration
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="bg-transparent border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center w-full"
                >
                  <UserCircle className="h-5 w-5 mr-2" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-brand-gold text-brand-navy hover:bg-brand-gold/90 px-6 py-2 rounded-lg transition-colors flex items-center justify-center w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserCircle className="h-5 w-5 mr-2" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}