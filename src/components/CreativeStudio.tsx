import React, { useState } from 'react';
import { Campaign, BusinessProfile } from '../types';
import { 
  Sparkles, 
  Smartphone, 
  Monitor, 
  Copy, 
  Check, 
  RefreshCw, 
  Sliders, 
  Search, 
  Eye, 
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark
} from 'lucide-react';

interface CreativeStudioProps {
  business: BusinessProfile;
  campaigns: Campaign[];
}

export const CreativeStudio: React.FC<CreativeStudioProps> = ({
  business,
  campaigns,
}) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || '');
  const [activeFormat, setActiveFormat] = useState<'google' | 'instagram' | 'facebook' | 'tiktok'>('google');
  const [customHeadline, setCustomHeadline] = useState<string>(campaigns[0]?.creative.headline || '');
  const [customBody, setCustomBody] = useState<string>(campaigns[0]?.creative.primaryText || '');
  const [customCta, setCustomCta] = useState<string>(campaigns[0]?.creative.callToAction || 'Book Now');
  const [copied, setCopied] = useState<boolean>(false);
  const [generatingAi, setGeneratingAi] = useState<boolean>(false);
  const [aiVariations, setAiVariations] = useState<string[]>([]);

  const selectedCamp = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];

  // When switching campaign
  const handleSelectCamp = (camp: Campaign) => {
    setSelectedCampaignId(camp.id);
    setCustomHeadline(camp.creative.headline);
    setCustomBody(camp.creative.primaryText);
    setCustomCta(camp.creative.callToAction);
    if (camp.platform === 'google' || camp.platform === 'local_maps') {
      setActiveFormat('google');
    } else if (camp.platform === 'tiktok') {
      setActiveFormat('tiktok');
    } else {
      setActiveFormat('instagram');
    }
  };

  // Copy to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Headline Score Calculation
  const powerWords = ['best', 'proven', 'guaranteed', 'special', 'free', 'exclusive', 'save', 'top', 'fast', 'rated', 'limited'];
  const headlineLower = customHeadline.toLowerCase();
  const matchedPowerWords = powerWords.filter(w => headlineLower.includes(w));
  const lengthScore = customHeadline.length >= 15 && customHeadline.length <= 40 ? 40 : 20;
  const powerScore = Math.min(matchedPowerWords.length * 25, 40);
  const totalScore = Math.min(lengthScore + powerScore + 20, 98);

  const handleGenerateVariations = async () => {
    setGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/generate-ad-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: business.name,
          industry: business.industry,
          objective: selectedCamp?.objective || 'leads',
          targetAudience: selectedCamp?.targeting.location,
          offer: 'Seasonal Promotional Discount',
          platform: activeFormat,
        })
      });
      const data = await res.json();
      if (data.success && data.data?.headlines) {
        setAiVariations(data.data.headlines);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Ad Creative & Copy Studio
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Preview, test, and write high-converting ads across Google Search, Instagram, Facebook, and TikTok
          </p>
        </div>

        {/* Campaign Switcher */}
        <select
          id="creative-campaign-select"
          value={selectedCampaignId}
          onChange={(e) => {
            const camp = campaigns.find(c => c.id === e.target.value);
            if (camp) handleSelectCamp(camp);
          }}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          {campaigns.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.platform.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (6 cols): Copy Editor & Power Score */}
        <div className="lg:col-span-6 space-y-5">
          {/* Format Picker */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            {[
              { id: 'google', label: 'Google Search' },
              { id: 'instagram', label: 'Instagram Feed' },
              { id: 'facebook', label: 'Facebook Mobile' },
              { id: 'tiktok', label: 'TikTok Feed' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFormat(f.id as any)}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                  activeFormat === f.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Copy Editor Card */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 shadow-xl">
            {/* Headline with Power Score */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Ad Headline
                </label>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">{customHeadline.length} characters</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    totalScore >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {totalScore}/100 Score
                  </span>
                </div>
              </div>
              <input
                type="text"
                value={customHeadline}
                onChange={(e) => setCustomHeadline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                <span>Power words detected: {matchedPowerWords.length > 0 ? matchedPowerWords.join(', ') : 'None'}</span>
                <button
                  onClick={() => handleCopy(customHeadline)}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
            </div>

            {/* Primary Text */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Primary Ad Copy / Story
                </label>
                <span className="text-xs text-slate-400">{customBody.length} characters</span>
              </div>
              <textarea
                rows={4}
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Call to Action & Link */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Call to Action
                </label>
                <input
                  type="text"
                  value={customCta}
                  onChange={(e) => setCustomCta(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Destination URL
                </label>
                <input
                  type="text"
                  disabled
                  value={selectedCamp?.creative.displayUrl || `${business.website}/offer`}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-slate-400 text-xs"
                />
              </div>
            </div>

            {/* AI Copy Generator Trigger */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <button
                id="generate-variations-btn"
                onClick={handleGenerateVariations}
                disabled={generatingAi}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>{generatingAi ? 'Generating Copy Variations...' : 'Generate 5 Copy Angles (Gemini)'}</span>
              </button>

              {copied && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold animate-in fade-in">
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied to clipboard!</span>
                </span>
              )}
            </div>

            {/* AI Generated Headline Variation Chips */}
            {aiVariations.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                  AI Generated Headlines (Click to Apply):
                </div>
                <div className="space-y-1.5">
                  {aiVariations.map((v, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCustomHeadline(v)}
                      className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-indigo-950/60 border border-slate-800 text-xs text-slate-200 hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span className="truncate">{v}</span>
                      <span className="text-[10px] text-indigo-400 shrink-0 font-medium">Use</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (6 cols): Realistic Live Device Ad Mockups */}
        <div className="lg:col-span-6 flex flex-col items-center justify-start">
          <div className="w-full max-w-md space-y-3">
            <div className="text-xs font-semibold text-slate-400 flex items-center justify-between px-2">
              <span>Live Pixel-Accurate Device Preview</span>
              <span className="capitalize text-cyan-400">{activeFormat} Placement</span>
            </div>

            {/* GOOGLE SEARCH MOCKUP */}
            {activeFormat === 'google' && (
              <div className="rounded-2xl bg-white text-slate-900 p-6 shadow-2xl border border-slate-200 space-y-2 text-left font-sans">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="font-bold text-black">Sponsored</span>
                  <span>•</span>
                  <span className="truncate">{selectedCamp?.creative.displayUrl || 'yourbusiness.com/deal'}</span>
                </div>
                <h3 className="text-base sm:text-lg font-medium text-blue-800 hover:underline leading-snug cursor-pointer">
                  {customHeadline}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {customBody}
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center gap-4 text-xs font-semibold text-blue-800">
                  <span className="hover:underline">⭐⭐⭐⭐⭐ 4.9 Stars (180+ Reviews)</span>
                  <span>•</span>
                  <span className="hover:underline">{customCta}</span>
                </div>
              </div>
            )}

            {/* INSTAGRAM FEED MOCKUP */}
            {activeFormat === 'instagram' && (
              <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl text-left text-xs">
                {/* Header */}
                <div className="p-3.5 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-0.5">
                      <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-bold text-white text-xs">
                        {business.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs leading-none">{business.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Sponsored • {business.location}</div>
                    </div>
                  </div>
                  <span className="text-slate-400 font-bold">•••</span>
                </div>

                {/* Media Container */}
                <div className="relative aspect-video sm:aspect-square bg-slate-950 overflow-hidden">
                  <img
                    src={selectedCamp?.creative.imageUrl || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"}
                    alt="Creative asset"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                    {customCta}
                  </div>
                </div>

                {/* Action Bar */}
                <div className="p-3 border-b border-slate-800/80 flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-4">
                    <ThumbsUp className="w-4 h-4 cursor-pointer hover:text-rose-500" />
                    <MessageCircle className="w-4 h-4 cursor-pointer hover:text-white" />
                    <Share2 className="w-4 h-4 cursor-pointer hover:text-white" />
                  </div>
                  <Bookmark className="w-4 h-4 cursor-pointer hover:text-white" />
                </div>

                {/* Caption & CTA */}
                <div className="p-3.5 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-white text-xs leading-snug">{customHeadline}</span>
                    <button className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs shrink-0 shadow-md">
                      {customCta}
                    </button>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    <span className="font-bold text-white mr-1.5">{business.name}</span>
                    {customBody}
                  </p>
                </div>
              </div>
            )}

            {/* FACEBOOK MOBILE MOCKUP */}
            {activeFormat === 'facebook' && (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-2xl text-left text-xs space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
                    {business.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">{business.name}</div>
                    <div className="text-[10px] text-slate-400">Sponsored • Paid Advertising</div>
                  </div>
                </div>

                <p className="text-slate-200 text-xs leading-relaxed">
                  {customBody}
                </p>

                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img
                    src={selectedCamp?.creative.imageUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80"}
                    alt="Ad Visual"
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-3 bg-slate-950 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">{selectedCamp?.creative.displayUrl || 'yourbusiness.com'}</div>
                      <div className="font-bold text-white text-xs mt-0.5">{customHeadline}</div>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold">
                      {customCta}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TIKTOK MOCKUP */}
            {activeFormat === 'tiktok' && (
              <div className="relative rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden aspect-[9/14] shadow-2xl text-left text-xs p-4 flex flex-col justify-end">
                <img
                  src={selectedCamp?.creative.imageUrl || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80"}
                  alt="TikTok background"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="relative z-10 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px]">
                      Sponsored Ad
                    </span>
                    <span className="text-white font-bold text-xs">@{business.name.toLowerCase().replace(/\s+/g, '')}</span>
                  </div>

                  <h4 className="font-bold text-white text-sm leading-snug">{customHeadline}</h4>
                  <p className="text-slate-200 text-xs line-clamp-3">{customBody}</p>

                  <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2">
                    <span>{customCta}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
