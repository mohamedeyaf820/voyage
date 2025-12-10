import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Sparkles, Image as ImageIcon, Search, Filter } from 'lucide-react';
import { Offer } from '../../types';
import { getOffers, saveOffer, deleteOffer } from '../../services/storageService';
import { generateOfferDescription } from '../../services/geminiService';
import { CATEGORIES } from '../../constants';
import { v4 as uuidv4 } from 'uuid';

declare const Swal: any;

const ManageOffers: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Admin Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<Offer>>({
    title: '',
    destination: '',
    price: 0,
    description: '',
    category: 'Séjour',
    isSpecial: false,
    startDate: '',
    duration: 1,
    imageUrl: ''
  });

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  useEffect(() => {
    loadOffers();
  }, []);

  useEffect(() => {
    let result = offers;
    if (searchTerm) {
        result = result.filter(o => o.title.toLowerCase().includes(searchTerm.toLowerCase()) || o.destination.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (filterCategory) {
        result = result.filter(o => o.category === filterCategory);
    }
    setFilteredOffers(result);
  }, [offers, searchTerm, filterCategory]);

  const loadOffers = () => {
    const all = getOffers();
    setOffers(all);
    setFilteredOffers(all);
  };

  const handleOpenModal = (offer?: Offer) => {
    if (offer) {
      setEditingId(offer.id);
      setFormData(offer);
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        destination: '',
        price: 0,
        description: '',
        category: 'Séjour',
        isSpecial: false,
        startDate: new Date().toISOString().split('T')[0],
        duration: 3,
        imageUrl: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.destination) {
      Swal.fire('Info', "Veuillez remplir le titre et la destination d'abord.", 'info');
      return;
    }
    setIsGeneratingAI(true);
    const desc = await generateOfferDescription(
      formData.title, 
      formData.destination, 
      formData.category as string
    );
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGeneratingAI(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const offerToSave: Offer = {
      id: editingId || uuidv4(),
      title: formData.title || 'Sans titre',
      description: formData.description || '',
      destination: formData.destination || '',
      price: Number(formData.price) || 0,
      category: (formData.category as any) || 'Séjour',
      imageUrl: formData.imageUrl || 'https://picsum.photos/800/600',
      isSpecial: !!formData.isSpecial,
      startDate: formData.startDate || new Date().toISOString(),
      duration: Number(formData.duration) || 1
    };

    saveOffer(offerToSave);
    loadOffers();
    handleCloseModal();
    Swal.fire({
        icon: 'success',
        title: editingId ? 'Offre modifiée' : 'Offre créée',
        showConfirmButton: false,
        timer: 1500
    });
  };

  const handleDelete = (id: string) => {
    Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: "Cette action est irréversible.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oui, supprimer !',
        cancelButtonText: 'Annuler'
    }).then((result: any) => {
        if (result.isConfirmed) {
            deleteOffer(id);
            loadOffers();
            Swal.fire(
                'Supprimé !',
                'L\'offre a été supprimée.',
                'success'
            )
        }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Gestion des Offres</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une offre
        </button>
      </div>

      {/* Admin Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input 
                type="text" 
                placeholder="Rechercher une offre..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="w-full md:w-64 relative">
            <Filter className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <select 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
            >
                <option value="">Toutes catégories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Offre</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Destination</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Prix</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Catégorie</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredOffers.length > 0 ? (
                filteredOffers.map(offer => (
                <tr key={offer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <img className="h-12 w-12 rounded-lg object-cover mr-4 shadow-sm" src={offer.imageUrl} alt="" />
                        <div>
                            <div className="text-sm font-bold text-gray-900">{offer.title}</div>
                            {offer.isSpecial && <span className="text-[10px] uppercase bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">Promo</span>}
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{offer.destination}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{offer.price} €</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {offer.category}
                    </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleOpenModal(offer)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-lg mr-2 transition-colors">
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(offer.id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        Aucune offre ne correspond à vos critères.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                {editingId ? 'Modifier l\'offre' : 'Nouvelle offre'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Titre</label>
                  <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Destination</label>
                  <input type="text" name="destination" required value={formData.destination} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prix (€)</label>
                  <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Catégorie</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date départ</label>
                  <input type="date" name="startDate" required value={formData.startDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Durée (jours)</label>
                  <input type="number" name="duration" required value={formData.duration} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase">Description</label>
                  <button 
                    type="button" 
                    onClick={handleGenerateDescription}
                    disabled={isGeneratingAI}
                    className="flex items-center text-xs font-bold text-purple-600 hover:text-purple-800 disabled:opacity-50 transition-colors bg-purple-50 px-2 py-1 rounded-lg"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    {isGeneratingAI ? 'Génération...' : 'Générer avec IA'}
                  </button>
                </div>
                <textarea name="description" rows={4} value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Image</label>
                <div className="flex items-center gap-4 p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50">
                  {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="h-20 w-20 object-cover rounded-lg shadow-sm" />}
                  <label className="cursor-pointer flex flex-col items-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <ImageIcon className="w-5 h-5 mb-1 text-gray-400" />
                    <span>Choisir un fichier</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex items-center p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                <input 
                  type="checkbox" 
                  id="isSpecial" 
                  name="isSpecial" 
                  checked={formData.isSpecial} 
                  onChange={handleChange} 
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                />
                <label htmlFor="isSpecial" className="ml-3 block text-sm font-medium text-gray-900">
                  Marquer comme "Offre Spéciale" (Sera mis en avant sur l'accueil)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                  Annuler
                </button>
                <button type="submit" className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all">
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOffers;