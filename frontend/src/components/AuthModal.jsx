import React, { useState, useEffect } from 'react';
import { Bot, X, Mail, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';

export default function AuthModal({ onClose, onLogin }) {
  const [testEmail, setTestEmail] = useState('rahulkumar@gmail.com');
  const [testName, setTestName] = useState('Rahul Kumar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const initGoogleAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/config');
        const data = await response.json();
        if (data.googleClientId && window.google) {
          window.google.accounts.id.initialize({
            client_id: data.googleClientId,
            callback: handleGoogleCallback,
          });
          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-button-div'),
            { theme: 'dark', size: 'large', shape: 'pill', width: 300 }
          );
        }
      } catch (err) {
        console.warn('Failed to retrieve Google Auth Client ID from backend:', err);
      }
    };
    initGoogleAuth();
  }, []);

  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const handleGoogleCallback = (response) => {
    setLoading(true);
    const decoded = decodeJWT(response.credential);
    if (decoded) {
      const user = {
        name: decoded.name || 'Google User',
        email: decoded.email,
        picture: decoded.picture || 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        method: 'Google Account'
      };
      onLogin(user);
      onClose();
    } else {
      setError('Failed to process Google login credentials.');
    }
    setLoading(false);
  };

  const handleSimulateSubmit = (e) => {
    e.preventDefault();
    if (!testEmail || !testName) {
      setError('Please provide a simulation name and email.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // Simulate successful base64-like login
      const user = {
        name: testName,
        email: testEmail.toLowerCase().trim(),
        picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${testName}`,
        method: 'Simulated Gmail'
      };
      onLogin(user);
      setLoading(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-md glass-panel rounded-2xl p-6 sm:p-8 overflow-hidden shadow-2xl border border-white/10 bg-slate-900/90">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white rounded-lg p-1.5 hover:bg-slate-800 transition-all"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-accent text-white shadow-lg shadow-primary/20 mb-4">
            <Bot className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Log in with Google</h2>
          <p className="text-xs text-slate-400 mt-1">Connect your Gmail account to manage your digital dashboard.</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400 flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
            <span className="text-xs text-slate-400">Verifying security tokens...</span>
          </div>
        )}

        {!loading && (
          <div className="space-y-6">
            {/* Real Google Auth Placeholder */}
            <div className="flex flex-col items-center justify-center p-2.5 bg-slate-950/50 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Google Identity Login</span>
              <div id="google-signin-button-div" className="min-h-[40px] flex items-center justify-center">
                <span className="text-xs text-slate-400 italic">Google script loading or ready...</span>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 text-slate-500">
              <span className="h-[1px] bg-white/5 flex-grow" />
              <span className="text-[10px] font-bold uppercase tracking-widest">or Simulator</span>
              <span className="h-[1px] bg-white/5 flex-grow" />
            </div>

            {/* Test Simulation login */}
            <form onSubmit={handleSimulateSubmit} className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-[11px] text-amber-300 leading-normal">
                💡 <span className="font-bold">OAuth Dev Notice:</span> To test locally without setting up the Google developer dashboard domain redirect, you can enter any dummy name/email below to simulate a successful Gmail login.
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Test Full Name</label>
                <input
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Test Gmail Address</label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 px-4 py-3 text-xs font-bold text-white transition-all"
              >
                <Mail className="h-4 w-4 text-accent" />
                Simulate Gmail Login
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
