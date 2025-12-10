import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-white p-6 rounded-full shadow-xl border-4 border-blue-50 text-blue-500">
                <Compass className="w-full h-full animate-spin-slow" />
            </div>
        </div>
        
        <h1 className="text-8xl font-extrabold text-slate-900 mb-2 tracking-tighter">404</h1>
        <h2 className="text-2xl font-bold text-slate-700 mb-4">Oups ! Vous semblez perdu.</h2>
        <p className="text-slate-500 mb-8 text-lg">
          La destination que vous cherchez n'existe pas ou a été déplacée. 
          Revenez en lieu sûr avant qu'il ne fasse nuit !
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
                to="/"
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30"
            >
                <Home className="w-5 h-5 mr-2" />
                Accueil
            </Link>
            <button 
                onClick={() => window.history.back()}
                className="flex items-center justify-center px-6 py-3 bg-white text-slate-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour
            </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
