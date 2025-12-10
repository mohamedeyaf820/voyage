import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Offer } from '../types';

interface OfferCardProps {
  offer: Offer;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full transform hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={offer.imageUrl} 
          alt={offer.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
          {offer.price} €
        </div>
        
        {offer.isSpecial && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg animate-pulse">
            Promo
          </div>
        )}
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase tracking-wide">
            {offer.category}
          </span>
          <div className="flex items-center text-gray-400 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {offer.duration}j
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {offer.title}
        </h3>
        
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1 text-teal-500" />
          {offer.destination}
        </div>
        
        <p className="text-gray-600 text-sm mb-6 line-clamp-2 flex-1 leading-relaxed">
          {offer.description}
        </p>
        
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center text-gray-400 text-xs">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(offer.startDate).toLocaleDateString()}
          </div>
          
          <Link 
            to={`/offer/${offer.id}`} 
            className="flex items-center text-sm font-semibold text-blue-600 hover:text-teal-500 transition-colors"
          >
            Voir détails
            <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;