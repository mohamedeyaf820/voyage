
import { Offer, ClientRequest, Review } from '../types';
import { INITIAL_OFFERS } from '../constants';

const OFFERS_KEY = 'voyagevista_offers';
const REQUESTS_KEY = 'voyagevista_requests';
const FAVORITES_KEY = 'voyagevista_favorites';
const REVIEWS_KEY = 'voyagevista_reviews';

export const getOffers = (): Offer[] => {
  const stored = localStorage.getItem(OFFERS_KEY);
  if (!stored) {
    localStorage.setItem(OFFERS_KEY, JSON.stringify(INITIAL_OFFERS));
    return INITIAL_OFFERS;
  }
  return JSON.parse(stored);
};

export const saveOffer = (offer: Offer): void => {
  const offers = getOffers();
  const existingIndex = offers.findIndex(o => o.id === offer.id);
  
  if (existingIndex >= 0) {
    offers[existingIndex] = offer;
  } else {
    offers.push(offer);
  }
  
  localStorage.setItem(OFFERS_KEY, JSON.stringify(offers));
};

export const deleteOffer = (id: string): void => {
  const offers = getOffers().filter(o => o.id !== id);
  localStorage.setItem(OFFERS_KEY, JSON.stringify(offers));
};

export const getRequests = (): ClientRequest[] => {
  const stored = localStorage.getItem(REQUESTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveRequest = (request: ClientRequest): void => {
  const requests = getRequests();
  // Add new request to the beginning
  requests.unshift(request);
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
};

export const updateRequestStatus = (id: string, status: ClientRequest['status']): void => {
  const requests = getRequests();
  const index = requests.findIndex(r => r.id === id);
  if (index >= 0) {
    requests[index].status = status;
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
  }
};

export const deleteRequest = (id: string): void => {
  const requests = getRequests().filter(r => r.id !== id);
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
};

// Favorites Management
export const getFavorites = (): string[] => {
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const toggleFavorite = (offerId: string): boolean => {
  const favorites = getFavorites();
  const index = favorites.indexOf(offerId);
  let isFav = false;

  if (index >= 0) {
    favorites.splice(index, 1);
    isFav = false;
  } else {
    favorites.push(offerId);
    isFav = true;
  }
  
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return isFav;
};

export const isFavorite = (offerId: string): boolean => {
  const favorites = getFavorites();
  return favorites.includes(offerId);
};

// Reviews Management
export const getReviews = (offerId: string): Review[] => {
  const stored = localStorage.getItem(REVIEWS_KEY);
  const allReviews: Review[] = stored ? JSON.parse(stored) : [];
  return allReviews.filter(r => r.offerId === offerId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addReview = (review: Review): void => {
  const stored = localStorage.getItem(REVIEWS_KEY);
  const allReviews: Review[] = stored ? JSON.parse(stored) : [];
  allReviews.push(review);
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(allReviews));
};
