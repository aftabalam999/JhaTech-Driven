import React, { useState, useEffect, useRef } from 'react';
import { Award, Copy, Check, MessageSquare, IndianRupee, HelpCircle, Send, Plus, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function PartnerPortal({ googleUser, onTriggerLogin, onLogout }) {
  const [partner, setPartner] = useState(null);
  const [registration, setRegistration] = useState({
    name: '',
    phone: '',
    email: '',
    upiId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copied, setCopied] = useState(false);

  // UPI Editing State
  const [isEditingUpi, setIsEditingUpi] = useState(false);
  const [newUpi, setNewUpi] = useState('');
  const [upiLoading, setUpiLoading] = useState(false);

  // Sale Simulation State
  const [simulationName, setSimulationName] = useState('');
  const [simulatingSale, setSimulatingSale] = useState(false);

  const handleStartEditUpi = () => {
    setNewUpi(partner?.upiId || '');
    setIsEditingUpi(true);
  };

  const handleSaveUpi = async (e) => {
    e.preventDefault();
    if (!newUpi.trim()) return;
    setUpiLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/partner/${partner.referralCode}/upi`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upiId: newUpi })
      });
      const data = await response.json();
      if (response.ok) {
        setPartner(data);
        setIsEditingUpi(false);
        setSuccessMsg('UPI ID updated successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(data.error || 'Failed to update UPI ID');
      }
    } catch (err) {
      setError('Connection failure while updating UPI ID');
    } finally {
      setUpiLoading(false);
    }
  };

  // Chatbot State
  const [query, setQuery] = useState('');
  const [chatLog, setChatLog] = useState([
    { sender: 'bot', text: 'Namaste! I am your AI Sales Advisor. Need a pitch script for a Saree Shop? Or want to know how you get paid? Ask me anything!' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Run Google check when user signs in/out
  useEffect(() => {
    if (googleUser) {
      checkGoogleLogin(googleUser.email, googleUser.name);
    } else {
      setPartner(null);
    }
  }, [googleUser]);

  const checkGoogleLogin = async (email, name) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/partner/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });
      const data = await response.json();
      if (response.ok) {
        if (data.exists) {
          setPartner(data.partner);
          localStorage.setItem('partnerReferralCode', data.partner.referralCode);
        } else {
          setPartner(null);
          setRegistration({
            name: name || '',
            phone: '',
            email: email || '',
            upiId: ''
          });
        }
      } else {
        setError(data.error || 'Failed to authenticate Google account.');
      }
    } catch (err) {
      setError('Cannot connect to authentication backend.');
    } finally {
      setLoading(false);
    }
  };

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, chatLoading]);

  const fetchPartnerData = async (code) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/partner/${code}`);
      const data = await response.json();
      if (response.ok) {
        setPartner(data);
      } else {
        localStorage.removeItem('partnerReferralCode');
      }
    } catch (err) {
      console.error('Error fetching partner data:', err);
    }
  };

  const handleRegisterChange = (e) => {
    setRegistration(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!registration.name || !registration.phone || !registration.upiId) {
      setError('Please fill in your Name, Phone (WhatsApp), and UPI ID.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/partner/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registration)
      });
      const data = await response.json();
      if (response.ok) {
        setPartner(data);
        localStorage.setItem('partnerReferralCode', data.referralCode);
        setSuccessMsg('Congratulations! You are now a JhaTech Growth Partner.');
      } else {
        setError(data.error || 'Failed to register. Please try again.');
      }
    } catch (err) {
      setError('Cannot connect to the server. Please check if the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!partner) return;
    const refLink = `${window.location.origin}/analyzer?ref=${partner.referralCode}`;
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulate a successful sale
  const handleSimulateSale = async (e) => {
    e.preventDefault();
    if (!simulationName) return;
    setSimulatingSale(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/partner/${partner.referralCode}/sale`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName: simulationName })
      });
      const data = await response.json();
      if (response.ok) {
        setPartner(data);
        setSimulationName('');
        setSuccessMsg(`Simulated Sale Successful! Added ₹1,000 for "${simulationName}".`);
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setError(data.error || 'Failed to simulate sale.');
      }
    } catch (err) {
      setError('Backend error during sale simulation.');
    } finally {
      setSimulatingSale(false);
    }
  };

  // Ask Partner Advisor Chat
  const handleAskAdvisor = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userQuery = query;
    setChatLog(prev => [...prev, { sender: 'user', text: userQuery }]);
    setQuery('');
    setChatLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/partner/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerName: partner?.name || 'Partner',
          query: userQuery
        })
      });
      const data = await response.json();
      if (response.ok) {
        setChatLog(prev => [...prev, { sender: 'bot', text: data.answer }]);
      } else {
        setChatLog(prev => [...prev, { sender: 'bot', text: 'Sorry, I couldn\'t process that question. Please try again.' }]);
      }
    } catch (err) {
      setChatLog(prev => [...prev, { sender: 'bot', text: 'Error connecting to the AI Advisor. Make sure the backend server is running.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('partnerReferralCode');
    setPartner(null);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          Referral <span className="text-accent">Partner Program</span>
        </h1>
        <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
          Earn ₹1,000 cash for every local business you refer that launches a website with JhaTech. Absolutely no educational qualification required to join.
        </p>
      </div>

      {successMsg && (
        <div className="mx-auto max-w-3xl mb-6 flex items-center justify-between gap-2 rounded-xl bg-accent/10 border border-accent/20 p-4 text-sm text-accent-light">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-xs hover:underline">Dismiss</button>
        </div>
      )}

      {error && (
        <div className="mx-auto max-w-3xl mb-6 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-400">
          <span>{error}</span>
        </div>
      )}

      {!googleUser ? (
        <div className="mx-auto max-w-md glass-panel rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[300px] border border-white/10">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-450 border border-amber-500/20 mb-5 animate-pulse">
            <Award className="h-8 w-8 text-accent" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Google Login Required</h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-sm mb-6 leading-relaxed">
            Please log in with your Google account to join our Referral Partner Program, track your ₹1,000 sales commissions, and consult your AI Pitch Advisor.
          </p>
          <button
            onClick={onTriggerLogin}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:opacity-95 transition-all cursor-pointer"
          >
            Log In with Google / Gmail
          </button>
        </div>
      ) : !partner ? (
        /* Onboarding / Registration Form */
        <div className="mx-auto max-w-xl glass-panel rounded-2xl p-6 sm:p-8 border border-white/10">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 mb-6 border border-amber-500/20">
            <Award className="h-6 w-6" />
          </div>

          <h2 className="text-xl font-bold text-white mb-2">Join as a Growth Partner</h2>
          <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
            Help local saree shops, bakers, grocery stores, and salons build an online presence. 
            <span className="text-accent-light font-semibold"> Earn flat ₹1,000 for every business that builds a website.</span>
          </p>

          <div className="bg-slate-900/80 rounded-xl p-3.5 border border-white/5 mb-6 text-xs text-slate-300">
            📌 <span className="font-bold text-white">No Qualification Requirement:</span> Any individual (student, home maker, shop helper, store assistant) can register and start earning immediately.
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={registration.name}
                onChange={handleRegisterChange}
                placeholder="e.g. Sunita Devi"
                className="w-full rounded-xl glass-input px-4 py-3 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">WhatsApp / Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={registration.phone}
                onChange={handleRegisterChange}
                placeholder="e.g. +91 98989 77777"
                className="w-full rounded-xl glass-input px-4 py-3 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">UPI ID (For Payouts)</label>
              <input
                type="text"
                name="upiId"
                value={registration.upiId}
                onChange={handleRegisterChange}
                placeholder="e.g. sunita@okhdfcbank"
                className="w-full rounded-xl glass-input px-4 py-3 text-sm"
                required
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Your commissions will be sent directly to this address.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Verified Gmail Account</label>
              <input
                type="email"
                name="email"
                value={registration.email}
                className="w-full rounded-xl bg-slate-950/60 border border-white/5 text-slate-500 px-4 py-3 text-sm cursor-not-allowed"
                readOnly
                disabled
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Linked to your signed-in Google account.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-4 text-sm font-bold text-white shadow-lg hover:opacity-90 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Partner Profile...
                </>
              ) : (
                'Create Partner Account'
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Partner Dashboard Portal */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Stats & Referral Tools */}
          <div className="lg:col-span-7 space-y-6">
            {/* Welcoming Details */}
            <div className="glass-panel rounded-2xl p-6 relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-950">
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/10 blur-2xl -z-10" />
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-1">Active Partner Portal</span>
                  <h2 className="text-2xl font-bold text-white">Welcome, {partner.name}!</h2>
                  {isEditingUpi ? (
                    <form onSubmit={handleSaveUpi} className="flex flex-wrap items-center gap-2 mt-2">
                      <input
                        type="text"
                        value={newUpi}
                        onChange={(e) => setNewUpi(e.target.value)}
                        className="rounded-lg bg-slate-950/80 border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:ring-1 focus:ring-primary min-w-[200px]"
                        required
                        placeholder="e.g. name@bank"
                      />
                      <button
                        type="submit"
                        disabled={upiLoading}
                        className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-[10px] font-bold text-white transition-all disabled:opacity-40 cursor-pointer"
                      >
                        {upiLoading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingUpi(false)}
                        className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-[10px] font-bold text-slate-300 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <p className="text-slate-400 text-xs">
                        UPI Wallet ID: <span className="font-mono text-slate-300">{partner.upiId}</span>
                      </p>
                      <button
                        onClick={handleStartEditUpi}
                        className="text-[10px] text-primary-light hover:text-white font-bold underline cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs text-rose-400 border border-rose-500/25 bg-rose-500/5 px-3 py-1.5 rounded-lg hover:bg-rose-500 hover:text-white transition-all"
                >
                  Disconnect Profile
                </button>
              </div>

              {/* Referral code copy widget */}
              <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">Your Referral Link</span>
                  <span className="text-xs text-slate-300 font-mono break-all">{`${window.location.origin}/analyzer?ref=${partner.referralCode}`}</span>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary hover:bg-primary-dark px-4 py-2.5 text-xs font-bold text-white transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Earnings stats dashboard */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-panel rounded-xl p-4 text-center">
                <div className="flex justify-center text-accent-light mb-1"><IndianRupee className="h-5 w-5" /></div>
                <span className="text-2xl font-black text-white">₹{partner.totalEarnings.toLocaleString('en-IN')}</span>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Total Earnings</p>
              </div>

              <div className="glass-panel rounded-xl p-4 text-center">
                <div className="flex justify-center text-primary-light mb-1"><Award className="h-5 w-5" /></div>
                <span className="text-2xl font-black text-white">{partner.referredSales?.length || 0}</span>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Successful Sales</p>
              </div>

              <div className="glass-panel rounded-xl p-4 text-center">
                <div className="flex justify-center text-slate-500 mb-1"><IndianRupee className="h-5 w-5" /></div>
                <span className="text-2xl font-black text-white">₹1,000</span>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Per-Sale payout</p>
              </div>
            </div>

            {/* Transactions Log & Simulation */}
            <div className="glass-panel rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Referred Sales Record</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Below are your referred business sales and payout audits.</p>
                </div>

                {/* Simulation button/trigger */}
                <form onSubmit={handleSimulateSale} className="flex gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    value={simulationName}
                    onChange={(e) => setSimulationName(e.target.value)}
                    placeholder="e.g. Om Saree Palace"
                    className="rounded-lg glass-input px-3 py-1.5 text-xs min-w-[140px] flex-1 sm:flex-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={simulatingSale}
                    className="inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Simulate Sale
                  </button>
                </form>
              </div>

              {/* Transactions List */}
              {(!partner.referredSales || partner.referredSales.length === 0) ? (
                <div className="text-center py-8 border border-dashed border-white/5 rounded-xl">
                  <p className="text-xs text-slate-500">No referred sales yet. Share your referral link or use the Simulator to test!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-400">
                    <thead>
                      <tr className="border-b border-white/5 text-slate-500">
                        <th className="pb-3 font-semibold">Business Name</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold">Commission</th>
                        <th className="pb-3 font-semibold text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {partner.referredSales.map((sale, i) => (
                        <tr key={sale._id || i}>
                          <td className="py-3 font-bold text-white">{sale.businessName}</td>
                          <td className="py-3">
                            <span className="inline-flex rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                              {sale.status}
                            </span>
                          </td>
                          <td className="py-3 font-bold text-accent-light">₹{sale.payoutAmount}</td>
                          <td className="py-3 text-right text-slate-500">{new Date(sale.dateAdded).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: AI Doubt-Clearing Advisor */}
          <div className="lg:col-span-5 flex flex-col h-[600px] glass-panel rounded-2xl overflow-hidden border border-white/8 bg-slate-900/30">
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-slate-950/60 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AI Partner Advisor</h3>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active - Doubt Clearing Helper
                </span>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatLog.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-slate-900 border border-white/5 text-slate-300 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-white/5 rounded-xl rounded-tl-none p-3.5 flex items-center gap-2 text-xs text-slate-400">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                    Advisor is typing pitch tips...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleAskAdvisor} className="p-3 bg-slate-950/60 border-t border-white/5 flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask e.g. How to pitch to a saree shop owner?"
                className="flex-1 rounded-xl glass-input px-3.5 py-2.5 text-xs"
              />
              <button
                type="submit"
                disabled={chatLoading || !query.trim()}
                className="rounded-xl bg-primary hover:bg-primary-dark p-2.5 text-white disabled:opacity-40 transition-all shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
