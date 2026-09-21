import React, { useState } from 'react';
import { Campaign, BusinessProfile, DailyChartPoint, AIRecommendation } from '../types';
import { RoiReachCalculator } from './RoiReachCalculator';
import { InteractivePerformanceChart } from './InteractivePerformanceChart';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  MousePointerClick, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  BarChart3,
  Layers,
  Zap,
  CheckCircle,
  Clock,
  Send,
  Mail,
  Coins,
  ExternalLink
} from 'lucide-react';

interface DashboardOverviewProps {
  business: BusinessProfile;
  campaigns: Campaign[];
  chartData: DailyChartPoint[];
  recommendations: AIRecommendation[];
  onNavigateTab: (tab: 'campaigns' | 'create' | 'optimize' | 'creative') => void;
  onApplyRecommendation: (recId: string) => void;
  onOpenManagerModal?: () => void;
  dateRange?: string;
  onChangeDateRange?: (range: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  business,
  campaigns,
  chartData,
  recommendations,
  onNavigateTab,
  onApplyRecommendation,
  onOpenManagerModal,
  dateRange,
  onChangeDateRange,
}) => {

  // Compute aggregated live metrics from active campaigns
  const totalSpend = campaigns.reduce((acc, c) => acc + c.metrics.spend, 0);
  const totalRevenue = campaigns.reduce((acc, c) => acc + c.metrics.revenue, 0);
  const totalConversions = campaigns.reduce((acc, c) => acc + c.metrics.conversions, 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + c.metrics.clicks, 0);
  const totalImpressions = campaigns.reduce((acc, c) => acc + c.metrics.impressions, 0);
  const overallRoas = totalSpend > 0 ? (totalRevenue / totalSpend) : 0;
  const avgCpa = totalConversions > 0 ? (totalSpend / totalConversions) : 0;
  const overallCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100) : 0;

  // Platform spend breakdown
  const platforms = ['google', 'meta', 'tiktok', 'local_maps'] as const;
  const platformSpend = platforms.map(p => {
    const matched = campaigns.filter(c => c.platform === p);
    const spend = matched.reduce((a, b) => a + b.metrics.spend, 0);
    const revenue = matched.reduce((a, b) => a + b.metrics.revenue, 0);
    const conv = matched.reduce((a, b) => a + b.metrics.conversions, 0);
    const roas = spend > 0 ? revenue / spend : 0;
    const share = totalSpend > 0 ? Math.round((spend / totalSpend) * 100) : 0;
    const nameMap = {
      google: 'Google Search & Intent',
      meta: 'Meta (Instagram & Facebook)',
      tiktok: 'TikTok Video Ads',
      local_maps: 'Local Maps & Calls',
    };
    const colorMap = {
      google: '#3b82f6',
      meta: '#a855f7',
      tiktok: '#ec4899',
      local_maps: '#06b6d4',
    };
    return { platform: p, name: nameMap[p], spend, revenue, roas, conv, share, color: colorMap[p] };
  });

  const unappliedRecs = recommendations.filter(r => !r.applied);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Small Business Owner Smart Growth Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 sm:p-7 shadow-xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Growth Strategy Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              {business.name} Marketing Reach
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Targeted advertising running across <span className="text-white font-medium">Google, Meta, TikTok & Local Maps</span>. Current ROAS is delivering <span className="text-emerald-400 font-bold">${overallRoas.toFixed(2)}</span> return for every $1 invested.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              id="banner-create-ad-btn"
              onClick={() => onNavigateTab('create')}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>New Smart Ad</span>
            </button>
            <button
              id="banner-optimize-btn"
              onClick={() => onNavigateTab('optimize')}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Growth Audit ({unappliedRecs.length})</span>
            </button>
            {onOpenManagerModal && (
              <button
                id="banner-manager-btn"
                onClick={onOpenManagerModal}
                className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-cyan-400" />
                <span>Manager: @Admanagersolution</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Top Key Performance Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Ad Spend */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Ad Spend</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              ${totalSpend.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Budget Cap: ${business.monthlyTargetBudget.toLocaleString()}</span>
              <span className="text-indigo-400 font-medium">
                {Math.round((totalSpend / business.monthlyTargetBudget) * 100)}%
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full"
                style={{ width: `${Math.min((totalSpend / business.monthlyTargetBudget) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Generated Revenue & ROAS */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Generated Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              ${totalRevenue.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {overallRoas.toFixed(2)}x ROAS
              </span>
              <span className="text-xs text-slate-400">Target: {business.targetRoas}x</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Conversions & Cost Per Lead/Sale */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Conversions & Leads</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {totalConversions}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="text-slate-300 font-semibold">${avgCpa.toFixed(2)} CPA</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-medium">-14.2% lower cost</span>
            </div>
          </div>
        </div>

        {/* Card 4: Impressions, Clicks & Click-Through Rate */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Clicks & Engagement</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {totalClicks.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-semibold">
                {overallCtr.toFixed(2)}% CTR
              </span>
              <span className="text-slate-400">{(totalImpressions / 1000).toFixed(0)}k Views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Account Manager & Crypto Billing Showcase Card */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-display">
                  Dedicated Account Manager & Crypto Billing
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  Ready to Support
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                Direct strategist access for custom audience scaling, high-intent Google/Meta campaign architecture, and instant ad budget funding settled via cryptocurrency.
              </p>
            </div>
          </div>

          {/* Quick Contact & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="https://t.me/Admanagersolution"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
              title="Open Telegram Chat"
            >
              <Send className="w-3.5 h-3.5 text-cyan-400" />
              <span>Telegram: <strong className="font-mono text-white">@Admanagersolution</strong></span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <a
              href="mailto:dccntmanager@gmail.com?subject=Ad%20Account%20Management%20Inquiry"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-all"
              title="Email Account Manager"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-mono text-slate-300">dccntmanager@gmail.com</span>
            </a>

            <button
              onClick={onOpenManagerModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-500/20 transition-all active:scale-95"
            >
              <Coins className="w-3.5 h-3.5 text-amber-300" />
              <span>Payment: Crypto (USDT/BTC)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Visual Performance Analytics Chart using Recharts */}
      <InteractivePerformanceChart
        data={chartData}
        business={business}
        dateRange={dateRange}
        onChangeDateRange={onChangeDateRange}
      />

      {/* Standalone ROI & Reach Calculator Component */}
      <RoiReachCalculator
        business={business}
        onNavigateTab={onNavigateTab}
        onOpenManagerModal={onOpenManagerModal}
      />

      {/* Two Column Grid: Platform Share & High Impact Growth Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Platform Budget & Share Distribution */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Marketing Channel Breakdown</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Where your budget is allocated and returns by network</p>
            </div>
            <button
              onClick={() => onNavigateTab('campaigns')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {platformSpend.map(p => (
              <div key={p.platform} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="font-semibold text-white">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">${p.spend.toLocaleString()} spent</span>
                    <span className="font-bold text-emerald-400">{p.roas.toFixed(1)}x ROAS</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${p.share}%`, backgroundColor: p.color }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                  <span>{p.conv} conversions</span>
                  <span>{p.share}% of total budget</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Smart Growth Audit & 1-Click Action Hub */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Growth Optimization Engine
                </h3>
                <p className="text-xs text-slate-400">High-leverage fixes to scale results efficiently</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              {unappliedRecs.length} Ready
            </span>
          </div>

          {unappliedRecs.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="text-sm font-semibold text-white">All Optimizations Applied!</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Your ad campaigns are currently running at peak efficiency. Check back tomorrow or consult the AI Marketing Advisor for new angles.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {unappliedRecs.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        rec.severity === 'high'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {rec.severity} Impact
                      </span>
                      <span className="text-xs font-semibold text-white leading-snug">{rec.title}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2">
                    {rec.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {rec.estimatedImpact}
                    </span>
                    <button
                      id={`apply-rec-btn-${rec.id}`}
                      onClick={() => onApplyRecommendation(rec.id)}
                      className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
                    >
                      Apply Fix
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => onNavigateTab('optimize')}
            className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700/80 transition-all flex items-center justify-center gap-2"
          >
            <span>Open Full Growth & Marketing Advisor Hub</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
