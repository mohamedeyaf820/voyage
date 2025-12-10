import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Search, MapPin } from 'lucide-react';
import OfferCard from '../components/OfferCard';
import { Offer } from '../types';
import { getOffers } from '../services/storageService';

const Home: React.FC = () => {
  const [specialOffers, setSpecialOffers] = useState<Offer[]>([]);
  const [searchDestination, setSearchDestination] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const allOffers = getOffers();
    setSpecialOffers(allOffers.filter(o => o.isSpecial));
  }, []);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchDestination.trim()) {
        navigate('/search');
        // In a real app we would pass the query via query params
    } else {
        navigate('/search');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl px-4 text-center animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium mb-6 animate-delay-100">
            ✨ Explorez le monde sans limites
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-tight animate-delay-200">
            Votre prochaine aventure <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-300">
              commence ici
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-200 mb-10 animate-delay-300 font-light">
            Des plages paradisiaques aux sommets enneigés, VoyageVista crée des souvenirs inoubliables pour chaque voyageur.
          </p>

          {/* Quick Search Bar */}
          <form onSubmit={handleQuickSearch} className="max-w-xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/30 flex items-center shadow-2xl animate-delay-300">
             <div className="flex-1 flex items-center px-4">
                <MapPin className="text-white/70 w-5 h-5 mr-3" />
                <input 
                    type="text" 
                    placeholder="Où souhaitez-vous aller ?" 
                    className="w-full bg-transparent border-none text-white placeholder-white/70 focus:ring-0 focus:outline-none h-10"
                    value={searchDestination}
                    onChange={(e) => setSearchDestination(e.target.value)}
                />
             </div>
             <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center">
                <Search className="w-4 h-4 mr-2" />
                Rechercher
             </button>
          </form>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
                { label: 'Destinations', val: '50+' },
                { label: 'Clients Heureux', val: '10k+' },
                { label: 'Années d\'Exp.', val: '15' },
                { label: 'Partenaires', val: '200+' },
            ].map((stat, i) => (
                <div key={i}>
                    <div className="text-3xl font-bold text-blue-600 mb-1">{stat.val}</div>
                    <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
            ))}
        </div>
      </div>

      {/* Special Offers Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="bg-yellow-100 p-2 rounded-full">
                    <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
                </span>
                Coups de Cœur
              </h2>
              <p className="text-gray-500 mt-2">Nos offres les plus exclusives du moment.</p>
          </div>
          <Link 
            to="/search" 
            className="mt-4 md:mt-0 group flex items-center text-blue-600 hover:text-teal-500 font-semibold transition-colors"
          >
            Voir toutes les offres
            <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {specialOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {specialOffers.map(offer => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400">Aucune offre spéciale pour le moment.</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Prêt à partir ?</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Laissez-nous organiser le voyage de vos rêves. Contactez nos experts ou réservez directement en ligne.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/search" className="w-full sm:w-auto px-8 py-3 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-colors">
                    Explorer les offres
                </Link>
                <Link to="/contact" className="w-full sm:w-auto px-8 py-3 bg-transparent border border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-colors">
                    Nous contacter
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;