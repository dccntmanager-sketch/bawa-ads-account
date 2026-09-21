import React, { useState } from 'react';
import { Campaign, PlatformType, CampaignStatus } from '../types';
import { 
  Search, 
  Filter, 
  Plus, 
  Play, 
  Pause, 
  DollarSign, 
  ExternalLink, 
  MoreVertical, 
  Copy, 
  Trash2, 
  Sparkles,
  Layers,
  ArrowUpDown,
  Eye,
  Check,
  AlertCircle
} from 'lucide-react';

interface CampaignsManagerProps {
  campaigns: Campaign[];
  onToggleStatus: (campaignId: string) => void;
  onUpdateBudget: (campaignId: string, newBudget: number) => void;
  onDeleteCampaign: (campaignId: string) => void;
  onDuplicateCampaign: (campaignId: string) => void;
  onOpenCreateModal: () => void;
  onSelectCampaignDetails: (campaign: Campaign) => void;
}

export const CampaignsManager: React.FC<CampaignsManagerProps> = ({
  campaigns,
  onToggleStatus,
  onUpdateBudget,
  onDeleteCampaign,
  onDuplicateCampaign,
  onOpenCreateModal,
  onSelectCampaignDetails,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [tempBudget, setTempBudget] = useState<number>(0);

  // Platform badges styling & labels
  const platformMeta = {
    google: { label: 'Google Search', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    meta: { label: 'Meta (IG & FB)', color: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30' },
    tiktok: { label: 'TikTok Ads', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
    linkedin: { label: 'LinkedIn B2B', color: 'bg-sky-500/10 text-sky-400 border-sky-500/30' },
    local_maps: { label: 'Local Google Maps', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  };

  const filteredCampaigns = campaigns.filter(c => {
    if (selectedPlatform !== 'all' && c.platform !== selectedPlatform) return false;
    if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchTarget = c.targeting.location.toLowerCase().includes(q);
      const matchObj = c.objective.toLowerCase().includes(q);
      if (!matchName && !matchTarget && !matchObj) return false;
    }
    return true;
  });

  const handleStartEditBudget = (camp: Campaign) => {
    setEditingBudgetId(camp.id);
    setTempBudget(camp.dailyBudget);
  };

  const handleSaveBudget = (campId: string) => {
    if (tempBudget > 0) {
      onUpdateBudget(campId, tempBudget);
    }
    setEditingBudgetId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Active Marketing Campaigns
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Control budgets, track live ROAS, and optimize delivery across all ad networks
          </p>
        </div>

        <button
          id="campaigns-new-ad-btn"
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Launch New Campaign</span>
        </button>
      </div>

      {/* Filter Bar & Search */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="campaign-search-input"
              type="text"
              placeholder="Search campaigns by name, location, or objective..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <select
              id="status-filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="paused">Paused Only</option>
            </select>
          </div>
        </div>

        {/* Platform Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          {[
            { id: 'all', label: 'All Networks' },
            { id: 'google', label: 'Google Search' },
            { id: 'meta', label: 'Meta (IG & FB)' },
            { id: 'tiktok', label: 'TikTok' },
            { id: 'local_maps', label: 'Local Maps' },
            { id: 'linkedin', label: 'LinkedIn' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPlatform(p.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                selectedPlatform === p.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80'
              }`}
            >
              {p.label}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-slate-400 hidden lg:inline-block">
            Showing {filteredCampaigns.length} of {campaigns.length} campaigns
          </span>
        </div>
      </div>

      {/* Campaigns Table & Cards */}
      {filteredCampaigns.length === 0 ? (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-12 text-center space-y-3">
          <Layers className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">No campaigns match your filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or platform filters, or launch a new campaign tailored to your business.
          </p>
          <button
            onClick={() => { setSelectedPlatform('all'); setSelectedStatus('all'); setSearchQuery(''); }}
            className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-200 hover:text-white transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCampaigns.map((camp) => {
            const pInfo = platformMeta[camp.platform] || { label: camp.platform, color: 'bg-slate-800 text-slate-300 border-slate-700' };
            const isEditingBudget = editingBudgetId === camp.id;

            return (
              <div
                key={camp.id}
                className="rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700/90 p-4 sm:p-5 shadow-lg transition-all space-y-4"
              >
                {/* Top Row: Switch, Network Badge, Title, Objective */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3">
                    {/* Active/Paused Switch */}
                    <button
                      id={`toggle-status-${camp.id}`}
                      onClick={() => onToggleStatus(camp.id)}
                      title={camp.status === 'active' ? 'Click to Pause Campaign' : 'Click to Activate Campaign'}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        camp.status === 'active' ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          camp.status === 'active' ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${pInfo.color}`}>
                          {pInfo.label}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 capitalize">
                          Goal: {camp.objective.replace('_', ' ')}
                        </span>
                        {camp.aiOptimizationScore && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono border border-indigo-500/30 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            {camp.aiOptimizationScore}% Opt.
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                        {camp.name}
                      </h3>
                    </div>
                  </div>

                  {/* Actions & Detail preview trigger */}
                  <div className="flex items-center gap-2 self-end lg:self-center">
                    <button
                      id={`view-preview-${camp.id}`}
                      onClick={() => onSelectCampaignDetails(camp)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Ad Preview & Stats</span>
                    </button>

                    <button
                      id={`duplicate-btn-${camp.id}`}
                      onClick={() => onDuplicateCampaign(camp.id)}
                      title="Duplicate Campaign"
                      className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      id={`delete-btn-${camp.id}`}
                      onClick={() => onDeleteCampaign(camp.id)}
                      title="Delete Campaign"
                      className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-800/80">
                  {/* Daily Budget */}
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Daily Budget</div>
                    {isEditingBudget ? (
                      <div className="flex items-center gap-1 mt-1">
                        <input
                          type="number"
                          value={tempBudget}
                          onChange={(e) => setTempBudget(Number(e.target.value))}
                          className="w-16 px-1.5 py-0.5 text-xs bg-slate-900 border border-indigo-500 rounded text-white focus:outline-none"
                          min="5"
                          max="1000"
                        />
                        <button
                          onClick={() => handleSaveBudget(camp.id)}
                          className="p-1 bg-indigo-600 rounded text-white hover:bg-indigo-500"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => handleStartEditBudget(camp)}
                        className="text-xs sm:text-sm font-bold text-white mt-1 cursor-pointer hover:text-indigo-400 flex items-center justify-between group"
                        title="Click to edit budget"
                      >
                        <span>${camp.dailyBudget}/day</span>
                        <span className="text-[10px] text-slate-500 group-hover:text-indigo-400">Edit</span>
                      </div>
                    )}
                  </div>

                  {/* Spend */}
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Total Spend</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-200 mt-1">
                      ${camp.metrics.spend.toLocaleString()}
                    </div>
                  </div>

                  {/* Generated Revenue */}
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Revenue</div>
                    <div className="text-xs sm:text-sm font-bold text-white mt-1">
                      ${camp.metrics.revenue.toLocaleString()}
                    </div>
                  </div>

                  {/* ROAS Return */}
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                    <div className="text-[10px] text-slate-400 uppercase font-medium">ROAS</div>
                    <div className="mt-1">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-bold ${
                        camp.metrics.roas >= 4.0
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : camp.metrics.roas >= 2.5
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {camp.metrics.roas.toFixed(2)}x
                      </span>
                    </div>
                  </div>

                  {/* Conversions & CPA */}
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Conversions</div>
                    <div className="text-xs sm:text-sm font-bold text-white mt-1">
                      {camp.metrics.conversions} <span className="text-[10px] text-slate-400 font-normal">(${camp.metrics.cpa.toFixed(1)} CPA)</span>
                    </div>
                  </div>

                  {/* CTR & Clicks */}
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                    <div className="text-[10px] text-slate-400 uppercase font-medium">CTR / Clicks</div>
                    <div className="text-xs sm:text-sm font-bold text-cyan-300 mt-1">
                      {camp.metrics.ctr.toFixed(2)}% <span className="text-[10px] text-slate-400 font-normal">({camp.metrics.clicks})</span>
                    </div>
                  </div>
                </div>

                {/* Target Audience Summary Footnote */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Targeting:</span>
                    <span className="text-slate-300 font-medium">{camp.targeting.location}</span>
                    <span className="text-slate-600">•</span>
                    <span>Age {camp.targeting.ageMin}-{camp.targeting.ageMax}</span>
                    <span className="text-slate-600">•</span>
                    <span>{camp.targeting.interests.slice(0, 2).join(', ')}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Est. Monthly Run-Rate: ${(camp.dailyBudget * 30.4).toFixed(0)}/mo
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
