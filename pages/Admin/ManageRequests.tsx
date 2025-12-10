import React, { useState, useEffect } from 'react';
import { Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { ClientRequest } from '../../types';
import { getRequests, deleteRequest, updateRequestStatus } from '../../services/storageService';

declare const Swal: any;

const ManageRequests: React.FC = () => {
  const [requests, setRequests] = useState<ClientRequest[]>([]);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    setRequests(getRequests());
  };

  const handleDelete = (id: string) => {
    Swal.fire({
        title: 'Supprimer ?',
        text: "Cette demande sera effacée définitivement.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Supprimer'
    }).then((result: any) => {
        if (result.isConfirmed) {
            deleteRequest(id);
            loadRequests();
            Swal.fire('Supprimé', '', 'success');
        }
    });
  };

  const handleStatusChange = (id: string, newStatus: ClientRequest['status']) => {
    updateRequestStatus(id, newStatus);
    loadRequests();
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Nouveau': return 'bg-green-100 text-green-800 border-green-200';
      case 'En cours': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Traité': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Demandes Clients</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-l-4 border-green-500 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Nouveaux</p>
              <p className="text-3xl font-bold text-gray-900">{requests.filter(r => r.status === 'Nouveau').length}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-full">
                <AlertCircle className="w-6 h-6 text-green-500" />
            </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-l-4 border-yellow-500 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">En cours</p>
              <p className="text-3xl font-bold text-gray-900">{requests.filter(r => r.status === 'En cours').length}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-full">
                <Clock className="w-6 h-6 text-yellow-500" />
            </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-l-4 border-gray-500 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Traités</p>
              <p className="text-3xl font-bold text-gray-900">{requests.filter(r => r.status === 'Traité').length}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-gray-500" />
            </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {requests.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
                <Clock className="w-8 h-8" />
            </div>
            <p>Aucune demande reçue pour le moment.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {requests.map(request => (
              <li key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full mr-3 border ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      <span className="text-xs font-medium text-gray-400">
                        {new Date(request.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">
                      {request.clientName}
                    </h4>
                    <p className="text-sm font-medium text-blue-600 mb-3">
                      Intéressé par : {request.offerTitle || 'Contact Général'}
                    </p>
                    <div className="flex gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">📧 {request.clientEmail}</span>
                      <span className="flex items-center gap-1">📱 {request.clientPhone}</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 italic border border-gray-100 relative">
                      <span className="text-4xl text-gray-200 absolute -top-2 left-2">"</span>
                      <p className="relative z-10 px-2">{request.message}</p>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2 min-w-[140px]">
                    <select 
                      value={request.status}
                      onChange={(e) => handleStatusChange(request.id, e.target.value as any)}
                      className="w-full text-sm border-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-2"
                    >
                      <option value="Nouveau">Nouveau</option>
                      <option value="En cours">En cours</option>
                      <option value="Traité">Traité</option>
                    </select>
                    <button 
                      onClick={() => handleDelete(request.id)}
                      className="w-full flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageRequests;