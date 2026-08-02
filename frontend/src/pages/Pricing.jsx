import React, { useState } from 'react';
import { Check, Info, MessageCircle, HelpCircle, ArrowRight } from 'lucide-react';

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState('catalog'); // 'showcase' | 'catalog' | 'ecommerce'
  const [addons, setAddons] = useState({
    googleMaps: true,
    localSeo: false,
    whatsappBot: false,
    bannerKit: true,
    monthlyAds: false
  });

  const plans = {
    showcase: {
      name: 'Single Page Showcase',
      price: 8000,
      description: 'Ideal for small local shops wanting a simple Google map banner, contact hours, and basic details.',
      features: [
        'Responsive Mobile-First Design',
        'Google Map & Address Listing',
        'One-Click WhatsApp Enquiry',
        'Hosting Setup Assistance',
        '1 Month Free Tech Support'
      ],
      valueProp: 'Brings your offline physical shop onto the web, building trust for local shoppers looking up your name.'
    },
    catalog: {
      name: 'Multi-Page Business Catalog',
      price: 15000,
      description: 'Best for Saree shops, boutiques, and cafes. Displays a complete catalog categorized beautifully.',
      features: [
        'All Showcase Features included',
        'Up to 150 Products / Saree Listings',
        'Category Filtering (e.g. Silk, Cotton)',
        'Click-to-Enquire WhatsApp prefilled links',
        'Social Media Integrations',
        '3 Months Free Support'
      ],
      valueProp: 'Prevents customer dropoffs. Instead of sending 100 saree photos manually, send a single link where they browse and order.'
    },
    ecommerce: {
      name: 'Full E-commerce Shop',
      price: 25000,
      description: 'Complete digital shop with active cart, local delivery calculation, and automated UPI QR payments.',
      features: [
        'All Catalog Features included',
        'Unlimited Product Uploads',
        'Interactive Shopping Cart & Checkout',
        'UPI / Payment Gateway Integration',
        'Orders Management Dashboard',
        '6 Months Free Support'
      ],
      valueProp: 'Gives you the same power as Amazon or Myntra. Customers order and pay digitally without waiting for a phone call.'
    }
  };

  const addOnDetails = [
    { id: 'googleMaps', name: 'Google Maps / Business Listing Setup', price: 2000, type: 'one-time', desc: 'Optimizes search terms like "Saree shop near me" on Google Maps.' },
    { id: 'localSeo', name: 'Local SEO Ranking keywords', price: 3000, type: 'one-time', desc: 'Boosts organic website traffic from search engines without paid ads.' },
    { id: 'whatsappBot', name: 'Automated WhatsApp FAQ Bot', price: 4000, type: 'one-time', desc: 'Autoreplies to customers asking for address, timing, or catalogs 24/7.' },
    { id: 'bannerKit', name: 'Reels & Social Banner Kit', price: 2500, type: 'one-time', desc: '10 custom designed graphic templates for Instagram / Facebook promotions.' },
    { id: 'monthlyAds', name: 'Monthly Ads Management (Meta/Google)', price: 5000, type: 'monthly', desc: 'We construct and run local Instagram/FB ads to bring store footfall.' }
  ];

  const handleAddonToggle = (id) => {
    setAddons(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Calculate totals
  const basePrice = plans[selectedPlan].price;
  const oneTimeAddonTotal = addOnDetails
    .filter(a => addons[a.id] && a.type === 'one-time')
    .reduce((sum, item) => sum + item.price, 0);
  const monthlyAddonTotal = addOnDetails
    .filter(a => addons[a.id] && a.type === 'monthly')
    .reduce((sum, item) => sum + item.price, 0);

  const totalSetupCost = basePrice + oneTimeAddonTotal;
  const totalMonthlyCost = monthlyAddonTotal;

  const handleWhatsAppCheckout = () => {
    const chosenAddons = addOnDetails
      .filter(a => addons[a.id])
      .map(a => `- ${a.name} (₹${a.price}${a.type === 'monthly' ? '/mo' : ''})`)
      .join('\n');

    const text = `Hi JhaTech! I configured a custom website plan on your Pricing Builder.
*Plan:* ${plans[selectedPlan].name} (₹${basePrice})
*Add-ons Selected:*
${chosenAddons || 'None'}

*Total Setup Cost:* ₹${totalSetupCost}
*Total Monthly Recurring:* ₹${totalMonthlyCost}/mo

I want to discuss starting the development. Please guide me on next steps!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/919876543210?text=${encoded}`, '_blank');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center mb-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          Transparent, No-Jargon <span className="text-accent-light">Pricing</span>
        </h1>
        <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
          Choose a base website template and select only the add-ons you need. See exactly where every single Rupee goes.
        </p>
      </div>

      {/* Plan selection grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {Object.entries(plans).map(([key, plan]) => (
          <div
            key={key}
            onClick={() => setSelectedPlan(key)}
            className={`glass-panel rounded-2xl p-6 relative cursor-pointer transition-all duration-300 flex flex-col justify-between border-2 ${
              selectedPlan === key
                ? 'border-primary ring-2 ring-primary/20 shadow-primary/10'
                : 'border-white/5 opacity-80 hover:opacity-100 hover:border-white/10'
            }`}
          >
            {key === 'catalog' && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-[10px] font-bold text-slate-950 uppercase tracking-widest">
                Most Popular
              </span>
            )}
            
            <div>
              <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline text-white gap-1 mb-4">
                <span className="text-3xl font-extrabold">₹{plan.price.toLocaleString('en-IN')}</span>
                <span className="text-slate-400 text-xs">One-time</span>
              </div>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">{plan.description}</p>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feat, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-white/5 pt-4 mt-4">
              <span className="text-[10px] font-semibold text-accent uppercase tracking-wider block mb-1">Value Advantage:</span>
              <p className="text-xs text-slate-400 italic leading-relaxed">{plan.valueProp}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add-ons Builder & Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Add-ons Checklist */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8">
          <h3 className="text-lg font-bold text-white mb-6">Configure Add-on Services</h3>
          
          <div className="space-y-4">
            {addOnDetails.map((addon) => (
              <div
                key={addon.id}
                onClick={() => handleAddonToggle(addon.id)}
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  addons[addon.id]
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-white/5 hover:border-slate-800 bg-slate-950/20'
                }`}
              >
                <input
                  type="checkbox"
                  checked={addons[addon.id]}
                  onChange={() => {}} // Controlled via card div onClick
                  className="mt-1 rounded border-slate-700 bg-slate-950 text-primary focus:ring-primary"
                />
                
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="text-sm font-bold text-white">{addon.name}</h4>
                    <span className="text-xs font-extrabold text-slate-200">
                      +₹{addon.price.toLocaleString('en-IN')} 
                      <span className="text-[10px] text-slate-500 font-normal"> ({addon.type})</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{addon.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summing Invoice Box */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-slate-900 to-slate-950">
          <h3 className="text-lg font-bold text-white mb-4">Investment Summary</h3>
          
          <div className="space-y-3.5 border-b border-white/5 pb-4 mb-4 text-xs sm:text-sm text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Base Website:</span>
              <span className="font-semibold text-white">₹{basePrice.toLocaleString('en-IN')}</span>
            </div>
            
            {addOnDetails.filter(a => addons[a.id]).map(a => (
              <div key={a.id} className="flex justify-between text-xs">
                <span className="text-slate-400 text-left pr-4">{a.name}:</span>
                <span className="font-semibold text-slate-200 shrink-0">
                  ₹{a.price.toLocaleString('en-IN')}{a.type === 'monthly' ? '/mo' : ''}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-baseline">
              <span className="text-xs sm:text-sm text-slate-400">Total Setup Investment:</span>
              <span className="text-2xl font-extrabold text-accent-light">₹{totalSetupCost.toLocaleString('en-IN')}</span>
            </div>
            {totalMonthlyCost > 0 && (
              <div className="flex justify-between items-baseline border-t border-dashed border-white/5 pt-2">
                <span className="text-xs text-slate-400">Monthly Marketing Retainer:</span>
                <span className="text-base font-extrabold text-white">₹{totalMonthlyCost.toLocaleString('en-IN')}/mo</span>
              </div>
            )}
          </div>

          <div className="rounded-xl bg-slate-900/80 p-4 border border-white/5 mb-6 text-xs text-slate-400 leading-relaxed">
            <div className="flex gap-2 items-start">
              <Info className="h-4 w-4 text-primary-light shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-300">UPI/Pay Payout Guarantee:</span>
                <p className="mt-1">
                  We collect 50% advance and 50% only after your website is live and approved. Every package comes with a detailed receipt and a dedicated developer WhatsApp chat support group.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleWhatsAppCheckout}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-950/20 transition-all duration-300 hover:-translate-y-0.5"
          >
            <MessageCircle className="h-5 w-5" />
            Discuss Quote on WhatsApp
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
