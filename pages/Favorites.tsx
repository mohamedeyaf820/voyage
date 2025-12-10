import React, { useState, useEffect } from 'react';
import { Heart, Search } from 'lucide-react';
import OfferCard from '../components/OfferCard';
import { Offer } from '../types';
import { getOffers, getFavorites } from '../services/storageService';
import { Link } from 'react-router-dom';

const Favorites: React.FC = () => {
  const [favoriteOffers, setFavoriteOffers] = useState<Offer[]>([]);

  const loadFavorites = () => {
    const allOffers = getOffers();
    const favoriteIds = getFavorites();
    const favs = allOffers.filter(offer => favoriteIds.includes(offer.id));
    setFavoriteOffers(favs);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <div className="pt-24 pb-12 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
                <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="bg-red-50 p-2 rounded-xl text-red-500">
                    <Heart className="w-8 h-8 fill-current" />
                  </span>
                  Mes Favoris
                </h1>
                <p className="text-gray-500 mt-2 ml-1">Retrouvez ici tous vos voyages coups de cœur.</p>
            </div>
            <div className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                {favoriteOffers.length} voyage{favoriteOffers.length > 1 ? 's' : ''} enregistré{favoriteOffers.length > 1 ? 's' : ''}
            </div>
        </div>

        {favoriteOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
            {favoriteOffers.map(offer => (
              <OfferCard 
                key={offer.id} 
                offer={offer} 
                onFavoriteToggle={loadFavorites} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-gray-200 text-center animate-fade-in-up">
            <div className="bg-gray-50 p-6 rounded-full mb-6 animate-bounce-slow">
                <Heart className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Votre liste est vide</h3>
            <p className="text-gray-500 mb-8 max-w-md">
              Vous n'avez pas encore ajouté de voyages à vos favoris. Explorez nos offres et cliquez sur le cœur pour les sauvegarder.
            </p>
            <Link 
                to="/search" 
                className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 font-bold flex items-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Explorer les offres
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;