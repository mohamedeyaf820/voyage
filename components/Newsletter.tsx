import React, { useState } from 'react';
import { Send, Mail } from 'lucide-react';

declare const Swal: any;

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      Swal.fire({
        icon: 'success',
        title: 'Inscription réussie !',
        text: 'Vous recevrez bientôt nos meilleures offres.',
        confirmButtonColor: '#2563EB',
      });
      setEmail('');
    }
  };

  return (
    <div className="bg-slate-900 py-16 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-2">Restez informé</h2>
            <p className="text-blue-100 text-lg">
              Recevez nos offres exclusives et nos conseils de voyage directement dans votre boîte mail. 
              <span className="text-sm block mt-1 opacity-70">Pas de spam, promis !</span>
            </p>
          </div>

          <div className="w-full md:w-auto flex-1 max-w-md">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 rounded-xl bg-white/95 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border-0 shadow-lg"
              />
              <button 
                type="submit" 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center whitespace-nowrap"
              >
                S'inscrire
                <Send className="w-4 h-4 ml-2" />
              </button>
            </form>
            <p className="text-xs text-blue-200/60 mt-3 text-center md:text-left">
              En vous inscrivant, vous acceptez notre politique de confidentialité.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
