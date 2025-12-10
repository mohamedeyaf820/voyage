import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, ArrowLeft, MessageCircle, Send, ShieldCheck, Info, Sparkles, Share2, Star, User, Headphones, Loader2, PlayCircle, PauseCircle } from 'lucide-react';
import { Offer, ClientRequest, Review } from '../types';
import { getOffers, saveRequest, getReviews, addReview } from '../services/storageService';
import { generateItinerary, generateAudioGuide } from '../services/geminiService';
import { v4 as uuidv4 } from 'uuid';
import OfferCard from '../components/OfferCard';

// Declare Swal for Typescript
declare const Swal: any;

const OfferDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [relatedOffers, setRelatedOffers] = useState<Offer[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // AI Features State
  const [itinerary, setItinerary] = useState<string>('');
  const [isItineraryLoading, setIsItineraryLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Review Form State
  const [reviewForm, setReviewForm] = useState({
    userName: '',
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const offers = getOffers();
    const found = offers.find(o => o.id === id);
    if (found) {
      setOffer(found);
      setReviews(getReviews(found.id));
      // Find related offers
      const related = offers
        .filter(o => o.category === found.category && o.id !== found.id)
        .slice(0, 3);
      setRelatedOffers(related);
      
      // Reset AI states when offer changes
      setItinerary('');
      setAudioUrl(null);
      setIsPlaying(false);
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Lien copié !',
      showConfirmButton: false,
      timer: 1500
    });
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

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.userName || !reviewForm.comment) return;

    const newReview: Review = {
      id: uuidv4(),
      offerId: offer.id,
      userName: reviewForm.userName,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      date: new Date().toISOString()
    };

    addReview(newReview);
    setReviews(prev => [newReview, ...prev]);
    setReviewForm({ userName: '', rating: 5, comment: '' });

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Avis ajouté !',
      showConfirmButton: false,
      timer: 1500
    });
  };

  const handleGenerateItinerary = async () => {
    setIsItineraryLoading(true);
    const result = await generateItinerary(offer.title, offer.destination, offer.duration);
    setItinerary(result);
    setIsItineraryLoading(false);
  };

  const handleGenerateAudio = async () => {
    if (audioUrl) {
      // Toggle play
      if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
      return;
    }

    setIsAudioLoading(true);
    const base64Audio = await generateAudioGuide(offer.description);
    if (base64Audio) {
        const audioBlob = await (await fetch(`data:audio/mp3;base64,${base64Audio}`)).blob();
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setIsAudioLoading(false);
        setIsPlaying(true);
        // Auto play
        setTimeout(() => {
            if (audioRef.current) audioRef.current.play();
        }, 100);
    } else {
        setIsAudioLoading(false);
        Swal.fire('Erreur', "Impossible de générer l'audio guide.", 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-500 hover:text-blue-600 transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux résultats
        </button>

        <button 
          onClick={handleShare}
          className="flex items-center text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors font-bold text-sm"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Partager
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
                
                {/* Audio Guide Button */}
                <button 
                    onClick={handleGenerateAudio}
                    className="absolute bottom-6 right-8 bg-white/20 backdrop-blur-md border border-white/30 text-white p-3 rounded-full hover:bg-white/30 transition-all shadow-lg flex items-center gap-2 group"
                    title="Écouter la description (IA)"
                >
                    {isAudioLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : isPlaying ? (
                        <PauseCircle className="w-6 h-6 fill-white text-transparent group-hover:scale-110 transition-transform" />
                    ) : (
                        <Headphones className="w-6 h-6" />
                    )}
                    <span className="text-sm font-bold pr-2 hidden group-hover:block animate-fade-in">Audio Guide</span>
                </button>
                <audio ref={audioRef} src={audioUrl || ''} onEnded={() => setIsPlaying(false)} className="hidden" />
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
                  <p className="leading-relaxed whitespace-pre-wrap text-lg mb-8">
                    {offer.description}
                  </p>
                  
                  {/* AI Itinerary Section */}
                  <div className="bg-indigo-50/50 rounded-3xl p-6 border border-indigo-100 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2 m-0">
                            <Sparkles className="w-5 h-5 text-indigo-500" />
                            Programme Suggéré (IA)
                        </h3>
                        {!itinerary && (
                            <button 
                                onClick={handleGenerateItinerary}
                                disabled={isItineraryLoading}
                                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md"
                            >
                                {isItineraryLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                Générer l'itinéraire
                            </button>
                        )}
                    </div>
                    
                    {isItineraryLoading ? (
                        <div className="space-y-3 p-4">
                            <div className="h-4 bg-indigo-200/50 rounded w-3/4 animate-pulse"></div>
                            <div className="h-4 bg-indigo-200/50 rounded w-1/2 animate-pulse"></div>
                            <div className="h-4 bg-indigo-200/50 rounded w-full animate-pulse"></div>
                        </div>
                    ) : itinerary ? (
                        <div className="prose-sm text-indigo-800 bg-white p-6 rounded-2xl shadow-sm border border-indigo-100" dangerouslySetInnerHTML={{ __html: itinerary }} />
                    ) : (
                        <p className="text-sm text-indigo-400 italic">Cliquez sur le bouton pour générer un programme jour par jour personnalisé par notre IA.</p>
                    )}
                  </div>

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

            {/* Reviews Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 animate-fade-in-up animate-delay-100">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                        <Star className="w-6 h-6 mr-2 text-yellow-500 fill-current" />
                        Avis voyageurs ({reviews.length})
                    </h3>
                    <div className="text-sm font-medium text-gray-500">
                        Note moyenne: {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 'N/A'}/5
                    </div>
                </div>

                {/* Review Form */}
                <form onSubmit={handleReviewSubmit} className="mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h4 className="font-bold text-gray-800 mb-4">Laisser un avis</h4>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <input 
                                type="text"
                                placeholder="Votre nom"
                                required
                                value={reviewForm.userName}
                                onChange={(e) => setReviewForm(prev => ({...prev, userName: e.target.value}))}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                            <select 
                                value={reviewForm.rating}
                                onChange={(e) => setReviewForm(prev => ({...prev, rating: Number(e.target.value)}))}
                                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            >
                                <option value="5">★★★★★ (5)</option>
                                <option value="4">★★★★ (4)</option>
                                <option value="3">★★★ (3)</option>
                                <option value="2">★★ (2)</option>
                                <option value="1">★ (1)</option>
                            </select>
                        </div>
                        <textarea 
                            placeholder="Partagez votre expérience..."
                            required
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm(prev => ({...prev, comment: e.target.value}))}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                            rows={2}
                        />
                        <button type="submit" className="self-end px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-colors">
                            Publier
                        </button>
                    </div>
                </form>

                {/* Reviews List */}
                <div className="space-y-6">
                    {reviews.length > 0 ? (
                        reviews.map(review => (
                            <div key={review.id} className="border-b border-gray-100 pb-6 last:pb-0 last:border-0">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold text-gray-900">{review.userName}</span>
                                    </div>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                                <span className="text-xs text-gray-400 mt-2 block">{new Date(review.date).toLocaleDateString()}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center italic">Soyez le premier à donner votre avis !</p>
                    )}
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

        {/* Related Offers Section */}
        {relatedOffers.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Vous aimerez aussi</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedOffers.map(related => (
                <OfferCard key={related.id} offer={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferDetails;
