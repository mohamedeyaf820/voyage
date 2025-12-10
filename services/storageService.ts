import { Offer, ClientRequest } from '../types';
import { INITIAL_OFFERS } from '../constants';

const OFFERS_KEY = 'voyagevista_offers';
const REQUESTS_KEY = 'voyagevista_requests';

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
