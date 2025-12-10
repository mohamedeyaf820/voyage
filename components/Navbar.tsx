import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, ShieldCheck, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="bg-gradient-to-tr from-blue-600 to-teal-400 p-2 rounded-lg text-white group-hover:shadow-lg transition-all duration-300">
                <Compass className="h-6 w-6" />
              </div>
              <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-teal-500">
                VoyageVista
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-semibold transition-colors duration-200 ${isActive('/') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            >
              Accueil
            </Link>
            <Link 
              to="/search" 
              className={`text-sm font-semibold transition-colors duration-200 ${isActive('/search') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            >
              Nos Voyages
            </Link>
            <Link 
              to="/admin" 
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isAdmin 
                ? 'bg-gray-900 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Espace Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-gray-100 animate-fade-in-up">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Accueil
            </Link>
            <Link 
              to="/search" 
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/search') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Nos Voyages
            </Link>
            <Link 
              to="/admin" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
            >
              Administration
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;