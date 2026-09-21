import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Users, 
  DollarSign, 
  MousePointerClick, 
  Target, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Send,
  HelpCircle,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { BusinessProfile } from '../types';

interface RoiReachCalculatorProps {
  business: BusinessProfile;
  onNavigateTab?: (tab: 'campaigns' | 'create' | 'optimize' | 'creative') => void;
  onOpenManagerModal?: () => void;
}

interface IndustryBenchmark {
  id: string;
  name: string;
  cpm: number; // Cost per 1,000 impressions
  cpc: number; // Avg cost per click
  ctr: number; // Click through rate %
  convRate: number; // Conversion rate %
  avgDealValue: number; // Avg value per conversion ($)
  reachMultiplier: number; // Unique users vs impressions ratio
}

const INDUSTRY_BENCHMARKS: Record<string, IndustryBenchmark> = {
  local_services: {
    id: 'local_services',
    name: 'Home & Local Services',
    cpm: 24,
    cpc: 3.4,
    ctr: 2.8,
    convRate: 5.2,
    avgDealValue: 280,
    reachMultiplier: 0.78,
  },
  ecommerce: {
    id: 'ecommerce',
    name: 'E-Commerce & Retail',
    cpm: 15,
    cpc: 1.2,
    ctr: 2.4,
    convRate: 3.1,
    avgDealValue: 75,
    reachMultiplier: 0.82,
  },
  health_wellness: {
    id: 'health_wellness',
    name: 'Health, Dental & Wellness',
    cpm: 21,
    cpc: 2.8,
    ctr: 2.6,
    convRate: 4.8,
    avgDealValue: 190,
    reachMultiplier: 0.75,
  },
  b2b_professional: {
    id: 'b2b_professional',
    name: 'Professional & B2B Services',
    cpm: 34,
    cpc: 5.2,
    ctr: 2.2,
    convRate: 4.5,
    avgDealValue: 650,
    reachMultiplier: 0.72,
  },
  restaurants_food: {
    id: 'restaurants_food',
    name: 'Restaurants & Hospitality',
    cpm: 12,
    cpc: 0.95,
    ctr: 3.2,
    convRate: 6.5,
    avgDealValue: 48,
    reachMultiplier: 0.85,
  },
};

