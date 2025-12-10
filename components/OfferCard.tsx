import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, ArrowRight, Heart } from 'lucide-react';
import { Offer } from '../types';
import { isFavorite, toggleFavorite } from '../services/storageService';

interface OfferCardProps {
  offer: Offer;
  onFavoriteToggle?: () => void;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer, onFavoriteToggle }) => {
  const [isFav, setIsFav] = useState(isFavorite(offer.id));

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleFavorite(offer.id);
    setIsFav(newState);
    if (onFavoriteToggle) {
      onFavoriteToggle();
    }
  };

  return (
    <div className="group bg-white rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 border border-gray-100/50 overflow-hidden flex flex-col h-full transform hover:-translate-y-1.5 relative">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={offer.imageUrl} 
          alt={offer.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
        
        {/* Price Tag */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md text-slate-900 px-4 py-2 rounded-xl text-base font-extrabold shadow-sm border border-white/20">
          {offer.price} € <span className="text-xs font-normal text-slate-500">/ pers</span>
        </div>
        
        {/* Favorite Button */}
        <button 
          onClick={handleFavoriteClick}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 shadow-sm ${
            isFav 
              ? 'bg-red-500 border-red-500 text-white' 
              : 'bg-white/30 border-white/40 text-white hover:bg-white hover:text-red-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Special Badge */}
        {offer.isSpecial && (
          <div className="absolute top-4 left-4">
            <span className="relative flex h-3 w-3 absolute top-0 right-0 -mr-1 -mt-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg border border-red-400/50">
                Promo
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full uppercase tracking-wide">
            {offer.category}
          </span>
          <div className="flex items-center text-slate-400 text-xs font-medium bg-slate-50 px-2 py-1 rounded-lg">
            <Clock className="w-3 h-3 mr-1.5" />
            {offer.duration} jours
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
          {offer.title}
        </h3>
        
        <div className="flex items-center text-slate-500 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1 text-blue-500 fill-blue-500/20" />
          <span className="font-medium">{offer.destination}</span>
        </div>
        
        <p className="text-slate-600 text-sm mb-6 line-clamp-2 flex-1 leading-relaxed opacity-90">
          {offer.description}
        </p>
        
        <div className="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center text-slate-400 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            {new Date(offer.startDate).toLocaleDateString()}
          </div>
          
          <Link 
            to={`/offer/${offer.id}`} 
            className="flex items-center px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-blue-500/30"
          >
            Détails
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;