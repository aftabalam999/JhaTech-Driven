import React, { useState, useEffect } from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import PainPointAnalyzer from './pages/PainPointAnalyzer';
import Pricing from './pages/Pricing';
import PartnerPortal from './pages/PartnerPortal';
import CompetitorAnalyzer from './pages/CompetitorAnalyzer';

export default function App() {
  const [searchParams] = useSearchParams();
  
  // Google User Auth Session State
  const [googleUser, setGoogleUser] = useState(() => {
    const saved = localStorage.getItem('googleUser');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      console.log('Captured Referral Partner Code:', ref);
      localStorage.setItem('activeReferralCode', ref);
    }
  }, [searchParams]);

  const handleLogin = (user) => {
    setGoogleUser(user);
    localStorage.setItem('googleUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setGoogleUser(null);
    localStorage.removeItem('googleUser');
    localStorage.removeItem('partnerReferralCode');
  };

  return (
    <div className="flex flex-col min-h-screen bg-darkBg text-slate-100 font-sans">
      <Navbar 
        googleUser={googleUser} 
        onTriggerLogin={() => setShowAuthModal(true)} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyzer" element={<PainPointAnalyzer />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route 
            path="/referral" 
            element={
              <PartnerPortal 
                googleUser={googleUser} 
                onTriggerLogin={() => setShowAuthModal(true)} 
              />
            } 
          />
          <Route path="/competitor" element={<CompetitorAnalyzer />} />
        </Routes>
      </main>

      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onLogin={handleLogin} 
        />
      )}

      <AIChatbot />
      <Footer />
    </div>
  );
}
