
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { login } from '../services/authService';

declare const Swal: any;

const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      Swal.fire({
        icon: 'success',
        title: 'Connexion réussie',
        timer: 1000,
        showConfirmButton: false
      });
      // Redirect to Admin or where they came from
      navigate('/admin');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Accès refusé',
        text: 'Mot de passe incorrect'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10 animate-fade-in-up">
            <div className="text-center mb-8">
                <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-inner">
                    <ShieldCheck className="w-8 h-8 text-blue-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Espace Administration</h1>
                <p className="text-blue-200/70 text-sm">Veuillez vous identifier pour accéder au tableau de bord.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-blue-200 uppercase mb-2 ml-1">Mot de passe</label>
                    <div className="relative">
                        <Lock className="w-5 h-5 text-blue-300 absolute left-3 top-3.5" />
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Entrez le code admin..."
                            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            autoFocus
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-2 text-right italic">Hint: admin123</p>
                </div>

                <button 
                    type="submit"
                    className="w-full flex items-center justify-center py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5"
                >
                    Connexion
                    <ArrowRight className="w-4 h-4 ml-2" />
                </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <button 
                    onClick={() => navigate('/')}
                    className="text-sm text-blue-300 hover:text-white transition-colors"
                >
                    Retour au site public
                </button>
            </div>
        </div>
    </div>
  );
};

export default Login;
