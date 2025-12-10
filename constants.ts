import { Offer } from './types';

export const INITIAL_OFFERS: Offer[] = [
  {
    id: '1',
    title: 'Escapade à Bali',
    description: 'Profitez de plages paradisiaques et de temples anciens lors de ce séjour inoubliable.',
    destination: 'Indonésie',
    price: 1200,
    category: 'Séjour',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    isSpecial: true,
    startDate: '2024-06-15',
    duration: 10
  },
  {
    id: '2',
    title: 'Safari au Kenya',
    description: 'Découvrez la faune sauvage dans son habitat naturel avec nos guides experts.',
    destination: 'Kenya',
    price: 2500,
    category: 'Circuit',
    imageUrl: 'https://picsum.photos/800/600?random=2',
    isSpecial: false,
    startDate: '2024-07-10',
    duration: 7
  },
  {
    id: '3',
    title: 'Croisière Méditerranée',
    description: 'Visitez Barcelone, Rome et Athènes en une seule aventure luxueuse.',
    destination: 'Europe',
    price: 900,
    category: 'Croisière',
    imageUrl: 'https://picsum.photos/800/600?random=3',
    isSpecial: true,
    startDate: '2024-08-01',
    duration: 8
  },
  {
    id: '4',
    title: 'Weekend à Paris',
    description: 'Romantisme et culture au cœur de la ville lumière.',
    destination: 'France',
    price: 450,
    category: 'Weekend',
    imageUrl: 'https://picsum.photos/800/600?random=4',
    isSpecial: false,
    startDate: '2024-05-20',
    duration: 3
  }
];

export const CATEGORIES = ['Séjour', 'Circuit', 'Croisière', 'Weekend'];
