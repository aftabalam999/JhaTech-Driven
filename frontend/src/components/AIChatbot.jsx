import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Loader2, Sparkles, MessageCircle } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      sender: 'bot',
      text: 'Namaste! 🚀 I am your JhaTech AI Assistant. Ask me how a custom website can double your saree shop sales, check our transparent pricing, or learn how to earn ₹1,000 per referral!'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = query;
    setChatLog((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setQuery('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/partner/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerName: 'Guest User',
          query: userMessage
        })
      });
      const data = await response.json();
      if (response.ok) {
        setChatLog((prev) => [...prev, { sender: 'bot', text: data.answer }]);
      } else {
        setChatLog((prev) => [...prev, { sender: 'bot', text: 'Sorry, I couldn\'t process that. Please try again.' }]);
      }
    } catch (err) {
      setChatLog((prev) => [...prev, { sender: 'bot', text: 'Cannot connect to the AI server. Please make sure the backend is running.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-accent text-white shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-110 active:scale-95 animate-glow relative group"
        >
          <Bot className="h-6 w-6" />
          <span className="absolute right-16 top-2.5 scale-0 group-hover:scale-100 transition-all duration-200 rounded-lg bg-slate-900 border border-white/5 px-3 py-1.5 text-xs text-slate-300 whitespace-nowrap shadow-md">
            Chat with AI Growth Bot 💬
          </span>
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-light opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-accent"></span>
          </span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[500px] flex flex-col glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-300 transform scale-100 origin-bottom-right">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-950 to-slate-900 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AI Growth Advisor</h3>
                <span className="text-[9px] text-accent-light flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Chat Logs */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950/20">
            {chatLog.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-tr-none shadow-md shadow-primary/10'
                      : 'bg-slate-900/90 border border-white/5 text-slate-300 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-900 border border-white/5 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 text-xs text-slate-400">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  Advisor is typing pitch scripts...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-white/5 flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything (e.g. Saree shop tips)..."
              className="flex-1 rounded-xl glass-input px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="rounded-xl bg-primary hover:bg-primary-dark p-2.5 text-white disabled:opacity-45 transition-all shrink-0 shadow-md shadow-primary/25"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
