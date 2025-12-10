import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter, X, SlidersHorizontal } from 'lucide-react';
import OfferCard from '../components/OfferCard';
import { Offer, SearchFilters } from '../types';
import { getOffers } from '../services/storageService';
import { CATEGORIES } from '../constants';

const Search: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    destination: '',
    minPrice: 0,
    maxPrice: 5000,
    category: '',
    date: ''
  });

  useEffect(() => {
    const allOffers = getOffers();
    setOffers(allOffers);
    setFilteredOffers(allOffers);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let result = offers;

    if (filters.destination) {
      result = result.filter(o => 
        o.destination.toLowerCase().includes(filters.destination.toLowerCase()) ||
        o.title.toLowerCase().includes(filters.destination.toLowerCase())
      );
    }

    if (filters.category) {
      result = result.filter(o => o.category === filters.category);
    }

    if (filters.minPrice > 0) {
      result = result.filter(o => o.price >= filters.minPrice);
    }

    if (filters.maxPrice < 5000) {
      result = result.filter(o => o.price <= filters.maxPrice);
    }

    if (filters.date) {
        result = result.filter(o => o.startDate >= filters.date!);
    }

    result.sort((a, b) => a.price - b.price);

    setFilteredOffers(result);
  }, [filters, offers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: name.includes('Price') ? Number(value) : value
    }));
  };

  const clearFilters = () => {
    setFilters({
      destination: '',
      minPrice: 0,
      maxPrice: 5000,
      category: '',
      date: ''
    });
  };

  return (
    <div className="pt-24 pb-12 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
                <h1 className="text-4xl font-bold text-gray-900">Nos Voyages</h1>
                <p className="text-gray-500 mt-2">Trouvez l'escapade parfaite parmi notre sélection.</p>
            </div>
            <div className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                {filteredOffers.length} résultat{filteredOffers.length > 1 ? 's' : ''}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-lg font-bold flex items-center text-gray-900">
                  <SlidersHorizontal className="w-5 h-5 mr-2 text-blue-600" />
                  Filtres
                </h2>
                {(filters.destination || filters.category || filters.date || filters.maxPrice < 5000) && (
                    <button 
                    onClick={clearFilters}
                    className="text-xs font-medium text-red-500 hover:text-red-700 flex items-center bg-red-50 px-2 py-1 rounded-full transition-colors"
                    >
                    <X className="w-3 h-3 mr-1" />
                    Effacer
                    </button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Destination</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="destination"
                      value={filters.destination}
                      onChange={handleInputChange}
                      placeholder="Pays, Ville..."
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                    />
                    <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Catégorie</label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleInputChange}
                    className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                  >
                    <option value="">Toutes catégories</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Date départ (après)</label>
                  <input
                    type="date"
                    name="date"
                    value={filters.date}
                    onChange={handleInputChange}
                    className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Budget Max</label>
                    <span className="text-sm font-bold text-blue-600">{filters.maxPrice} €</span>
                  </div>
                  <input
                    type="range"
                    name="maxPrice"
                    min="100"
                    max="5000"
                    step="100"
                    value={filters.maxPrice}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>100€</span>
                    <span>5000€+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-3">
            {filteredOffers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                {filteredOffers.map(offer => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Aucun résultat</h3>
                <p className="text-gray-500 mt-1 mb-6 max-w-xs">Aucune offre ne correspond à vos critères actuels. Essayez de modifier vos filtres.</p>
                <button 
                    onClick={clearFilters} 
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;