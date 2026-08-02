import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, Menu, X, ArrowUpRight } from 'lucide-react';

// Self-healing avatar fallback component
function NavbarAvatar({ user, size = 'h-8 w-8' }) {
  const [imgError, setImgError] = useState(false);
  const initials = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  if (!user?.picture || imgError) {
    return (
      <div className={`${size} rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-xs font-black text-white shrink-0 border border-white/10`}>
        {initials}
      </div>
    );
  }

  return (
    <img
      src={user.picture}
      alt={user.name}
      onError={() => setImgError(true)}
      className={`${size} rounded-full border border-primary/20 shrink-0 object-cover`}
    />
  );
}

export default function Navbar({ googleUser, onTriggerLogin, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Growth Analyzer', path: '/analyzer' },
    { name: 'Pricing & ROI', path: '/pricing' },
    { name: 'Referral Program', path: '/referral' },
    { name: 'Competitor SWOT', path: '/competitor' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-darkBg/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-accent text-white shadow-lg shadow-primary/20 transition-all duration-300 group-hover:scale-105">
                <Bot className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-primary-light">
                JhaTech <span className="text-accent">Growth</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:block">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-all duration-300 relative py-1 ${
                    isActive(link.path)
                      ? 'text-primary-light font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-primary to-accent" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA & User Login Container */}
          <div className="hidden md:flex items-center gap-4">
            {googleUser ? (
              <div className="flex items-center gap-3 bg-slate-900/90 border border-white/5 pl-2 pr-4 py-1.5 rounded-full">
                <NavbarAvatar user={googleUser} size="h-8 w-8" />
                <div className="text-left">
                  <span className="block text-[11px] font-bold text-white max-w-[90px] truncate leading-tight">{googleUser.name}</span>
                  <button
                    onClick={onLogout}
                    className="block text-[9px] text-rose-400 hover:text-rose-300 font-bold tracking-wide uppercase mt-0.5 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onTriggerLogin}
                className="rounded-xl border border-slate-700/60 bg-slate-805 hover:bg-slate-700/60 px-4.5 py-2 text-sm font-semibold text-white shadow-md transition-all cursor-pointer"
              >
                Sign In
              </button>
            )}

            <Link
              to="/analyzer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/35 focus:outline-none"
            >
              Analyze Business
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/5 bg-darkBg/95 backdrop-blur-lg">
          <div className="space-y-1 px-4 py-6 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-white/5 mt-4 space-y-3">
              {googleUser ? (
                <div className="flex items-center justify-between bg-slate-900 border border-white/5 p-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <NavbarAvatar user={googleUser} size="h-9 w-9" />
                    <div className="text-left">
                      <span className="block text-xs font-bold text-white">{googleUser.name}</span>
                      <span className="block text-[10px] text-slate-500 max-w-[150px] truncate">{googleUser.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="text-xs text-rose-400 font-semibold border border-rose-500/25 bg-rose-500/5 px-3 py-1.5 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onTriggerLogin();
                    setIsOpen(false);
                  }}
                  className="w-full text-center rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/60 py-3 text-base font-semibold text-white shadow-sm"
                >
                  Sign In with Google
                </button>
              )}

              <Link
                to="/analyzer"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-4 py-3 text-base font-semibold text-white shadow-md"
              >
                Analyze Business
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
