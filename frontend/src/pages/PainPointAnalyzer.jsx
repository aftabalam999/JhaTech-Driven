import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, HelpCircle, AlertCircle, CheckCircle, Sparkles, MessageCircle, ArrowRight, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function PainPointAnalyzer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ownerName: '',
    businessName: '',
    businessType: 'Saree Shop',
    phone: '',
    challenges: [],
    customChallenges: '',
    digitalPresence: 'None'
  });

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [refCode, setRefCode] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('activeReferralCode');
    if (saved) {
      setRefCode(saved);
    }
  }, []);

  const commonChallenges = [
    { id: 'no_site', label: 'No official website / online catalog' },
    { id: 'low_footfall', label: 'Fewer walk-in customers visiting the shop' },
    { id: 'online_comp', label: 'Big online sites (Myntra/Amazon) taking customers' },
    { id: 'marketing_doubt', label: 'Do not know how to run Facebook/Instagram Ads' },
    { id: 'no_google_maps', label: 'Shop is not visible on Google Maps search' },
    { id: 'order_sharing', label: 'Manually sharing catalog pictures on WhatsApp takes too much time' },
  ];

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChallengeToggle = (challengeLabel) => {
    setFormData((prev) => {
      const current = prev.challenges;
      if (current.includes(challengeLabel)) {
        return { ...prev, challenges: current.filter((c) => c !== challengeLabel) };
      } else {
        return { ...prev, challenges: [...current, challengeLabel] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.ownerName || !formData.businessName || !formData.phone) {
      setError('Please fill in your name, business name, and phone number.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setReport(data.aiReport);
      } else {
        setError(data.error || 'Failed to analyze business challenges.');
      }
    } catch (err) {
      setError('Cannot connect to the AI analysis backend. Please make sure the backend server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppInquiry = () => {
    if (!report) return;
    const refSuffix = refCode ? `\n*Referral Partner Code:* ${refCode}` : '';
    const text = `Hi JhaTech Team! I just completed the Business Growth Audit.
*Business:* ${formData.businessName} (${formData.businessType})
*Owner:* ${formData.ownerName}
*Summary Recommendation:* ${report.summary}
*Proposed Budget:* Website Dev ~₹${report.estimatedCosts.websiteDevelopment}, Marketing ~₹${report.estimatedCosts.monthlyMarketing}/mo.${refSuffix}
I want to discuss launching this project!`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/919876543210?text=${encoded}`, '_blank');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          AI Business Growth <span className="text-primary-light">Analyzer</span>
        </h1>
        <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
          Submit details about your shop or local business. Our AI engine will immediately analyze market gaps and deliver a personalized website & marketing roadmap.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Audit Questionnaire
          </h2>

          {refCode && (
            <div className="mb-5 text-xs bg-accent/10 border border-accent/20 rounded-xl p-3 text-accent-light flex items-center gap-2 font-medium">
              <CheckCircle className="h-4 w-4 text-accent shrink-0" />
              <span>Referred by Partner Code: <span className="font-mono text-white bg-slate-900 px-1.5 py-0.5 rounded">{refCode}</span></span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Owner Name</label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleTextChange}
                placeholder="e.g. Ramesh Kumar"
                className="w-full rounded-xl glass-input px-4 py-3 text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleTextChange}
                  placeholder="e.g. Kumar Saree Niketan"
                  className="w-full rounded-xl glass-input px-4 py-3 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Business Type</label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleTextChange}
                  className="w-full rounded-xl glass-input px-3 py-3 text-sm focus:ring-1 focus:ring-primary"
                >
                  <option value="Saree Shop">Saree Shop / Boutique</option>
                  <option value="Grocery Store">Kirana / Grocery Store</option>
                  <option value="Bakery / Cafe">Bakery / Cafe</option>
                  <option value="Beauty Salon">Beauty Salon / Spa</option>
                  <option value="Jewelry Shop">Jewelry Shop</option>
                  <option value="Electronics Shop">Electronics Shop</option>
                  <option value="Other Business">Other Local Shop</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">WhatsApp / Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleTextChange}
                placeholder="e.g. +91 99999 88888"
                className="w-full rounded-xl glass-input px-4 py-3 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Current Digital Presence</label>
              <select
                name="digitalPresence"
                value={formData.digitalPresence}
                onChange={handleTextChange}
                className="w-full rounded-xl glass-input px-3 py-3 text-sm"
              >
                <option value="None">None (Purely Offline)</option>
                <option value="Social Only">Only Instagram / Facebook Page</option>
                <option value="Maps Only">Only Google Maps Location</option>
                <option value="Basic Site">Have a basic outdated website</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Select Your Challenges</label>
              <div className="space-y-2 mt-2">
                {commonChallenges.map((challenge) => (
                  <label
                    key={challenge.id}
                    className={`flex items-start gap-2.5 rounded-xl border p-3 cursor-pointer transition-all duration-200 text-xs sm:text-sm ${
                      formData.challenges.includes(challenge.label)
                        ? 'border-primary/50 bg-primary/10 text-white'
                        : 'border-white/5 bg-slate-900/30 text-slate-400 hover:border-slate-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5 rounded border-slate-700 bg-slate-950 text-primary focus:ring-primary"
                      checked={formData.challenges.includes(challenge.label)}
                      onChange={() => handleChallengeToggle(challenge.label)}
                    />
                    <span>{challenge.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Any Other Specific Problems?</label>
              <textarea
                name="customChallenges"
                value={formData.customChallenges}
                onChange={handleTextChange}
                rows="2"
                placeholder="e.g. Competitor across the street runs meta ads and gives door-to-door delivery..."
                className="w-full rounded-xl glass-input px-4 py-3 text-sm"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs text-rose-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-4 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:opacity-90 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  AI Analysing Local Retail Gaps...
                </>
              ) : (
                <>
                  Generate AI Growth Report
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Report Output Column */}
        <div className="lg:col-span-7 space-y-6">
          {!report && !loading && (
            <div className="glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center border-dashed border-white/10 h-full min-h-[400px]">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-slate-500 border border-white/5 mb-4">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Report Generated Yet</h3>
              <p className="text-slate-400 text-xs sm:text-sm max-w-sm">
                Fill out the business questionnaire on the left. JhaTech AI will calculate digital roadmap features, local promotional channels, and initial costs.
              </p>
            </div>
          )}

          {loading && (
            <div className="glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Engaging Digital Growth Models</h3>
              <p className="text-slate-400 text-xs sm:text-sm max-w-xs animate-pulse">
                Analyzing saree catalogs, local maps, SEO keywords, and dynamic pricing metrics to build your strategy...
              </p>
            </div>
          )}

          {report && (
            <div className="space-y-6 animate-fadeIn">
              {/* Executive Summary */}
              <div className="glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 rounded-bl-xl bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-light flex items-center gap-1 border-l border-b border-white/5">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Verified Roadmap
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Executive Digital Summary</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{report.summary}</p>
              </div>

              {/* Website Recommendations */}
              <div className="glass-panel rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Recommended Website Features</h3>
                <div className="space-y-4">
                  {report.websiteRecommendations?.map((feature, idx) => (
                    <div key={idx} className="border-b border-white/5 pb-4 last:border-b-0 last:pb-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h4 className="text-sm font-bold text-white">{feature.featureName}</h4>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          feature.priority === 'High' 
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : feature.priority === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {feature.priority} Priority
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-1.5">{feature.description}</p>
                      <p className="text-xs text-accent-light font-medium flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 shrink-0" />
                        Value: {feature.valueAdd}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Marketing Recommendations */}
              <div className="glass-panel rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Digital Marketing Channels</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {report.marketingStrategy?.map((strat, idx) => (
                    <div key={idx} className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
                      <span className="text-xs font-bold text-primary-light uppercase tracking-wider block mb-1">
                        {strat.channel}
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed mb-2">{strat.tactic}</p>
                      <div className="text-[10px] text-slate-500">
                        Expected ROI: <span className="text-accent-light font-semibold">{strat.roiExpectation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Estimator & Call to action */}
              <div className="glass-panel rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 mb-1">Estimated Investments</h4>
                  <div className="flex gap-4">
                    <div>
                      <span className="text-xs text-slate-500 block">Website Dev</span>
                      <span className="text-lg font-extrabold text-white">₹{report.estimatedCosts?.websiteDevelopment || '15,000'}</span>
                    </div>
                    <div className="border-l border-white/5 pl-4">
                      <span className="text-xs text-slate-500 block">Monthly Marketing</span>
                      <span className="text-lg font-extrabold text-white">₹{report.estimatedCosts?.monthlyMarketing || '5,000'}/mo</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => navigate('/pricing')}
                    className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-700/50 transition-all text-center"
                  >
                    Custom Quote Builder
                  </button>
                  <button
                    onClick={handleWhatsAppInquiry}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-900/20"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Enquire on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