export const RoiReachCalculator: React.FC<RoiReachCalculatorProps> = ({
  business,
  onNavigateTab,
  onOpenManagerModal,
}) => {
  // Preset budget options
  const budgetPresets = [20, 50, 100, 200, 500];

  // Match business industry to benchmark or fallback to local services
  const defaultBenchmarkKey = useMemo(() => {
    const ind = (business.industry || '').toLowerCase();
    if (ind.includes('health') || ind.includes('dental') || ind.includes('wellness')) return 'health_wellness';
    if (ind.includes('retail') || ind.includes('shop') || ind.includes('e-commerce') || ind.includes('store')) return 'ecommerce';
    if (ind.includes('b2b') || ind.includes('law') || ind.includes('legal') || ind.includes('consult')) return 'b2b_professional';
    if (ind.includes('restaurant') || ind.includes('food') || ind.includes('bar')) return 'restaurants_food';
    return 'local_services';
  }, [business.industry]);

  // State
  const [dailyBudget, setDailyBudget] = useState<number>(50);
  const [timeHorizon, setTimeHorizon] = useState<'day' | 'week' | 'month' | 'quarter'>('month');
  const [channelStrategy, setChannelStrategy] = useState<'blended' | 'google' | 'meta' | 'tiktok'>('blended');
  const [selectedIndustry, setSelectedIndustry] = useState<string>(defaultBenchmarkKey);
  const [customConvRate, setCustomConvRate] = useState<number | null>(null);
  const [customDealValue, setCustomDealValue] = useState<number | null>(null);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Time horizon days
  const horizonDays = {
    day: 1,
    week: 7,
    month: 30,
    quarter: 90,
  }[timeHorizon];

  const benchmark = INDUSTRY_BENCHMARKS[selectedIndustry] || INDUSTRY_BENCHMARKS.local_services;

  // Channel modifiers for reach & clicks
  const channelModifiers = {
    blended: { cpmMod: 1.0, cpcMod: 1.0, ctrMod: 1.0, reachFactor: 0.8 },
    google: { cpmMod: 1.45, cpcMod: 1.35, ctrMod: 1.25, reachFactor: 0.65 }, // High intent, lower raw volume, higher conversion
    meta: { cpmMod: 0.9, cpcMod: 0.85, ctrMod: 0.95, reachFactor: 0.88 }, // Broad visual reach
    tiktok: { cpmMod: 0.65, cpcMod: 0.7, ctrMod: 0.85, reachFactor: 0.92 }, // Huge raw impression volume
  }[channelStrategy];

  // Active metrics
  const activeConvRate = customConvRate ?? benchmark.convRate;
  const activeDealValue = customDealValue ?? benchmark.avgDealValue;

  const totalPeriodSpend = dailyBudget * horizonDays;
  const effectiveCpm = Math.max(benchmark.cpm * channelModifiers.cpmMod, 4);
  const effectiveCpc = Math.max(benchmark.cpc * channelModifiers.cpcMod, 0.4);

  // Estimated Calculations
  const estimatedImpressions = Math.round((totalPeriodSpend / effectiveCpm) * 1000);
  const estimatedMinReach = Math.round(estimatedImpressions * benchmark.reachMultiplier * channelModifiers.reachFactor * 0.85);
  const estimatedMaxReach = Math.round(estimatedImpressions * benchmark.reachMultiplier * channelModifiers.reachFactor * 1.15);

  const estimatedClicks = Math.round(totalPeriodSpend / effectiveCpc);
  const estimatedConversions = Math.max(Math.round(estimatedClicks * (activeConvRate / 100)), 1);
  const projectedRevenue = Math.round(estimatedConversions * activeDealValue);
  const projectedNetProfit = projectedRevenue - totalPeriodSpend;
  const projectedRoas = totalPeriodSpend > 0 ? (projectedRevenue / totalPeriodSpend).toFixed(2) : '0.00';
  const estimatedCpa = estimatedConversions > 0 ? Math.round(totalPeriodSpend / estimatedConversions) : 0;

  // Scale tier label
  const scaleTier = useMemo(() => {
    if (dailyBudget < 30) return { label: 'Hyper-Local Testing', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' };
    if (dailyBudget < 80) return { label: 'Local City Dominance', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30' };
    if (dailyBudget < 250) return { label: 'Regional Scale', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' };
    return { label: 'High-Velocity Multi-Market', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
  }, [dailyBudget]);

  // Platform Reach Distribution breakdown for the budget
  const platformEstimates = [
    {
      platform: 'Google Search & Intent',
      share: 40,
      color: '#3b82f6',
      reach: Math.round(estimatedImpressions * 0.32),
      clicks: Math.round(estimatedClicks * 0.45),
      focus: 'High-intent searchers ready to buy',
    },
    {
      platform: 'Meta (Instagram & Facebook)',
      share: 40,
      color: '#a855f7',
      reach: Math.round(estimatedImpressions * 0.42),
      clicks: Math.round(estimatedClicks * 0.38),
      focus: 'Visual lifestyle feed & retargeting',
    },
    {
      platform: 'TikTok Video Ads',
      share: 20,
      color: '#ec4899',
      reach: Math.round(estimatedImpressions * 0.26),
      clicks: Math.round(estimatedClicks * 0.17),
      focus: 'Video awareness & viral demographic',
    },
  ];

  return (
    <div id="roi-reach-calculator-card" className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden text-left">
      {/* Header */}
      <div className="p-6 border-b border-slate-800/80 bg-gradient-to-r from-slate-950 via-indigo-950/30 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
              <Calculator className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                Interactive ROI & Reach Estimator
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${scaleTier.bg} ${scaleTier.color}`}>
                {scaleTier.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Estimate your customer reach, click volume, and projected revenue return based on daily budget
            </p>
          </div>
        </div>

        {/* Horizon Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 self-start md:self-auto">
          {[
            { key: 'day', label: '1 Day' },
            { key: 'week', label: '7 Days' },
            { key: 'month', label: '30 Days' },
            { key: 'quarter', label: '90 Days' },
          ].map((h) => (
            <button
              key={h.key}
              id={`calculator-horizon-${h.key}`}
              type="button"
              onClick={() => setTimeHorizon(h.key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeHorizon === h.key
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Controls on Left, Live Projections on Right */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Budget Controls & Benchmark Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Daily Budget Slider & Numeric Input */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/90 space-y-4 shadow-inner">
            <div className="flex items-center justify-between">
              <label htmlFor="daily-budget-input" className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Daily Advertising Budget</span>
              </label>
              <div className="flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                <span className="text-xs font-bold text-slate-400">$</span>
                <input
                  id="daily-budget-input"
                  type="number"
                  min={5}
                  max={2000}
                  step={5}
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(Math.max(5, Number(e.target.value)))}
                  className="w-20 bg-transparent text-sm font-bold text-white focus:outline-none text-right font-mono"
                />
                <span className="text-[11px] text-slate-400 font-medium">/day</span>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-1.5">
              <input
                id="daily-budget-slider"
                type="range"
                min={5}
                max={500}
                step={5}
                value={dailyBudget > 500 ? 500 : dailyBudget}
                onChange={(e) => setDailyBudget(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>$5/day</span>
                <span>$100/day</span>
                <span>$250/day</span>
                <span>$500+/day</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Quick Presets:</span>
              <div className="grid grid-cols-5 gap-1.5">
                {budgetPresets.map((amt) => (
                  <button
                    key={amt}
                    id={`budget-preset-${amt}`}
                    type="button"
                    onClick={() => setDailyBudget(amt)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border ${
                      dailyBudget === amt
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary of Total Spend for Horizon */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Total {timeHorizon === 'day' ? 'Daily' : timeHorizon === 'week' ? '7-Day' : timeHorizon === 'month' ? '30-Day' : '90-Day'} Investment:</span>
              <span className="font-bold text-white font-mono text-sm">${totalPeriodSpend.toLocaleString()} USD</span>
            </div>
          </div>

          {/* Strategy Channel Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Marketing Strategy Focus</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'blended', label: 'Blended (Recommended)', sub: 'Google + Meta + TikTok' },
                { id: 'google', label: 'Google Search & Maps', sub: 'Highest intent & calls' },
                { id: 'meta', label: 'Meta (IG & Facebook)', sub: 'High visual engagement' },
                { id: 'tiktok', label: 'TikTok Video Ads', sub: 'Lowest CPM / viral volume' },
              ].map((s) => (
                <button
                  key={s.id}
                  id={`strategy-btn-${s.id}`}
                  type="button"
                  onClick={() => setChannelStrategy(s.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    channelStrategy === s.id
                      ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-white">{s.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{s.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Industry Benchmark Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="industry-select" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Industry Economics Benchmark
              </label>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
              >
                <Sliders className="w-3 h-3" />
                <span>{showAdvanced ? 'Hide Fine-Tuning' : 'Fine-Tune Rates'}</span>
              </button>
            </div>

            <select
              id="industry-select"
              value={selectedIndustry}
              onChange={(e) => {
                setSelectedIndustry(e.target.value);
                setCustomConvRate(null);
                setCustomDealValue(null);
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-indigo-500"
            >
              {Object.values(INDUSTRY_BENCHMARKS).map((ind) => (
                <option key={ind.id} value={ind.id}>
                  {ind.name} (Avg Ticket: ${ind.avgDealValue} • Conv: {ind.convRate}%)
                </option>
              ))}
            </select>
          </div>

          {/* Advanced Sliders (Optional) */}
          {showAdvanced && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-3 animate-in fade-in-50">
              <div className="text-xs font-bold text-indigo-300 flex items-center justify-between">
                <span>Custom Funnel Overrides</span>
                <button
                  type="button"
                  onClick={() => {
                    setCustomConvRate(null);
                    setCustomDealValue(null);
                  }}
                  className="text-[10px] text-slate-400 hover:text-slate-200 underline"
                >
                  Reset Defaults
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Conversion Rate (%):</span>
                  <span className="font-bold text-white font-mono">{activeConvRate}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={12}
                  step={0.5}
                  value={activeConvRate}
                  onChange={(e) => setCustomConvRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Average Sale / Deal Value ($):</span>
                  <span className="font-bold text-white font-mono">${activeDealValue}</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={1500}
                  step={10}
                  value={activeDealValue}
                  onChange={(e) => setCustomDealValue(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Reach & Projected ROI Dashboard (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Key Estimated Output Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Reach & Impressions Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                  Target Audience
                </span>
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-display tracking-tight">
                  {estimatedMinReach.toLocaleString()} – {estimatedMaxReach.toLocaleString()}
                </div>
                <div className="text-xs text-cyan-300 font-medium">Estimated Unique Local Reach</div>
              </div>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Total Impressions:</span>
                <span className="font-bold text-white font-mono">~{estimatedImpressions.toLocaleString()} views</span>
              </div>
            </div>

            {/* Projected Revenue & ROAS Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  {projectedRoas}x Est. ROAS
                </span>
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-display tracking-tight text-emerald-400">
                  ${projectedRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-slate-300 font-medium">Projected Gross Return</div>
              </div>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Est. Net Profit:</span>
                <span className={`font-bold font-mono ${projectedNetProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  +${projectedNetProfit.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Click Volume Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <MousePointerClick className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-slate-400">Avg CPC ~${effectiveCpc.toFixed(2)}</span>
              </div>
              <div>
                <div className="text-xl font-bold text-white font-display">
                  ~{estimatedClicks.toLocaleString()} Clicks
                </div>
                <div className="text-xs text-slate-400">High-Intent Traffic & Page Visits</div>
              </div>
            </div>

            {/* Conversion / Leads Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <Target className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-slate-400">Est. CPA ~${estimatedCpa}</span>
              </div>
              <div>
                <div className="text-xl font-bold text-white font-display text-purple-300">
                  {estimatedConversions.toLocaleString()} Customers / Leads
                </div>
                <div className="text-xs text-slate-400">Based on {activeConvRate}% industry conversion rate</div>
              </div>
            </div>
          </div>

          {/* Platform Channel Distribution Visualizer */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Channel Reach Breakdown (${totalPeriodSpend.toLocaleString()} Total)</span>
              </span>
              <span className="text-[11px] text-slate-400">
                {timeHorizon === 'day' ? '1 Day' : timeHorizon === 'week' ? '7 Days' : timeHorizon === 'month' ? '30 Days' : '90 Days'} Allocation
              </span>
            </div>

            <div className="space-y-2.5">
              {platformEstimates.map((item) => (
                <div key={item.platform} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-white">{item.platform}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs font-mono">
                      <span className="text-slate-400">~{item.clicks.toLocaleString()} clicks</span>
                      <span className="font-bold text-cyan-300">~{item.reach.toLocaleString()} reach</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${item.share}%`, backgroundColor: item.color }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400">{item.focus}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            {onNavigateTab && (
              <button
                id="calculator-launch-campaign-btn"
                onClick={() => onNavigateTab('create')}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Deploy Campaign with ${dailyBudget}/Day Budget</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>
            )}

            {onOpenManagerModal && (
              <button
                id="calculator-consult-manager-btn"
                onClick={onOpenManagerModal}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                title="Consult Manager for Custom Scaling & Crypto Payment"
              >
                <Send className="w-3.5 h-3.5 text-cyan-400" />
                <span>Consult Manager (@Admanagersolution)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
