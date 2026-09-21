import React from 'react';
import { Campaign } from '../types';
import { 
  X, 
  MapPin, 
  Target, 
  Sparkles, 
  DollarSign, 
  TrendingUp, 
  MousePointer, 
  ShieldAlert, 
  ExternalLink,
  Layers
} from 'lucide-react';

interface CampaignDetailsModalProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CampaignDetailsModal: React.FC<CampaignDetailsModalProps> = ({
  campaign,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !campaign) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {campaign.platform.toUpperCase()}
              </span>
              <span className="text-xs text-slate-400 capitalize">
                Goal: {campaign.objective.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-display">
              {campaign.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto text-left">
          {/* Metrics Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Spend</div>
              <div className="text-lg font-bold text-white mt-0.5">${campaign.metrics.spend.toLocaleString()}</div>
              <div className="text-[10px] text-slate-500">${campaign.dailyBudget}/day budget</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Generated Revenue</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">${campaign.metrics.revenue.toLocaleString()}</div>
              <div className="text-[10px] text-emerald-500">{campaign.metrics.roas.toFixed(2)}x ROAS</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Conversions</div>
              <div className="text-lg font-bold text-cyan-400 mt-0.5">{campaign.metrics.conversions}</div>
              <div className="text-[10px] text-slate-400">${campaign.metrics.cpa.toFixed(2)} avg CPA</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Clicks & CTR</div>
              <div className="text-lg font-bold text-purple-400 mt-0.5">{campaign.metrics.clicks}</div>
              <div className="text-[10px] text-slate-400">{campaign.metrics.ctr.toFixed(2)}% CTR ({campaign.metrics.impressions.toLocaleString()} views)</div>
            </div>
          </div>

          {/* Ad Creative Preview */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Ad Creative Asset</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-blue-400 font-mono">{campaign.creative.displayUrl}</div>
                  <h4 className="text-base font-bold text-white">{campaign.creative.headline}</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{campaign.creative.primaryText}</p>
                  <div className="text-xs text-slate-400 pt-1">{campaign.creative.description}</div>
                </div>
                {campaign.creative.imageUrl && (
                  <img
                    src={campaign.creative.imageUrl}
                    alt="Creative thumbnail"
                    className="w-24 h-24 rounded-xl object-cover shrink-0 border border-slate-800"
                  />
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-indigo-600/20 text-cyan-300 border border-indigo-500/30 text-xs font-bold">
                  CTA Button: {campaign.creative.callToAction}
                </span>
                <span className="text-xs text-slate-400">
                  Format: {campaign.creative.format.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Targeting & Audience Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Geographic Targeting</span>
              </div>
              <div className="text-xs text-slate-300">{campaign.targeting.location}</div>
              <div className="text-[11px] text-slate-400">Radius: {campaign.targeting.radiusMiles} miles</div>
              <div className="text-[11px] text-slate-400">Age: {campaign.targeting.ageMin} - {campaign.targeting.ageMax}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                <span>Targeted Intent Keywords</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {campaign.targeting.keywords.map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Negative Keywords List */}
          {campaign.targeting.negativeKeywords.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950 border border-rose-900/30 space-y-2">
              <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Active Negative Keywords (Budget Waste Protections)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {campaign.targeting.negativeKeywords.map((nkw, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-rose-950/40 border border-rose-800/40 text-[11px] text-rose-300 font-mono">
                    -{nkw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
