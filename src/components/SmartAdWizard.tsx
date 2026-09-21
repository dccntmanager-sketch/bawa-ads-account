import React, { useState } from 'react';
import { BusinessProfile, Campaign, PlatformType, CampaignObjective } from '../types';
import { 
  Sparkles, 
  Target, 
  DollarSign, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw, 
  Layers, 
  MapPin, 
  Globe, 
  Smartphone, 
  AlertCircle,
  TrendingUp,
  Sliders,
  CheckCircle2,
  X
} from 'lucide-react';

interface SmartAdWizardProps {
  business: BusinessProfile;
  isOpen: boolean;
  onClose: () => void;
  onLaunchCampaign: (newCampaign: Campaign) => void;
}

export const SmartAdWizard: React.FC<SmartAdWizardProps> = ({
  business,
  isOpen,
  onClose,
  onLaunchCampaign,
}) => {
  const [step, setStep] = useState<number>(1);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [previewPlatform, setPreviewPlatform] = useState<'google' | 'meta' | 'tiktok'>('google');

  // Form State
  const [campaignName, setCampaignName] = useState<string>(`${business.name} | Growth Promo`);
  const [industry, setIndustry] = useState<string>(business.industry || 'Health & Fitness');
  const [objective, setObjective] = useState<CampaignObjective>('leads');
  const [platform, setPlatform] = useState<PlatformType>('google');
  const [offer, setOffer] = useState<string>('Exclusive 20% Off Limited Trial Pass');
  const [location, setLocation] = useState<string>(business.location || 'Local Metro Area');
  const [radiusMiles, setRadiusMiles] = useState<number>(15);
  const [ageMin, setAgeMin] = useState<number>(24);
  const [ageMax, setAgeMax] = useState<number>(54);
  const [dailyBudget, setDailyBudget] = useState<number>(35);

  // AI Generated Creative State
  const [headline, setHeadline] = useState<string>(`Top Rated ${business.name} | Claim Special Offer`);
  const [primaryText, setPrimaryText] = useState<string>(
    `Looking for the best results without the guesswork? At ${business.name}, our certified team helps you achieve real goals with dedicated support. Claim your exclusive discount today before spots fill up!`
  );
  const [description, setDescription] = useState<string>('⭐⭐⭐⭐⭐ 5-Star Rated • Fast Service • Transparent Pricing');
  const [callToAction, setCallToAction] = useState<string>('Claim Offer');
  const [displayUrl, setDisplayUrl] = useState<string>(`${business.website.replace('https://', '')}/special`);
  const [keywords, setKeywords] = useState<string[]>(['best service near me', 'affordable pricing', 'expert consultation']);
  const [negativeKeywords, setNegativeKeywords] = useState<string[]>(['free pdf', 'diy', 'job openings', 'cheap tutorial']);
  const [aiGeneratedOptions, setAiGeneratedOptions] = useState<{
    headlines: string[];
    primaryTexts: string[];
    descriptions: string[];
    callToActions: string[];
  } | null>(null);

  if (!isOpen) return null;

  // Real-time calculated budget forecast
  const estWeeklySpend = dailyBudget * 7;
  const estCpc = platform === 'tiktok' ? 0.45 : platform === 'meta' ? 0.75 : 1.25;
  const estWeeklyClicks = Math.round(estWeeklySpend / estCpc);
  const estWeeklyLeads = Math.max(Math.round(estWeeklyClicks * 0.06), 2);
  const estRoasMin = 3.8;
  const estRoasMax = 5.6;

  // Handle AI Ad Copy Generation
  const handleGenerateAiCopy = async () => {
    setLoadingAi(true);
    try {
      const response = await fetch('/api/ai/generate-ad-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: business.name,
          industry,
          objective,
          targetAudience: `People in ${location} interested in ${industry}`,
          offer,
          platform,
          tone: 'Persuasive, trustworthy, and high-converting'
        })
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const data = resData.data;
        setAiGeneratedOptions({
          headlines: data.headlines || [],
          primaryTexts: data.primaryTexts || [],
          descriptions: data.descriptions || [],
          callToActions: data.callToActions || [],
        });

        if (data.headlines?.[0]) setHeadline(data.headlines[0]);
        if (data.primaryTexts?.[0]) setPrimaryText(data.primaryTexts[0]);
        if (data.descriptions?.[0]) setDescription(data.descriptions[0]);
        if (data.callToActions?.[0]) setCallToAction(data.callToActions[0]);
        if (data.recommendedKeywords?.length) setKeywords(data.recommendedKeywords);
        if (data.negativeKeywords?.length) setNegativeKeywords(data.negativeKeywords);
      }
    } catch (err) {
      console.error('Failed to generate ad copy:', err);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleLaunch = () => {
    const newCamp: Campaign = {
      id: `camp-${Date.now()}`,
      name: campaignName || `${business.name} Smart Campaign`,
      platform,
      status: 'active',
      objective,
      dailyBudget,
      startDate: new Date().toISOString().split('T')[0],
      metrics: {
        spend: 0,
        revenue: 0,
        roas: 0,
        impressions: 120,
        clicks: 8,
        ctr: 6.67,
        cpc: estCpc,
        conversions: 1,
        cpa: dailyBudget / 2,
        frequency: 1.0,
      },
      targeting: {
        location,
        radiusMiles,
        ageMin,
        ageMax,
        interests: [industry, 'Local Services', 'Special Promotions'],
        keywords,
        negativeKeywords,
      },
      creative: {
        id: `cr-${Date.now()}`,
        headline,
        primaryText,
        description,
        callToAction,
        displayUrl,
        destinationUrl: `${business.website}/offer`,
        format: platform === 'google' ? 'search_text' : 'image',
        imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
      },
      lastUpdated: new Date().toISOString().split('T')[0],
      aiOptimizationScore: 96,
    };

    onLaunchCampaign(newCamp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white font-display">
                Smart Ads Campaign Creator
              </h2>
              <p className="text-xs text-slate-400">
                Designed for small business owners: Launch high-ROI ads in 4 quick steps
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950/40 text-xs">
          {[
            { num: 1, label: 'Goal & Channel' },
            { num: 2, label: 'Audience & Geo' },
            { num: 3, label: 'Budget & ROI' },
            { num: 4, label: 'AI Copy & Preview' },
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => s.num < step && setStep(s.num)}
              className={`p-3 text-center border-r last:border-r-0 border-slate-800/80 flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                step === s.num
                  ? 'bg-indigo-600/10 text-cyan-300 font-bold border-b-2 border-b-cyan-400'
                  : step > s.num
                  ? 'text-emerald-400 font-medium'
                  : 'text-slate-500 cursor-not-allowed'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === s.num
                  ? 'bg-cyan-400 text-slate-950 font-bold'
                  : step > s.num
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {step > s.num ? <Check className="w-3 h-3" /> : s.num}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8 max-h-[65vh] overflow-y-auto space-y-6">
          {/* STEP 1: Business Goal & Channel Selection */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Campaign Title
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. Austin Studio Summer Special"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  What is your primary marketing outcome?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'leads', label: 'More Leads & Calls', desc: 'Direct phone inquiries, booking quote forms, and local appointments' },
                    { id: 'sales', label: 'Online Store Sales', desc: 'Drive checkout transactions with special discount offers' },
                    { id: 'phone_calls', label: 'Direct Phone Calls', desc: 'Customers calling directly from Google search or Maps' },
                    { id: 'store_visits', label: 'In-Store Walk-ins', desc: 'Attract nearby foot traffic and local store visitors' },
                  ].map((g) => (
                    <div
                      key={g.id}
                      onClick={() => setObjective(g.id as CampaignObjective)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        objective === g.id
                          ? 'bg-indigo-600/15 border-cyan-400 shadow-md'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{g.label}</span>
                        {objective === g.id && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{g.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Choose Advertising Network
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'google', name: 'Google Ads', sub: 'High-Intent Search' },
                    { id: 'meta', name: 'Meta (IG & FB)', sub: 'Visual & Retargeting' },
                    { id: 'local_maps', name: 'Google Maps', sub: 'Local Service Calls' },
                    { id: 'tiktok', name: 'TikTok Ads', sub: 'Short Video Reach' },
                  ].map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setPlatform(p.id as PlatformType);
                        if (p.id === 'google') setPreviewPlatform('google');
                        else if (p.id === 'meta') setPreviewPlatform('meta');
                        else setPreviewPlatform('tiktok');
                      }}
                      className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all ${
                        platform === p.id
                          ? 'bg-indigo-600/20 border-indigo-400 text-white'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs sm:text-sm">{p.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{p.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Your Irresistible Hook or Special Offer
                </label>
                <input
                  type="text"
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                  placeholder="e.g. 50% Off First Visit, Free Roof Inspection, $19 Intro Pass"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Audience & Geo Location */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    Target Location / City
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Austin Metro, TX"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Service Radius: {radiusMiles} Miles
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="50"
                    value={radiusMiles}
                    onChange={(e) => setRadiusMiles(Number(e.target.value))}
                    className="w-full accent-cyan-400 mt-2"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>3 mi (Hyperlocal)</span>
                    <span>25 mi (Suburbs)</span>
                    <span>50 mi (Regional)</span>
                  </div>
                </div>
              </div>

              {/* Age targeting */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Target Customer Age Range: {ageMin} - {ageMax} Years Old
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="18"
                    max="75"
                    value={ageMin}
                    onChange={(e) => setAgeMin(Number(e.target.value))}
                    className="w-24 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm text-center"
                  />
                  <span className="text-slate-500">to</span>
                  <input
                    type="number"
                    min="18"
                    max="80"
                    value={ageMax}
                    onChange={(e) => setAgeMax(Number(e.target.value))}
                    className="w-24 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm text-center"
                  />
                </div>
              </div>

              {/* Keywords / Intent Tags */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Target Intent Keywords ({keywords.length})
                </label>
                <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  {keywords.map((kw, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs flex items-center gap-1.5">
                      <span>{kw}</span>
                      <button
                        onClick={() => setKeywords(keywords.filter((_, idx) => idx !== i))}
                        className="text-slate-400 hover:text-rose-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={() => {
                      const newKw = prompt('Add keyword:');
                      if (newKw) setKeywords([...keywords, newKw]);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                  >
                    + Add Keyword
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Budget & ROI Forecast */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Daily Advertising Budget
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      min="5"
                      max="1000"
                      value={dailyBudget}
                      onChange={(e) => setDailyBudget(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-lg focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {[15, 30, 50, 75, 100].map(amt => (
                      <button
                        key={amt}
                        onClick={() => setDailyBudget(amt)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          dailyBudget === amt
                            ? 'bg-cyan-500 text-slate-950'
                            : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        ${amt}/d
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Real-Time Impact Projection for Small Business Owner */}
              <div className="rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-900 border border-indigo-500/30 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-white text-sm">Real-Time Growth & ROI Forecast</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                    Smart Ads Algorithmic Projection
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-[11px] text-slate-400">Est. Weekly Reach</div>
                    <div className="text-lg font-bold text-white mt-1">{(estWeeklyClicks * 22).toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500">Impressions</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-[11px] text-slate-400">Est. Weekly Clicks</div>
                    <div className="text-lg font-bold text-cyan-300 mt-1">{estWeeklyClicks} clicks</div>
                    <div className="text-[10px] text-slate-500">Avg ${(estWeeklySpend / estWeeklyClicks).toFixed(2)} CPC</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-[11px] text-slate-400">Projected Leads/Calls</div>
                    <div className="text-lg font-bold text-emerald-400 mt-1">{estWeeklyLeads} - {estWeeklyLeads * 2}</div>
                    <div className="text-[10px] text-slate-500">Ready buyers</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-[11px] text-slate-400">Estimated ROAS</div>
                    <div className="text-lg font-bold text-purple-400 mt-1">{estRoasMin}x - {estRoasMax}x</div>
                    <div className="text-[10px] text-slate-500">Return on Ad Spend</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: AI Creative Studio & Mockup Preview */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* AI Auto Copywriter Trigger */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-slate-900 border border-indigo-500/40">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-bold text-white">AI High-Converting Copywriter</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Generate punchy headlines, hooks, and call-to-actions specifically for your business niche.
                  </p>
                </div>
                <button
                  id="generate-ai-copy-btn"
                  onClick={handleGenerateAiCopy}
                  disabled={loadingAi}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingAi ? 'animate-spin' : ''}`} />
                  <span>{loadingAi ? 'Writing High-Converting Copy...' : 'Generate with Gemini AI'}</span>
                </button>
              </div>

              {/* Editable Fields & Live Preview Split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Input fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Headline (Google & Social Title)
                    </label>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none"
                    />
                    {aiGeneratedOptions?.headlines && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {aiGeneratedOptions.headlines.slice(0, 3).map((h, idx) => (
                          <button
                            key={idx}
                            onClick={() => setHeadline(h)}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-indigo-600/30 hover:text-white transition-colors"
                          >
                            Variation {idx + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Primary Ad Text / Body
                    </label>
                    <textarea
                      rows={3}
                      value={primaryText}
                      onChange={(e) => setPrimaryText(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Call To Action
                      </label>
                      <select
                        value={callToAction}
                        onChange={(e) => setCallToAction(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500"
                      >
                        <option value="Claim Offer">Claim Offer</option>
                        <option value="Book Now">Book Now</option>
                        <option value="Get Free Quote">Get Free Quote</option>
                        <option value="Call Now">Call Now</option>
                        <option value="Learn More">Learn More</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Display URL
                      </label>
                      <input
                        type="text"
                        value={displayUrl}
                        onChange={(e) => setDisplayUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Live Interactive Ad Preview Mockup */}
                <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                      Live Ad Format Preview
                    </span>
                    <div className="flex items-center gap-1 text-[11px]">
                      <button
                        onClick={() => setPreviewPlatform('google')}
                        className={`px-2 py-0.5 rounded ${previewPlatform === 'google' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                      >
                        Google
                      </button>
                      <button
                        onClick={() => setPreviewPlatform('meta')}
                        className={`px-2 py-0.5 rounded ${previewPlatform === 'meta' ? 'bg-fuchsia-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                      >
                        Instagram
                      </button>
                      <button
                        onClick={() => setPreviewPlatform('tiktok')}
                        className={`px-2 py-0.5 rounded ${previewPlatform === 'tiktok' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                      >
                        TikTok
                      </button>
                    </div>
                  </div>

                  {/* Google Search Mockup */}
                  {previewPlatform === 'google' && (
                    <div className="p-4 rounded-xl bg-white text-slate-900 shadow-lg space-y-1.5 text-left font-sans">
                      <div className="flex items-center gap-1 text-[11px] text-slate-600">
                        <span className="font-bold text-black">Sponsored</span>
                        <span>•</span>
                        <span className="truncate">{displayUrl}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-blue-700 hover:underline leading-snug">
                        {headline}
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">
                        {primaryText}
                      </p>
                      <div className="pt-1 flex items-center gap-3 text-[11px] text-blue-800 font-medium">
                        <span className="hover:underline">⭐⭐⭐⭐⭐ 4.9 Rating</span>
                        <span>•</span>
                        <span className="hover:underline">{callToAction}</span>
                      </div>
                    </div>
                  )}

                  {/* Instagram Feed Mockup */}
                  {previewPlatform === 'meta' && (
                    <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden text-left text-xs">
                      <div className="p-2.5 flex items-center gap-2 border-b border-slate-800">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-0.5">
                          <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                            {business.name.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-white text-[11px]">{business.name}</div>
                          <div className="text-[9px] text-slate-400">Sponsored</div>
                        </div>
                      </div>
                      <div className="relative h-32 bg-slate-800 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
                          alt="Ad Visual"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 text-white font-bold text-[10px]">
                          {offer}
                        </div>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-[11px] truncate max-w-[180px]">{headline}</span>
                          <span className="px-2 py-1 rounded-md bg-indigo-600 text-white font-bold text-[10px]">
                            {callToAction}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] line-clamp-2 leading-relaxed">
                          {primaryText}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TikTok Mockup */}
                  {previewPlatform === 'tiktok' && (
                    <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden text-left text-xs p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-[10px]">
                          TikTok Ad
                        </span>
                        <span className="text-[10px] text-slate-400">@{business.name.toLowerCase().replace(/\s+/g, '')}</span>
                      </div>
                      <div className="font-bold text-white text-xs">{headline}</div>
                      <p className="text-slate-300 text-[11px] line-clamp-2">{primaryText}</p>
                      <button className="w-full py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs">
                        {callToAction}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between p-6 border-t border-slate-800 bg-slate-950/60">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="launch-campaign-submit-btn"
              onClick={handleLaunch}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Launch Live Campaign</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
