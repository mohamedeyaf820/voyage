import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Facebook, Instagram, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
                <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-lg text-white">
                    <Compass className="h-5 w-5" />
                </div>
                <span className="font-bold text-2xl tracking-tight text-white">
                    Voyage<span className="text-blue-500">Vista</span>
                </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Votre partenaire de confiance pour découvrir le monde. 
              Des voyages sur mesure, des expériences inoubliables et un service client dédié 24/7.
            </p>
            <div className="flex gap-4 pt-2">
                {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                    <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
                        <Icon className="w-4 h-4" />
                    </a>
                ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Navigation</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Accueil</Link></li>
              <li><Link to="/search" className="hover:text-blue-400 transition-colors">Nos Voyages</Link></li>
              <li><Link to="/favorites" className="hover:text-blue-400 transition-colors">Mes Favoris</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contactez-nous</Link></li>
              <li><Link to="/admin" className="hover:text-blue-400 transition-colors">Espace Admin</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Informations</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Mentions légales</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Politique de confidentialité</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Conditions Générales de Vente</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Nous Contacter</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start">
                <span className="mr-3 mt-1 block w-2 h-2 rounded-full bg-blue-500"></span>
                <span>
                    <strong className="block text-slate-200 mb-1">Téléphone</strong>
                    +33 1 23 45 67 89
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 mt-1 block w-2 h-2 rounded-full bg-purple-500"></span>
                <span>
                    <strong className="block text-slate-200 mb-1">Email</strong>
                    contact@voyagevista.com
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 mt-1 block w-2 h-2 rounded-full bg-orange-500"></span>
                <span>
                    <strong className="block text-slate-200 mb-1">Adresse</strong>
                    123 Avenue des Champs-Élysées,<br/>75008 Paris, France
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>© {new Date().getFullYear()} VoyageVista. Tous droits réservés.</p>
            <p className="flex items-center">
                Fait avec <Heart className="w-4 h-4 text-red-500 mx-1 fill-current animate-pulse" /> par votre Agence
            </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
