import { GoogleGenAI } from "@google/genai";
import { Offer } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateOfferDescription = async (title: string, destination: string, category: string): Promise<string> => {
  if (!ai) {
    return "API Key not configured.";
  }

  try {
    const prompt = `Rédigez une description courte, attrayante et commerciale (environ 50 mots) pour une offre de voyage intitulée "${title}" à destination de "${destination}" dans la catégorie "${category}". Incluez des émojis pertinents.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Impossible de générer la description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erreur lors de la génération de la description.";
  }
};

export const createChatSession = (offers: Offer[]) => {
  if (!ai) return null;

  const offersContext = offers.map(o => 
    `- ${o.title} (${o.category}) à ${o.destination} : ${o.price}€, ${o.duration} jours.`
  ).join('\n');

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `Tu es "VistaBot", l'assistant virtuel expert de l'agence de voyage VoyageVista.
      Ton but est d'aider les utilisateurs à trouver le voyage parfait parmi nos offres actuelles.
      
      Voici la liste de nos offres disponibles :
      ${offersContext}
      
      Règles :
      1. Sois toujours enthousiaste, poli et professionnel. Utilise des émojis voyage.
      2. Si l'utilisateur cherche un voyage, propose-lui une offre de la liste ci-dessus qui correspond.
      3. Si rien ne correspond exactement, propose l'offre la plus proche (ex: même continent ou même type).
      4. Si on te pose une question hors sujet voyage, ramène gentiment la conversation au voyage.
      5. Ne mentionne jamais d'IDs techniques.
      6. Tes réponses doivent être concises (max 3 phrases sauf si on demande des détails).`,
    }
  });
};