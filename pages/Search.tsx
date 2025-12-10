import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Filter, X, SlidersHorizontal, MapPin, Calendar, SortAsc, SortDesc, ChevronDown, Sparkles, Loader2 } from 'lucide-react';
import OfferCard from '../components/OfferCard';
import { Offer, SearchFilters } from '../types';
import { getOffers } from '../services/storageService';
import { CATEGORIES } from '../constants';
import { parseSmartSearch } from '../services/geminiService';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // AI Magic Search State
  const [magicQuery, setMagicQuery] = useState('');
  const [isMagicLoading, setIsMagicLoading] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    destination: searchParams.get('destination') || '',
    minPrice: 0,
    maxPrice: 5000,
    category: '',
    date: '',
    sortBy: 'price-asc'
  });

  useEffect(() => {
    const allOffers = getOffers();
    setOffers(allOffers);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    window.scrollTo(0, 0);
    return () => clearTimeout(timer);
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

    // Sort
    if (filters.sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'date-asc') {
      result.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    }

    setFilteredOffers([...result]);
  }, [filters, offers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: name.includes('Price') ? Number(value) : value
    }));
  };

  const handleCategoryClick = (cat: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === cat ? '' : cat
    }));
  };

  const clearFilters = () => {
    setFilters({
      destination: '',
      minPrice: 0,
      maxPrice: 5000,
      category: '',
      date: '',
      sortBy: 'price-asc'
    });
    setMagicQuery('');
  };

  const handleMagicSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!magicQuery.trim()) return;

    setIsMagicLoading(true);
    const extractedFilters = await parseSmartSearch(magicQuery);
    setIsMagicLoading(false);

    if (extractedFilters) {
        setFilters(prev => ({
            ...prev,
            destination: extractedFilters.destination || prev.destination,
            maxPrice: extractedFilters.maxPrice || 5000,
            category: extractedFilters.category || prev.category
        }));
    }
  };

  const SidebarContent = () => (
    <div className="space-y-8">
      {/* Category Pills */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Catégories</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                filters.category === cat 
                ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20' 
                : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Destination Search */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Destination</label>
        <div className="relative group">
          <input
            type="text"
            name="destination"
            value={filters.destination}
            onChange={handleInputChange}
            placeholder="Où voulez-vous aller ?"
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none text-sm transition-all"
          />
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 group-focus-within:text-blue-500 transition-colors" />
        </div>
      </div>

      {/* Date Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Partir après le</label>
        <div className="relative">
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none text-sm transition-all"
          />
          <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Budget Max</label>
          <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">{filters.maxPrice} €</span>
        </div>
        <input
          type="range"
          name="maxPrice"
          min="100"
          max="5000"
          step="100"
          value={filters.maxPrice}
          onChange={handleInputChange}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 px-1">
          <span>100€</span>
          <span>5000€+</span>
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Trier par</label>
        <div className="relative">
            <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none text-sm transition-all appearance-none"
            >
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="date-asc">Date la plus proche</option>
            </select>
            <SortAsc className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Magic Search Bar */}
        <div className="mb-12 animate-fade-in-up">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full mix-blend-overlay filter blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                            <Sparkles className="w-5 h-5 text-yellow-300" />
                        </div>
                        <h2 className="text-2xl font-bold">Assistant de Recherche IA</h2>
                    </div>
                    <p className="text-blue-100 mb-6 max-w-2xl">
                        Décrivez votre voyage idéal et laissez notre IA configurer les filtres pour vous. 
                        <br/><span className="text-sm opacity-70 italic">Ex: "Je cherche un weekend romantique en Italie pour moins de 1000 euros"</span>
                    </p>
                    
                    <form onSubmit={handleMagicSearch} className="relative max-w-3xl">
                        <input 
                            type="text" 
                            value={magicQuery}
                            onChange={(e) => setMagicQuery(e.target.value)}
                            placeholder="Décrivez votre envie..." 
                            className="w-full pl-6 pr-32 py-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm text-white placeholder-blue-200 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                        />
                        <button 
                            type="submit" 
                            disabled={isMagicLoading || !magicQuery}
                            className="absolute right-2 top-2 bottom-2 bg-white text-indigo-600 px-6 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isMagicLoading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Analyse...</>
                            ) : (
                                <><Sparkles className="w-4 h-4" /> Magie</>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>

        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div className="animate-fade-in-up" style={{animationDelay: '100ms'}}>
                <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-2 block">Exploration</span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Nos Aventures</h1>
            </div>
            
            <div className="flex items-center gap-3 animate-fade-in-up" style={{animationDelay: '150ms'}}>
                <button 
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold text-sm shadow-sm hover:bg-slate-50 transition-all"
                >
                    <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                    Filtres
                </button>
                <div className="hidden lg:flex items-center gap-2 text-sm font-bold text-slate-500 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
                    <span className="text-blue-600">{filteredOffers.length}</span> résultats trouvés
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block">
            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 sticky top-28 animate-fade-in-up" style={{animationDelay: '200ms'}}>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold flex items-center text-slate-800">
                  <Filter className="w-5 h-5 mr-2 text-blue-600" />
                  Filtres
                </h2>
                {(filters.destination || filters.category || filters.date || filters.maxPrice < 5000) && (
                    <button 
                      onClick={clearFilters}
                      className="text-[10px] font-extrabold text-red-500 hover:text-white hover:bg-red-500 border border-red-500 px-3 py-1 rounded-full transition-all flex items-center gap-1 uppercase tracking-wider"
                    >
                      <X className="w-3 h-3" />
                      Reset
                    </button>
                )}
              </div>
              <SidebarContent />
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm h-[450px] animate-pulse">
                    <div className="bg-slate-200 h-64 w-full"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                      <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredOffers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredOffers.map((offer, idx) => (
                  <div key={offer.id} className="animate-fade-in-up" style={{animationDelay: `${idx * 50}ms`}}>
                    <OfferCard offer={offer} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2rem] border border-dashed border-slate-200 text-center animate-fade-in-up">
                <div className="bg-slate-50 p-8 rounded-full mb-6 relative">
                    <Filter className="w-12 h-12 text-slate-300" />
                    <X className="w-6 h-6 text-red-400 absolute top-6 right-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Aucun voyage trouvé</h3>
                <p className="text-slate-500 mb-10 max-w-xs mx-auto">Nous n'avons pas trouvé de pépites correspondant à vos critères actuels.</p>
                <button 
                    onClick={clearFilters} 
                    className="px-10 py-4 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all font-bold text-sm shadow-xl shadow-slate-200 hover:shadow-blue-500/20"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer Overlay */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMobileFiltersOpen(false)}></div>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] p-8 max-h-[85vh] overflow-y-auto animate-fade-in-up shadow-2xl">
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-white z-10 py-2">
                <h2 className="text-2xl font-extrabold text-slate-900">Filtres</h2>
                <button 
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-3 bg-slate-100 rounded-2xl text-slate-500 hover:bg-slate-200 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
            <SidebarContent />
            <button 
              onClick={() => setIsMobileFiltersOpen(false)}
              className="w-full mt-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30"
            >
                Afficher {filteredOffers.length} voyages
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
