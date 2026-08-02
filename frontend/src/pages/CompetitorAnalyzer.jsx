import React, { useState } from 'react';
import { Sparkles, TrendingUp, ShieldAlert, Award, Compass, Search, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function CompetitorAnalyzer() {
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'Saree Shop',
    competitorNames: ''
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.businessName || !formData.competitorNames) {
      setError('Please fill in your business name and competitor names.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/competitor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setResults(data);
      } else {
        setError(data.error || 'Failed to analyze competitor presence.');
      }
    } catch (err) {
      setError('Cannot connect to the SWOT analysis backend. Make sure the backend server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          AI Competitor <span className="text-cyan-400">SWOT & Trends</span>
        </h1>
        <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
          Analyze what your local rivals are doing online and get AI recommendations on trending features to implement to win customers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Search className="h-5 w-5 text-cyan-400" />
            Competitor Audit Input
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                placeholder="e.g. Laxmi Handloom"
                className="w-full rounded-xl glass-input px-4 py-3 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Business Type</label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className="w-full rounded-xl glass-input px-3 py-3 text-sm"
              >
                <option value="Saree Shop">Saree Shop / Boutique</option>
                <option value="Grocery Store">Kirana / Grocery Store</option>
                <option value="Bakery / Cafe">Bakery / Cafe</option>
                <option value="Beauty Salon">Beauty Salon / Spa</option>
                <option value="Jewelry Shop">Jewelry Shop</option>
                <option value="Other Business">Other Local Shop</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Competitors to Analyze</label>
              <textarea
                name="competitorNames"
                value={formData.competitorNames}
                onChange={handleInputChange}
                rows="3"
                placeholder="e.g. Meena Bazar, local retail shops in Karol Bagh"
                className="w-full rounded-xl glass-input px-4 py-3 text-sm"
                required
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Separate multiple competitors with commas.</span>
            </div>

            {error && (
              <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:opacity-95 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  AI Swot Analysis...
                </>
              ) : (
                'Run Competitor SWOT'
              )}
            </button>
          </form>
        </div>

        {/* SWOT Output Column */}
        <div className="lg:col-span-8 space-y-6">
          {!results && !loading && (
            <div className="glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center border-dashed border-white/10 h-full min-h-[420px]">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-slate-500 border border-white/5 mb-4">
                <TrendingUp className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Competitor SWOT Performed</h3>
              <p className="text-slate-400 text-xs sm:text-sm max-w-sm">
                Enter your competitor details on the left. The AI model will scan their strengths and generate features to place you ahead of digital trends.
              </p>
            </div>
          )}

          {loading && (
            <div className="glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[420px]">
              <Loader2 className="h-10 w-10 text-cyan-400 animate-spin mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Analyzing Competitor Footprint</h3>
              <p className="text-slate-400 text-xs sm:text-sm max-w-xs animate-pulse">
                Mapping competitor search tags, loading speed benchmarks, catalog formats, and 2026 digital consumer trends...
              </p>
            </div>
          )}

          {results && (
            <div className="space-y-6 animate-fadeIn">
              {/* SWOT Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="glass-panel rounded-xl p-5 border-l-4 border-l-emerald-500">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Award className="h-4 w-4" />
                    Strengths (S)
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {results.swotAnalysis?.strengths?.map((str, idx) => (
                      <li key={idx} className="leading-relaxed">• {str}</li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="glass-panel rounded-xl p-5 border-l-4 border-l-rose-500">
                  <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4" />
                    Weaknesses (W)
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {results.swotAnalysis?.weaknesses?.map((str, idx) => (
                      <li key={idx} className="leading-relaxed">• {str}</li>
                    ))}
                  </ul>
                </div>

                {/* Opportunities */}
                <div className="glass-panel rounded-xl p-5 border-l-4 border-l-amber-500">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Compass className="h-4 w-4" />
                    Opportunities (O)
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {results.swotAnalysis?.opportunities?.map((str, idx) => (
                      <li key={idx} className="leading-relaxed">• {str}</li>
                    ))}
                  </ul>
                </div>

                {/* Threats */}
                <div className="glass-panel rounded-xl p-5 border-l-4 border-l-purple-500">
                  <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" />
                    Threats (T)
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {results.swotAnalysis?.threats?.map((str, idx) => (
                      <li key={idx} className="leading-relaxed">• {str}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Website Features based on Trends */}
              <div className="glass-panel rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-1 flex items-center gap-1.5">
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                  Trending Features for Digital Edge
                </h3>
                <p className="text-xs text-slate-400 mb-6">Website features recommended by AI to overcome your competitor threats:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {results.recommendedFeatures?.map((feature, idx) => (
                    <div key={idx} className="rounded-xl border border-white/5 bg-slate-950/40 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-bold text-white">{feature.featureName}</h4>
                          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                            feature.complexity === 'Low' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : feature.complexity === 'Medium'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {feature.complexity} Code
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{feature.description}</p>
                      </div>
                      
                      <div className="border-t border-white/5 pt-2 mt-2">
                        <span className="text-[9px] font-semibold text-cyan-300 block">Trend Driver:</span>
                        <p className="text-[10px] text-slate-500 leading-normal italic">{feature.marketTrendDriver}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Market Insights List */}
              <div className="glass-panel rounded-2xl p-6">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">Consumer Market Insights</h3>
                <ul className="space-y-2 text-xs text-slate-400">
                  {results.marketTrends?.map((trend, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 shrink-0">📈</span>
                      <span>{trend}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
