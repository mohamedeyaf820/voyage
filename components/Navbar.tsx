
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, ShieldCheck, Menu, X, Heart, LogOut, User } from 'lucide-react';
import { isAuthenticated, logout } from '../services/authService';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsAdmin(isAuthenticated());
    
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const handleLogout = () => {
    logout();
    setIsAdmin(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed w-full z-40 transition-all duration-300 ${scrolled ? 'glass shadow-sm py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2.5 group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2.5 rounded-xl text-white relative shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <Compass className="h-6 w-6" />
                </div>
              </div>
              <span className={`font-bold text-2xl tracking-tight transition-colors duration-300 ${scrolled || location.pathname !== '/' ? 'text-slate-800' : 'text-slate-800 md:text-white'}`}>
                Voyage<span className="text-blue-600 font-extrabold">Vista</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                isActive('/') 
                  ? 'bg-blue-50 text-blue-600' 
                  : (scrolled || location.pathname !== '/' ? 'text-slate-600 hover:text-blue-600 hover:bg-slate-50' : 'text-white/90 hover:text-white hover:bg-white/10')
              }`}
            >
              Accueil
            </Link>
            <Link 
              to="/search" 
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                isActive('/search') 
                  ? 'bg-blue-50 text-blue-600' 
                  : (scrolled || location.pathname !== '/' ? 'text-slate-600 hover:text-blue-600 hover:bg-slate-50' : 'text-white/90 hover:text-white hover:bg-white/10')
              }`}
            >
              Nos Voyages
            </Link>
            <Link 
              to="/contact" 
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                isActive('/contact') 
                  ? 'bg-blue-50 text-blue-600' 
                  : (scrolled || location.pathname !== '/' ? 'text-slate-600 hover:text-blue-600 hover:bg-slate-50' : 'text-white/90 hover:text-white hover:bg-white/10')
              }`}
            >
              Contact
            </Link>
            <Link 
              to="/favorites" 
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                isActive('/favorites') 
                  ? 'bg-red-50 text-red-600' 
                  : (scrolled || location.pathname !== '/' ? 'text-slate-600 hover:text-red-600 hover:bg-red-50' : 'text-white/90 hover:text-red-200 hover:bg-white/10')
              }`}
            >
              <Heart className={`w-4 h-4 ${isActive('/favorites') ? 'fill-current' : ''}`} />
              Favoris
            </Link>
            <div className="w-px h-6 bg-gray-300 mx-2 opacity-50"></div>
            
            {isAdmin ? (
               <div className="flex items-center gap-2">
                 <Link 
                  to="/admin" 
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-sm ${
                    isActive('/admin')
                    ? 'bg-slate-900 text-white' 
                    : 'bg-white text-slate-700 hover:text-blue-600 border border-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  title="Déconnexion"
                >
                  <LogOut className="w-4 h-4" />
                </button>
               </div>
            ) : (
                <Link 
                  to="/login" 
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-sm hover:shadow-md ${
                    scrolled || location.pathname !== '/' 
                    ? 'bg-slate-900 text-white hover:bg-blue-600' 
                    : 'bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white hover:text-blue-600'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Connexion
                </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors ${scrolled || location.pathname !== '/' ? 'text-slate-800 hover:bg-slate-100' : 'text-white hover:bg-white/20'}`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-xl animate-fade-in-up">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-semibold ${isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Accueil
            </Link>
            <Link 
              to="/search" 
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-semibold ${isActive('/search') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Nos Voyages
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-semibold ${isActive('/contact') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Contact
            </Link>
            <Link 
              to="/favorites" 
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-base font-semibold ${isActive('/favorites') ? 'bg-red-50 text-red-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Heart className="w-4 h-4" />
              Favoris
            </Link>
            <div className="h-px bg-gray-100 my-2"></div>
            
            {isAdmin ? (
                <>
                <Link 
                    to="/admin" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50"
                >
                    <ShieldCheck className="w-4 h-4" />
                    Administration
                </Link>
                <button 
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-base font-semibold text-red-600 hover:bg-red-50"
                >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                </button>
                </>
            ) : (
                <Link 
                    to="/login" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50"
                >
                    <User className="w-4 h-4" />
                    Espace Admin
                </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
