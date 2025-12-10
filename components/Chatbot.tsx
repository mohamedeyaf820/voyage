
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader2, Sparkles, Trash2, ChevronDown, MapPin, AlertCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { createChatSession } from '../services/geminiService';
import { getOffers } from '../services/storageService';
import { Offer } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const formatText = (text: string) => {
  let formatted = text;
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/^\s*-\s+(.*)$/gm, '<li>$1</li>');
  if (formatted.includes('<li>')) {
    formatted = formatted.replace(/((<li>.*<\/li>\s*)+)/g, '<ul>$1</ul>');
  }
  formatted = formatted.replace(/\n/g, '<br />');
  return formatted;
};

const Chatbot: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Bonjour ! Je suis **VistaBot** 🤖. Prêt pour votre prochaine aventure ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentOffer, setCurrentOffer] = useState<Offer | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initSession = async () => {
      try {
        const offers = getOffers();
        const session = createChatSession(offers);
        setChatSession(session);
      } catch (err) {
        console.error("Failed to initialize chat session", err);
      }
    };
    initSession();
  }, []);

  useEffect(() => {
    const offers = getOffers();
    const path = location.pathname;

    if (path === '/') {
      setCurrentOffer(null);
      setSuggestions(["☀️ Top destinations soleil", "💰 Voyages à petit prix", "📅 Offres de dernière minute"]);
    } else if (path.startsWith('/search')) {
      setCurrentOffer(null);
      setSuggestions(["🔍 Comment filtrer ?", "💎 Escapades de luxe", "👨‍👩‍👧 Pour les familles"]);
    } else if (path.startsWith('/offer/')) {
      const offerId = path.split('/')[2];
      const found = offers.find(o => o.id === offerId);
      if (found) {
        setCurrentOffer(found);
        setSuggestions([
          `📅 Disponibilités pour ${found.destination}`, 
          `💶 Que comprend le prix ?`, 
          `🏖️ Activités sur place`
        ]);
      }
    } else {
      setSuggestions(["👋 Qui es-tu ?", "🌍 Quelles destinations ?"]);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async (textToSend: string) => {
    const trimmedText = textToSend.trim();
    if (!trimmedText || !chatSession) return;

    setMessages(prev => [...prev, { role: 'user', text: trimmedText }]);
    setInput('');
    setIsLoading(true);

    try {
      let contextPrefix = `[Context: User is at ${location.pathname}.`;
      if (currentOffer) {
        contextPrefix += ` Offer: ${currentOffer.title}.`;
      }
      contextPrefix += `] `;
      
      const fullMessage = `${contextPrefix}${trimmedText}`;

      // CRITICAL FIX: Ensure sendMessage payload is an object with 'message' property
      const result = await chatSession.sendMessage({ message: fullMessage });
      
      // Accessing text directly as a property (not a method)
      const responseText = result.text;
      
      if (responseText) {
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      } else {
        throw new Error("Empty response from AI");
      }
    } catch (error) {
      console.error('Chat API Error:', error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "Pardon, j'ai rencontré un petit souci technique. Pouvez-vous répéter ? 🙏" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const handleClearChat = () => {
     setMessages([{ role: 'model', text: 'On repart à zéro ! Comment puis-je vous aider ? 🌍' }]);
     setChatSession(createChatSession(getOffers()));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[600px] max-h-[85vh] bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden border border-slate-100 animate-fade-in-up ring-1 ring-slate-100">
          {/* Header */}
          <div className="bg-slate-900 p-6 flex justify-between items-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 opacity-95"></div>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg tracking-tight">VistaBot</h3>
                <div className="flex items-center text-xs text-blue-100/90 font-medium">
                   <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                   Expert en ligne 24/7
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 relative z-10">
                <button onClick={handleClearChat} className="p-2.5 rounded-2xl hover:bg-white/10 text-white/70 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                <button onClick={() => setIsOpen(false)} className="p-2.5 rounded-2xl hover:bg-white/10 text-white transition-all"><ChevronDown className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#fcfdfe] no-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                    <div className={`w-8 h-8 rounded-2xl flex-shrink-0 flex items-center justify-center text-[10px] font-bold shadow-sm ${
                        msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-blue-600 border border-slate-100'
                    }`}>
                        {msg.role === 'user' ? 'Vous' : 'AI'}
                    </div>

                    <div className={`p-4 rounded-3xl text-[13px] leading-relaxed shadow-sm prose-chat ${
                        msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-none' 
                        : 'bg-white text-slate-700 rounded-bl-none border border-slate-50'
                    }`} dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start w-full animate-fade-in-up">
                 <div className="flex items-end gap-3">
                    <div className="w-8 h-8 rounded-2xl bg-white text-blue-600 border border-slate-100 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">AI</div>
                    <div className="bg-white px-5 py-4 rounded-3xl rounded-bl-none shadow-sm border border-slate-50 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                    </div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {!isLoading && suggestions.length > 0 && (
              <div className="px-5 pb-3 bg-[#fcfdfe] flex gap-2 overflow-x-auto no-scrollbar py-2">
                  {suggestions.map((q, i) => (
                      <button key={i} onClick={() => handleSend(q)} className="flex-shrink-0 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold rounded-2xl hover:border-indigo-400 hover:text-indigo-600 transition-all shadow-sm whitespace-nowrap">
                          {q}
                      </button>
                  ))}
              </div>
          )}

          {/* Input Area */}
          <form onSubmit={onFormSubmit} className="p-4 bg-white border-t border-slate-50">
            <div className="relative flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-1 pl-5 pr-14 py-4 bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 rounded-2xl focus:ring-4 focus:ring-indigo-50/50 text-[13px] text-slate-700 placeholder-slate-400 transition-all outline-none"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center justify-center shadow-[0_10px_40px_-10px_rgba(37,99,235,0.4)] transition-all duration-500 ease-out z-50 ${
            isOpen 
            ? 'w-14 h-14 rounded-full bg-slate-800 border-4 border-white text-white rotate-180 hover:rotate-90' 
            : 'w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white hover:rounded-3xl hover:-translate-y-1'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-8 h-8" />}
        {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
            </span>
        )}
      </button>

      {!isOpen && (
          <div className="absolute bottom-20 right-0 bg-white px-5 py-3 rounded-2xl shadow-xl border border-slate-100 text-xs font-extrabold text-slate-800 whitespace-nowrap animate-fade-in-up origin-bottom-right">
              {currentOffer ? `Des infos sur ${currentOffer.destination} ? 👋` : "Besoin d'un conseil voyage ? 👋"}
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white transform rotate-45 border-r border-b border-slate-100"></div>
          </div>
      )}
    </div>
  );
};

export default Chatbot;
