import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Search, MapPin, Globe, Shield, Users, Quote, CheckCircle2, Plane, CalendarCheck, CreditCard } from 'lucide-react';
import OfferCard from '../components/OfferCard';
import Newsletter from '../components/Newsletter';
import { Offer } from '../types';
import { getOffers } from '../services/storageService';

const Home: React.FC = () => {
  const [specialOffers, setSpecialOffers] = useState<Offer[]>([]);
  const [searchDestination, setSearchDestination] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const allOffers = getOffers();
    setSpecialOffers(allOffers.filter(o => o.isSpecial));
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?destination=${searchDestination}`);
  };

  return (
    <div className="min-h-screen">
      {/* Modern Hero Section with Parallax */}
      <div className="relative h-[750px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay and Parallax */}
        <div 
            className="absolute inset-0 z-0 will-change-transform"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <img 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Hero Background" 
            className="w-full h-[120%] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-5xl px-4 text-center mt-10" style={{ transform: `translateY(${scrollY * -0.1}px)` }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-50 text-sm font-medium mb-8 animate-fade-in-up shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Nouvelles destinations été 2024
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight animate-fade-in-up animate-delay-100 drop-shadow-lg">
            Évadez-vous vers <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-indigo-200 to-white">
              l'extraordinaire
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-slate-100 mb-12 animate-fade-in-up animate-delay-200 font-light leading-relaxed drop-shadow-md">
            Découvrez des horizons inexplorés et vivez des expériences uniques. 
            VoyageVista crée pour vous des souvenirs impérissables.
          </p>

          {/* Quick Search Bar */}
          <form onSubmit={handleQuickSearch} className="max-w-2xl mx-auto bg-white/10 backdrop-blur-xl p-2.5 rounded-full border border-white/20 flex flex-col sm:flex-row items-center gap-2 shadow-2xl animate-fade-in-up animate-delay-300 hover:bg-white/15 transition-colors">
             <div className="flex-1 w-full flex items-center px-6 bg-white/95 rounded-full h-14 sm:h-auto shadow-inner">
                <MapPin className="text-blue-500 w-5 h-5 mr-3 flex-shrink-0" />
                <input 
                    type="text" 
                    placeholder="Quelle est votre destination de rêve ?" 
                    className="w-full bg-transparent border-none text-slate-800 placeholder-slate-400 focus:ring-0 focus:outline-none h-12 text-lg font-medium"
                    value={searchDestination}
                    onChange={(e) => setSearchDestination(e.target.value)}
                />
             </div>
             <button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-blue-500/40 transform hover:-translate-y-0.5">
                <Search className="w-5 h-5 mr-2" />
                Explorer
             </button>
          </form>
        </div>
      </div>

      {/* Stats Section with Glass Effect - Overlapping Hero */}
      <div className="relative z-20 -mt-20 max-w-6xl mx-auto px-4 mb-20">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 backdrop-blur-sm bg-white/95">
            {[
                { label: 'Destinations', val: '50+', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Clients Heureux', val: '10k+', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Années d\'Exp.', val: '15', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' },
                { label: 'Garanties', val: '100%', icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((stat, i) => (
                <div key={i} className="text-center group hover:-translate-y-1 transition-transform duration-300">
                    <div className={`mx-auto w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                        <stat.icon className="w-7 h-7" />
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 mb-1">{stat.val}</div>
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</div>
                </div>
            ))}
        </div>
      </div>

      {/* Top Destinations Grid (Visual Enhancement) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-12">
        <div className="flex flex-col md:flex-row items-end justify-between mb-10">
            <div>
                <span className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-2 block">Inspiration</span>
                <h2 className="text-4xl font-extrabold text-slate-900">Destinations Phare</h2>
            </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[500px]">
            <div className="col-span-2 row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer shadow-lg" onClick={() => navigate('/search?destination=Bali')}>
                <img src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1038&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Bali" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute bottom-6 left-6 text-white transform group-hover:translate-y-[-5px] transition-transform duration-500">
                    <h3 className="text-3xl font-bold mb-1">Bali</h3>
                    <p className="text-white/80 font-medium">L'île des Dieux</p>
                    <span className="inline-block mt-3 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/30">Dès 1200€</span>
                </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-lg" onClick={() => navigate('/search?destination=Paris')}>
                <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=1773&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Paris" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">Paris</h3>
                </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-lg" onClick={() => navigate('/search?destination=New York')}>
                <img src="https://images.unsplash.com/photo-1496442226666-8d4a0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="New York" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">New York</h3>
                </div>
            </div>
            <div className="col-span-2 relative rounded-3xl overflow-hidden group cursor-pointer shadow-lg" onClick={() => navigate('/search?destination=Santorin')}>
                <img src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1778&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Santorini" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white transform group-hover:translate-y-[-5px] transition-transform duration-500">
                    <h3 className="text-2xl font-bold mb-1">Santorin</h3>
                    <p className="text-white/80 font-medium">Grèce</p>
                    <span className="inline-block mt-3 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/30">Dès 900€</span>
                </div>
            </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
            <span className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-2 block">Simple & Rapide</span>
            <h2 className="text-4xl font-extrabold text-slate-900">Comment ça marche ?</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10 -translate-y-1/2"></div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg text-center relative hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-blue-500/30 shadow-lg text-2xl font-bold">1</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Choisissez</h3>
                <p className="text-slate-500 leading-relaxed">Parcourez nos offres exclusives ou recherchez la destination de vos rêves.</p>
                <div className="mt-6 flex justify-center">
                    <Globe className="w-8 h-8 text-blue-200" />
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg text-center relative hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-indigo-500/30 shadow-lg text-2xl font-bold">2</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Réservez</h3>
                <p className="text-slate-500 leading-relaxed">Contactez-nous via WhatsApp ou formulaire pour un devis personnalisé.</p>
                <div className="mt-6 flex justify-center">
                    <CalendarCheck className="w-8 h-8 text-indigo-200" />
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg text-center relative hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-purple-500/30 shadow-lg text-2xl font-bold">3</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Profitez</h3>
                <p className="text-slate-500 leading-relaxed">Préparez vos valises, nous nous occupons de tout le reste !</p>
                <div className="mt-6 flex justify-center">
                    <Plane className="w-8 h-8 text-purple-200" />
                </div>
            </div>
        </div>
      </div>

      {/* Special Offers Section */}
      <div className="bg-slate-50 py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
            <div>
                <div className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-2 flex items-center gap-2">
                    <span className="w-8 h-0.5 bg-blue-600 rounded-full"></span>
                    Sélection exclusive
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
                    Nos Coups de Cœur <span className="text-red-500">❤️</span>
                </h2>
            </div>
            <Link 
                to="/search" 
                className="group flex items-center px-6 py-3 bg-white border border-gray-200 text-slate-700 rounded-full font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 shadow-sm hover:shadow-md"
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
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
                <p className="text-gray-400 font-medium">Aucune offre spéciale pour le moment.</p>
            </div>
            )}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <span className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-2 block">Témoignages</span>
                <h2 className="text-4xl font-extrabold text-slate-900">Ce que disent nos voyageurs</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { name: "Sophie Martin", dest: "Bali", txt: "Un voyage absolument magique. L'organisation était parfaite du début à la fin. Merci VoyageVista !", img: "https://randomuser.me/api/portraits/women/44.jpg" },
                    { name: "Thomas Dubois", dest: "Kenya", txt: "Le safari était incroyable. Nous avons vu les 'Big Five'. Des souvenirs pour toute la vie.", img: "https://randomuser.me/api/portraits/men/32.jpg" },
                    { name: "Marie & Pierre", dest: "Venise", txt: "Un weekend romantique inoubliable. L'hôtel recommandé était sublime. Nous repartirons avec vous.", img: "https://randomuser.me/api/portraits/women/68.jpg" }
                ].map((t, i) => (
                    <div key={i} className="bg-gray-50 p-8 rounded-3xl shadow-sm border border-gray-100 relative group hover:-translate-y-2 transition-transform duration-300">
                        <Quote className="absolute top-8 right-8 w-10 h-10 text-blue-100 group-hover:text-blue-200 transition-colors" />
                        <div className="flex items-center gap-4 mb-6">
                            <img src={t.img} alt={t.name} className="w-14 h-14 rounded-full border-2 border-white shadow-md" />
                            <div>
                                <h4 className="font-bold text-slate-900">{t.name}</h4>
                                <span className="text-xs font-bold text-blue-500 uppercase tracking-wide">Voyage à {t.dest}</span>
                            </div>
                        </div>
                        <p className="text-slate-600 italic leading-relaxed">"{t.txt}"</p>
                        <div className="flex gap-1 mt-6 text-yellow-400">
                            {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <Newsletter />

      {/* CTA Section */}
      <div className="py-24 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 opacity-90"></div>
            <img 
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80" 
                className="w-full h-full object-cover opacity-30 mix-blend-overlay"
                alt="Plane"
            />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Votre voyage de rêve n'attend que vous</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto leading-relaxed opacity-90">
                Nos experts sont à votre disposition pour créer un itinéraire personnalisé. Demandez un devis gratuit dès aujourd'hui.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/search" className="w-full sm:w-auto px-8 py-4 bg-white text-blue-900 rounded-full font-bold hover:bg-blue-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform hover:-translate-y-0.5">
                    Trouver une offre
                </Link>
                <Link to="/contact" className="w-full sm:w-auto px-8 py-4 bg-blue-600/30 backdrop-blur-md border border-white/20 text-white rounded-full font-bold hover:bg-blue-600/50 transition-all">
                    Nous contacter
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;