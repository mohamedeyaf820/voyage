import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Offer } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- 1. Generate Description (Admin) ---
export const generateOfferDescription = async (title: string, destination: string, category: string): Promise<string> => {
  try {
    const prompt = `Rédigez une description courte, attrayante et commerciale (environ 50 mots) pour une offre de voyage intitulée "${title}" à destination de "${destination}" dans la catégorie "${category}". Incluez des émojis pertinents et mettez l'accent sur l'émotion et l'expérience.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [{ text: prompt }]
      },
    });

    return response.text || "Impossible de générer la description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erreur lors de la génération de la description.";
  }
};

// --- 2. Smart Search (Natural Language to Filters) ---
export const parseSmartSearch = async (userQuery: string): Promise<any> => {
    try {
        const prompt = `Analyse la demande de voyage suivante : "${userQuery}".
        Extrais les critères de recherche au format JSON pour filtrer une base de données de voyages.
        
        Les champs possibles sont :
        - destination (string): ville ou pays.
        - maxPrice (number): budget maximum en euros.
        - category (string): une valeur parmi ['Séjour', 'Circuit', 'Croisière', 'Weekend']. Si non spécifié ou ne correspond pas, laisse vide.
        
        Si l'utilisateur mentionne "pas cher" ou "petit budget", mets un maxPrice à 1000 si aucun prix n'est donné.
        Si l'utilisateur mentionne "luxe", mets un minPrice (tu peux ignorer minPrice dans le JSON de retour, focus sur maxPrice pour simplifier).
        
        Retourne UNIQUEMENT le JSON.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        destination: { type: Type.STRING },
                        maxPrice: { type: Type.NUMBER },
                        category: { type: Type.STRING },
                    }
                }
            }
        });

        return JSON.parse(response.text || '{}');
    } catch (error) {
        console.error("Smart Search Error:", error);
        return null;
    }
}

// --- 3. AI Itinerary Generator ---
export const generateItinerary = async (title: string, destination: string, duration: number): Promise<string> => {
    try {
        const prompt = `Génère un itinéraire type jour par jour (format liste HTML avec <ul> et <li>, utilise des <strong> pour les moments forts) pour le voyage "${title}" à ${destination} qui dure ${duration} jours.
        Sois créatif, inclus des activités culturelles, culinaires et de détente.
        Ne mets pas de balises <html> ou <body>, juste le contenu liste. Ajoute des emojis pour chaque jour.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }] }
        });

        return response.text || "<p>Impossible de générer l'itinéraire.</p>";
    } catch (error) {
        return "<p>Erreur lors de la génération.</p>";
    }
}

// --- 4. Audio Guide (Text-to-Speech) ---
export const generateAudioGuide = async (text: string): Promise<string | null> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: { parts: [{ text: `Bienvenue sur Voyage Vista. Voici ce qui vous attend pour votre voyage : ${text}` }] },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return base64Audio || null;

    } catch (error) {
        console.error("TTS Error:", error);
        return null;
    }
}

// --- 5. Chatbot Session ---
export const createChatSession = (offers: Offer[]) => {
  const offersContext = offers.map(o => 
    `- **${o.title}** (${o.category}) à ${o.destination}. Prix: ${o.price}€. Durée: ${o.duration} jours. Départ: ${o.startDate}.`
  ).join('\n');

  const systemInstructionText = `Tu es "VistaBot", l'assistant de voyage IA expert de l'agence "VoyageVista".
  
  TA MISSION :
  Aider les utilisateurs à trouver le voyage de leurs rêves et les inciter à réserver.
  
  CONTEXTE ACTUEL :
  L'utilisateur peut te contacter depuis différentes pages du site. Tu recevras parfois un tag [Context: ...] en début de message. Utilise cette information pour personnaliser ta réponse.

  NOTRE CATALOGUE :
  ${offersContext}
  
  RÈGLES DE RÉPONSE :
  1. **Ton** : Chaleureux, enthousiaste et professionnel. Utilise des émojis (✈️🌴).
  2. **Format** : Utilise le **gras** pour les prix et les noms de lieux. Utilise des listes à puces pour énumérer des avantages.
  3. **Vente** : Si l'utilisateur semble intéressé, incite-le à cliquer sur "Réserver" ou "Contact".
  4. **Concision** : Réponses courtes et percutantes (max 3-4 phrases sauf si on demande un détail).
  `;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: {
        parts: [{ text: systemInstructionText }]
      }
    }
  });
};
