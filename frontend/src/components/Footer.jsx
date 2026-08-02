import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, MessageCircle, Phone, Mail, Award } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-slate-950/80 text-slate-400 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo & Pitch */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-accent text-white shadow-md">
                <Bot className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">JhaTech Growth</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Accelerating local Indian retail and services into the digital era with easy-to-use websites and AI-powered growth tools.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/analyzer" className="hover:text-white transition-colors">Growth Analyzer</Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">Pricing & Calculator</Link>
              </li>
              <li>
                <Link to="/competitor" className="hover:text-white transition-colors">Competitor SWOT</Link>
              </li>
            </ul>
          </div>

          {/* Referral Partner Info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Earn Money</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/referral" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Award className="h-4 w-4 text-accent" />
                  Referral Partner Program
                </Link>
              </li>
              <li>
                <span className="text-xs bg-accent/10 text-accent-light px-2 py-0.5 rounded-full font-medium">
                  Earn ₹1,000 per sale
                </span>
              </li>
              <li>
                <span className="text-xs text-slate-500">No Qualification Required</span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact Us</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:support@jhatechgrowth.com" className="hover:text-white transition-colors">
                  support@jhatechgrowth.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 98765 43210</span>
              </li>
              <li className="pt-2">
                <a
                  href="https://wa.me/919876543210?text=Hi!%20I%20want%20to%20know%20more%20about%20JhaTech%20Digital%20Growth%20Platform."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-green-600/10 border border-green-500/25 px-3 py-1.5 text-xs text-green-400 hover:bg-green-600 hover:text-white transition-all"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-8 text-center text-xs">
          <p>&copy; {currentYear} JhaTech Growth. Empowering small businesses to thrive online.</p>
        </div>
      </div>
    </footer>
  );
}
