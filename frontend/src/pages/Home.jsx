import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, ArrowRight, Zap, Target, Award, LineChart, ShieldCheck, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative overflow-hidden pt-12 pb-24">
      {/* Background blobs for premium glow */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/10 to-accent/15 blur-3xl opacity-50 animate-glow" />
      <div className="absolute top-10 right-10 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl opacity-30" />
      <div className="absolute bottom-10 left-10 -z-10 h-96 w-96 rounded-full bg-accent/5 blur-3xl opacity-30" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center py-12 md:py-20">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 px-3 py-1 text-xs font-semibold text-slate-300 border border-slate-700/50 mb-6 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            AI-Powered Local Digital Transformation
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl mb-6">
            Grow Your Local Business <br />
            <span className="gradient-text font-black">With the Power of AI</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base text-slate-400 sm:text-lg md:text-xl leading-relaxed mb-10">
            Get automated pain-point audits, custom website designs, transparent pricing quotes, and real-time competitor SWOT analysis—all curated by digital marketing experts and AI models.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/analyzer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Analyze Your Business Now
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/referral"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 border border-slate-700/60 hover:bg-slate-700/50 px-8 py-4 text-base font-bold text-white transition-all duration-300 hover:-translate-y-0.5"
            >
              Join as Referral Partner
              <Award className="h-5 w-5 text-accent" />
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              One platform. Four robust growth engines.
            </h2>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto text-sm">
              We make it incredibly simple for local shops (like saree shops, grocery stores, cafes) to step into the digital age.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Pain Point Analyzer */}
            <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-primary mb-5 border border-primary/20">
                  <Bot className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Pain-Point Analyzer</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Select your business challenges (low customer footfall, no site, competitor pressure) and get a free custom AI marketing report in seconds.
                </p>
              </div>
              <Link to="/analyzer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-light hover:underline pt-2 group">
                Audit Your Shop
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Card 2: Pricing & Value */}
            <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-accent mb-5 border border-accent/20">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Transparent Pricing</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  No hidden costs. Slide and select features (E-commerce cart, Google Maps integration, SEO) to calculate costs and enquire directly on WhatsApp.
                </p>
              </div>
              <Link to="/pricing" className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-light hover:underline pt-2 group">
                Check Cost Estimator
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Card 3: Referral Partner */}
            <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 mb-5 border border-amber-500/20">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Referral Program</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Earn ₹1,000 cash for every successful client. No degree or experience needed. Clear doubts using our dedicated AI referral assistant.
                </p>
              </div>
              <Link to="/referral" className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:underline pt-2 group">
                Start Earning
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Card 4: Competitor Analysis */}
            <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 mb-5 border border-cyan-500/20">
                  <LineChart className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Competitor SWOT</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Input your business details and competitor names. Receive an instant SWOT profile and recommendations for trending modern website features.
                </p>
              </div>
              <Link to="/competitor" className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:underline pt-2 group">
                Analyze Competitors
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Small Trust Pitch Section */}
        <div className="glass-panel rounded-3xl p-8 md:p-12 mt-24 border border-white/5 bg-slate-900/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/5 blur-2xl -z-10" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Empowering Saree Shops & Local Retailers
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Are you a local clothing vendor, a handloom seller, a boutique owner, or a restaurant owner? We help you get:
              </p>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  Your business mapped on Google Search & Maps.
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  WhatsApp Catalog ordering so customers buy in one-click.
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  Stunning visual reels & flyer designs generated by AI.
                </li>
              </ul>
            </div>
            <div className="flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-accent opacity-30 blur group-hover:opacity-50 transition duration-300" />
                <div className="relative rounded-2xl bg-slate-950 p-6 max-w-sm border border-white/10">
                  <h4 className="text-sm font-semibold text-white mb-2">Example WhatsApp Success:</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    "A customer browses a saree online, clicks 'Enquire', and instantly sends an automated text to the shop owner: <span className="text-accent italic">'Hello! I am interested in buying the Banarasi Silk Saree (Ref: S-129) shown on your site...'</span>"
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Fast, Simple & Effective.</span>
                    <Link to="/pricing" className="text-xs font-semibold text-primary-light flex items-center gap-0.5 hover:underline">
                      See Demo
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
