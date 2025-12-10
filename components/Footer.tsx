import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">VoyageVista</h3>
          <p className="text-gray-400 text-sm">
            Votre partenaire de confiance pour découvrir le monde. Des voyages sur mesure pour des souvenirs inoubliables.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Contact</h4>
          <p className="text-gray-400 text-sm mb-2">📞 +33 1 23 45 67 89</p>
          <p className="text-gray-400 text-sm mb-2">✉️ contact@voyagevista.com</p>
          <p className="text-gray-400 text-sm">📍 123 Avenue des Champs-Élysées, Paris</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Liens rapides</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white">Mentions légales</a></li>
            <li><a href="#" className="hover:text-white">CGV</a></li>
            <li><a href="#" className="hover:text-white">Confidentialité</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} VoyageVista. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;
