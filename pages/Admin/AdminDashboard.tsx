
import React, { useState, useEffect } from 'react';
import { Package, Inbox, BarChart2 } from 'lucide-react';
import ManageOffers from './ManageOffers';
import ManageRequests from './ManageRequests';
import { getRequests } from '../../services/storageService';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'offers' | 'requests'>('offers');
  const [stats, setStats] = useState({ total: 0, new: 0, processed: 0 });

  useEffect(() => {
    const reqs = getRequests();
    setStats({
      total: reqs.length,
      new: reqs.filter(r => r.status === 'Nouveau').length,
      processed: reqs.filter(r => r.status === 'Traité').length
    });
  }, [activeTab]); // Refresh when switching tabs

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
                <p className="text-gray-500 mt-1">Bienvenue dans l'espace d'administration VoyageVista.</p>
            </div>
            
            <div className="flex gap-4">
                <div className="bg-white p-3 px-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase">Total Demandes</span>
                    <span className="text-xl font-bold text-blue-600">{stats.total}</span>
                </div>
                 <div className="bg-white p-3 px-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase">À traiter</span>
                    <span className="text-xl font-bold text-green-500">{stats.new}</span>
                </div>
            </div>
        </div>

        {/* Visual Chart Placeholder (CSS based) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 flex items-center">
                <BarChart2 className="w-4 h-4 mr-2" />
                Activité Récente
            </h3>
            <div className="flex items-end h-32 gap-2">
                {[40, 65, 30, 85, 50, 75, 60, 90, 45, 70, 80, 55].map((h, i) => (
                    <div key={i} className="flex-1 bg-gray-100 rounded-t-lg relative group overflow-hidden">
                        <div 
                            className="absolute bottom-0 w-full bg-blue-500 opacity-80 group-hover:opacity-100 transition-all duration-500"
                            style={{ height: `${h}%` }}
                        ></div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
                <span>Jan</span><span>Fév</span><span>Mar</span><span>Avr</span><span>Mai</span><span>Juin</span>
                <span>Juil</span><span>Août</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Déc</span>
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('offers')}
              className={`flex-1 flex items-center justify-center py-4 px-1 text-sm font-bold transition-colors ${
                activeTab === 'offers'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Package className="w-4 h-4 mr-2" />
              Catalogue Offres
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 flex items-center justify-center py-4 px-1 text-sm font-bold transition-colors ${
                activeTab === 'requests'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Inbox className="w-4 h-4 mr-2" />
              Demandes Clients
              {stats.new > 0 && <span className="ml-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{stats.new}</span>}
            </button>
          </div>
        </div>

        <div className="animate-fade-in">
          {activeTab === 'offers' ? <ManageOffers /> : <ManageRequests />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
