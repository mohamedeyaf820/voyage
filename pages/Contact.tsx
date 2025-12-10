import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { saveRequest } from '../services/storageService';
import { ClientRequest } from '../types';
import { v4 as uuidv4 } from 'uuid';

declare const Swal: any;

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "Comment réserver un voyage ?", a: "Vous pouvez réserver directement via WhatsApp sur la page de l'offre, ou nous envoyer une demande de devis via le formulaire de contact." },
    { q: "Proposez-vous des facilités de paiement ?", a: "Oui, nous proposons le paiement en 3 ou 4 fois sans frais pour tout voyage supérieur à 1000€." },
    { q: "Les vols sont-ils inclus ?", a: "Cela dépend des offres. La mention 'Vols inclus' est clairement indiquée sur les détails de chaque package." },
    { q: "Quelle est la politique d'annulation ?", a: "L'annulation est gratuite jusqu'à 30 jours avant le départ. Au-delà, des frais peuvent s'appliquer selon les prestataires." }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRequest: ClientRequest = {
      id: uuidv4(),
      clientName: formData.name,
      clientEmail: formData.email,
      clientPhone: formData.phone,
      offerTitle: `Contact: ${formData.subject}`,
      message: formData.message,
      status: 'Nouveau',
      createdAt: new Date().toISOString()
    };

    saveRequest(newRequest);

    Swal.fire({
      title: 'Message envoyé !',
      text: 'Notre équipe vous répondra sous 24h.',
      icon: 'success',
      confirmButtonColor: '#2563EB',
    });

    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="pt-24 pb-12 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Contactez-nous</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Une question sur un voyage ? Besoin d'un devis sur mesure ? 
            Notre équipe d'experts est à votre écoute.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Info Cards */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center text-center transform hover:-translate-y-1 transition-transform">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Téléphone</h3>
            <p className="text-slate-500 mb-4">Du Lundi au Vendredi, 9h-18h</p>
            <a href="tel:+33123456789" className="text-lg font-bold text-blue-600 hover:text-blue-700">
              +33 1 23 45 67 89
            </a>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center text-center transform hover:-translate-y-1 transition-transform">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-6">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Email</h3>
            <p className="text-slate-500 mb-4">Réponse sous 24h</p>
            <a href="mailto:contact@voyagevista.com" className="text-lg font-bold text-purple-600 hover:text-purple-700">
              contact@voyagevista.com
            </a>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center text-center transform hover:-translate-y-1 transition-transform">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 mb-6">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Agence</h3>
            <p className="text-slate-500 mb-4">Venez nous rencontrer</p>
            <span className="text-lg font-bold text-orange-600">
              123 Avenue des Champs-Élysées<br/>75008 Paris
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
              <h3 className="text-2xl font-bold flex items-center">
                <Send className="w-6 h-6 mr-3" />
                Envoyez-nous un message
              </h3>
              <p className="text-blue-100 mt-2">Remplissez le formulaire ci-dessous et nous vous recontacterons très vite.</p>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nom complet</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Téléphone</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Sujet</label>
                  <select
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="Devis">Demande de devis</option>
                    <option value="Information">Information sur un voyage</option>
                    <option value="Partenariat">Partenariat</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  placeholder="Dites-nous en plus sur votre projet de voyage..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Envoyer le message
              </button>
            </form>
          </div>

          {/* FAQ Section */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <HelpCircle className="w-6 h-6 mr-2 text-blue-600" />
              Questions Fréquentes
            </h3>
            <div className="space-y-4">
              {faqs.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  >
                    <span className="font-bold text-slate-800">{item.q}</span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-blue-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <div
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                      openFaq === index ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-slate-600">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="mt-8 bg-gray-200 rounded-3xl h-64 w-full relative overflow-hidden shadow-inner group">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1774&q=80" 
                alt="Map" 
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full text-sm font-bold shadow-lg hover:bg-blue-600 hover:text-white transition-colors flex items-center"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Voir sur la carte
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
