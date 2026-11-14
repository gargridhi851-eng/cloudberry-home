import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, ArrowRight, ShoppingBag, CornerDownLeft, RefreshCw } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  recommendedProductIds?: string[];
}

export const AIAssistant: React.FC = () => {
  const {
    isAIAssistantOpen,
    setIsAIAssistantOpen,
    products,
    addToCart,
    setSelectedProduct,
    setActiveTab,
  } = useStore();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      text: 'Warm greetings from Cloudberry Home. I am your AI Interior Stylist and Decor Consultant. Whether you are searching for the ideal ceramic vase centerpiece, layering organic linen in your bedroom, or composing a calm living space, I am here to guide your aesthetic journey.',
      recommendedProductIds: ['prod-1', 'prod-2', 'prod-3'],
    },
  ]);

  const quickPrompts = [
    'How do I style a minimalist living room?',
    'Warm evening bedroom lighting ideas',
    'Best ceramic vases for dried florals',
    'Heirloom gift ideas under ₹3,000',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAIAssistantOpen) {
      scrollToBottom();
    }
  }, [messages, isAIAssistantOpen]);

  const detectProductsInResponse = (text: string): string[] => {
    const t = text.toLowerCase();
    const matched: string[] = [];
    products.forEach((p) => {
      const nameLower = p.name.toLowerCase();
      const firstWord = nameLower.split(' ')[0];
      if (t.includes(nameLower) || (firstWord.length > 3 && t.includes(firstWord))) {
        if (!matched.includes(p.id)) matched.push(p.id);
      }
    });
    return matched.slice(0, 2);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: historyPayload }),
      });

      const data = await res.json();
      const replyText = data.reply || 'I recommend pairing tactile linen cushions with warm stone lighting for calm balance.';
      const recommended = detectProductsInResponse(replyText);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        recommendedProductIds: recommended.length > 0 ? recommended : undefined,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackReply = 'For an effortless serene aesthetic, anchor your space with our Kyoto Fluted Ceramic Vases (₹3,499) and pair with our warm-toned Solstice French Flax Linen Cushions (₹1,899).';
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: fallbackReply,
        recommendedProductIds: ['prod-1', 'prod-3'],
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 1. Corner Floating AI Assistant Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#2E2420] text-[#FAF8F5] rounded-full shadow-2xl border border-[#D4AF67]/40 hover:border-[#D4AF67] transition-all cursor-pointer"
          aria-label="Open Cloudberry AI Interior Stylist"
        >
          <div className="w-6 h-6 rounded-full bg-[#B88E3E] flex items-center justify-center text-white shrink-0 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#D4AF67]">
              AI Interior Stylist
            </span>
            <span className="text-[10px] text-[#D6C8B8]">
              Personal Decor Concierge
            </span>
          </div>
        </motion.button>
      </div>

      {/* 2. Floating AI Assistant Chat Dialog Window */}
      <AnimatePresence>
        {isAIAssistantOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] max-h-[640px] h-[82vh] bg-[#FAF8F5] border border-[#EAE3D9] shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Window Header */}
            <div className="px-5 py-4 bg-[#2E2420] text-[#FAF8F5] flex items-center justify-between border-b border-[#4E3E37]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#B88E3E] flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base tracking-wide text-[#FAF8F5] font-medium">
                    Cloudberry AI Stylist
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#D4AF67] uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6D7F6E]" />
                    <span>Active Design Concierge</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsAIAssistantOpen(false)}
                  className="p-1.5 text-[#D6C8B8] hover:text-white transition-colors"
                  aria-label="Close AI Assistant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Conversation Messages Body */}
            <div className="flex-grow overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#FAF8F5]">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 text-xs ${
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-[#EAE3D9] text-[#4E3E37] flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#B88E3E]" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] p-3.5 space-y-2 leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-[#4E3E37] text-[#FAF8F5] rounded-none rounded-tl-lg'
                        : 'bg-[#F5F0E8] text-[#2E2420] border border-[#EAE3D9] rounded-none rounded-tr-lg'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>

                    {/* Render Recommended Products if mentioned */}
                    {m.recommendedProductIds && m.recommendedProductIds.length > 0 && (
                      <div className="pt-2 border-t border-[#EAE3D9] space-y-2">
                        <span className="text-[10px] uppercase tracking-wider text-[#6D7F6E] font-semibold block">
                          Curated Decor Suggestions
                        </span>
                        {m.recommendedProductIds.map((pid) => {
                          const prod = products.find((p) => p.id === pid);
                          if (!prod) return null;
                          return (
                            <div
                              key={prod.id}
                              className="flex items-center justify-between p-2 bg-white border border-[#EAE3D9] gap-2"
                            >
                              <img
                                src={prod.images[0]}
                                alt={prod.name}
                                className="w-10 h-12 object-cover shrink-0"
                              />
                              <div className="flex-grow min-w-0 text-[11px]">
                                <div className="font-serif font-semibold text-[#2E2420] truncate">
                                  {prod.name}
                                </div>
                                <div className="font-mono text-[10px] text-[#7A6B63]">
                                  ₹{prod.price.toLocaleString('en-IN')}
                                </div>
                              </div>
                              <div className="flex gap-1 shrink-0">
                                <button
                                  onClick={() => {
                                    setSelectedProduct(prod);
                                  }}
                                  className="px-2 py-1 bg-[#F5F0E8] hover:bg-[#EAE3D9] text-[#4E3E37] text-[10px] uppercase font-medium"
                                  title="View Piece"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => addToCart(prod, 1)}
                                  className="p-1 bg-[#4E3E37] text-white hover:bg-[#2E2420]"
                                  title="Add to Bag"
                                >
                                  <ShoppingBag className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-[#7A6B63] p-2">
                  <div className="w-2 h-2 rounded-full bg-[#B88E3E] animate-ping" />
                  <span className="italic font-serif">Curating space recommendations...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Inspiration Prompts */}
            <div className="px-4 py-2 bg-[#F5F0E8] border-t border-[#EAE3D9] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="px-2.5 py-1 bg-white hover:bg-[#4E3E37] text-[#4E3E37] hover:text-white border border-[#EAE3D9] text-[10px] uppercase tracking-wider font-medium transition-colors whitespace-nowrap cursor-pointer shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="p-3 bg-[#FAF8F5] border-t border-[#EAE3D9]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask for living room styling, colors, lighting..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-grow px-3 py-2.5 bg-white border border-[#EAE3D9] text-xs text-[#2E2420] placeholder-[#9B8C83] focus:outline-none focus:border-[#4E3E37]"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2.5 bg-[#4E3E37] hover:bg-[#2E2420] text-white transition-colors disabled:opacity-40 cursor-pointer shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
