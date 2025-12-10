import React, { useState } from 'react';
import { Package, Inbox } from 'lucide-react';
import ManageOffers from './ManageOffers';
import ManageRequests from './ManageRequests';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'offers' | 'requests'>('offers');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
          <p className="text-gray-500 mt-1">Gérez vos offres de voyages et suivez les demandes clients.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('offers')}
              className={`flex-1 flex items-center justify-center py-4 px-1 text-sm font-medium ${
                activeTab === 'offers'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Package className="w-5 h-5 mr-2" />
              Gérer les Offres
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 flex items-center justify-center py-4 px-1 text-sm font-medium ${
                activeTab === 'requests'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Inbox className="w-5 h-5 mr-2" />
              Demandes Entrantes
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
