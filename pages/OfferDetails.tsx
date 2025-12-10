import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, ArrowLeft, MessageCircle, Send, CheckCircle, Info, ShieldCheck } from 'lucide-react';
import { Offer, ClientRequest } from '../types';
import { getOffers, saveRequest } from '../services/storageService';
import { v4 as uuidv4 } from 'uuid';

// Declare Swal for Typescript
declare const Swal: any;

const OfferDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<Offer | null>(null);
  
  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const offers = getOffers();
    const found = offers.find(o => o.id === id);
    if (found) {
      setOffer(found);
    } else {
      navigate('/search');
    }
  }, [id, navigate]);

  if (!offer) return null;

  const handleWhatsAppClick = () => {
    const message = `Bonjour, je suis intéressé par votre offre : ${offer.title} à ${offer.price}€. Merci de me recontacter.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest: ClientRequest = {
      id: uuidv4(),
      offerId: offer.id,
      offerTitle: offer.title,
      clientName: formData.name,
      clientEmail: formData.email,
      clientPhone: formData.phone,
      message: formData.message || `Intéressé par ${offer.title}`,
      status: 'Nouveau',
      createdAt: new Date().toISOString()
    };

    saveRequest(newRequest);
    
    Swal.fire({
      title: 'Demande envoyée !',
      text: 'Notre équipe vous recontactera dans les plus brefs délais.',
      icon: 'success',
      confirmButtonColor: '#2563EB',
      confirmButtonText: 'Super'
    });

    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-500 hover:text-blue-600 transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux résultats
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-fade-in-up">
              <div className="relative h-96">
                <img 
                    src={offer.imageUrl} 
                    alt={offer.title} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-8 text-white">
                    <span className="inline-block px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider mb-2">
                        {offer.category}
                    </span>
                    <h1 className="text-4xl font-bold shadow-sm">{offer.title}</h1>
                </div>
              </div>

              <div className="p-8">
                <div className="flex flex-wrap gap-6 mb-8 py-6 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl mr-3">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Destination</p>
                      <p className="font-semibold text-gray-900">{offer.destination}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl mr-3">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Départ</p>
                      <p className="font-semibold text-gray-900">{new Date(offer.startDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl mr-3">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Durée</p>
                      <p className="font-semibold text-gray-900">{offer.duration} jours</p>
                    </div>
                  </div>
                </div>

                <div className="prose prose-blue max-w-none text-gray-600">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Info className="w-5 h-5 mr-2 text-blue-600" />
                    Description du voyage
                  </h3>
                  <p className="leading-relaxed whitespace-pre-wrap text-lg">
                    {offer.description}
                  </p>
                  
                  <div className="mt-8 bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start">
                    <ShieldCheck className="w-6 h-6 text-blue-600 mr-4 flex-shrink-0 mt-1" />
                    <div>
                        <h4 className="font-bold text-blue-900 mb-1">Voyagez l'esprit tranquille</h4>
                        <p className="text-sm text-blue-700">Inclus : Assistance 24/7, Assurance annulation flexible (en option), Guide local expert.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6 lg:sticky lg:top-28 h-fit animate-fade-in-up animate-delay-100">
            
            {/* Price Card */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 text-center">
                <p className="text-sm text-gray-500 mb-1">Prix par personne</p>
                <div className="text-4xl font-extrabold text-gray-900 mb-6">{offer.price} €</div>
                
                <button 
                onClick={handleWhatsAppClick}
                className="w-full flex items-center justify-center bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-4 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mb-3"
                >
                <MessageCircle className="w-5 h-5 mr-2" />
                Réserver via WhatsApp
                </button>
                <p className="text-xs text-gray-400">Réponse immédiate (lun-ven 9h-18h)</p>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Demander un devis</h3>
              
              <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom complet</label>
                      <input 
                          type="text" 
                          name="name" 
                          required
                          value={formData.name}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                      <input 
                          type="email" 
                          name="email" 
                          required
                          value={formData.email}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Téléphone</label>
                      <input 
                          type="tel" 
                          name="phone" 
                          required
                          value={formData.phone}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Message</label>
                      <textarea 
                          name="message" 
                          rows={3}
                          value={formData.message}
                          onChange={handleFormChange}
                          placeholder="Bonjour, je souhaite..."
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                      />
                  </div>
                  <button 
                      type="submit"
                      className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg"
                  >
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer la demande
                  </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetails;