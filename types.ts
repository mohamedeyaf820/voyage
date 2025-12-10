export interface Offer {
  id: string;
  title: string;
  description: string;
  destination: string;
  price: number;
  category: 'Séjour' | 'Circuit' | 'Croisière' | 'Weekend';
  imageUrl: string;
  isSpecial: boolean;
  startDate: string;
  duration: number; // in days
}

export interface ClientRequest {
  id: string;
  offerId?: string; // Optional if general contact
  offerTitle?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  message: string;
  status: 'Nouveau' | 'En cours' | 'Traité';
  createdAt: string;
}

export interface SearchFilters {
  destination: string;
  minPrice: number;
  maxPrice: number;
  category: string;
  date?: string;
}
