import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { DailyChartPoint, BusinessProfile } from '../types';
import {
  TrendingUp,
  BarChart3,
  DollarSign,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Target,
  Sparkles,
  MousePointerClick
} from 'lucide-react';

interface InteractivePerformanceChartProps {
  data: DailyChartPoint[];
  business?: BusinessProfile;
  dateRange?: string;
  onChangeDateRange?: (range: string) => void;
}

type MetricMode = 'revenue_spend' | 'roas' | 'conversions' | 'traffic';

const DATE_RANGE_OPTIONS = [
  { value: '7d', label: '7 Days', title: 'Last 7 Days' },
  { value: '14d', label: '14 Days', title: 'Last 14 Days' },
  { value: '30d', label: '30 Days', title: 'Last 30 Days' },
  { value: 'ytd', label: 'Year to Date', title: '2026 Trajectory' },
];

export const InteractivePerformanceChart: React.FC<InteractivePerformanceChartProps> = ({
  data,
  business,
  dateRange = '14d',
  onChangeDateRange,
}) => {
  const [metricMode, setMetricMode] = useState<MetricMode>('revenue_spend');
  const [curveType, setCurveType] = useState<'monotone' | 'linear'>('monotone');
  const [showProfitLine, setShowProfitLine] = useState<boolean>(true);

  // Compute period aggregate totals for live scannable summary badges
  const periodTotals = useMemo(() => {
    if (!data || data.length === 0) {
      return { totalSpend: 0, totalRevenue: 0, totalProfit: 0, avgRoas: 0, totalConv: 0, avgCpa: 0, totalClicks: 0 };
    }
    const totalSpend = data.reduce((acc, d) => acc + d.spend, 0);
    const totalRevenue = data.reduce((acc, d) => acc + d.revenue, 0);
    const totalProfit = totalRevenue - totalSpend;
    const totalConv = data.reduce((acc, d) => acc + d.conversions, 0);
    const totalClicks = data.reduce((acc, d) => acc + (d.clicks || Math.round(d.spend / 1.1)), 0);
    const avgRoas = totalSpend > 0 ? (totalRevenue / totalSpend) : 0;
    const avgCpa = totalConv > 0 ? (totalSpend / totalConv) : 0;

    return {
      totalSpend,
      totalRevenue,
      totalProfit,
      avgRoas,
      totalConv,
      avgCpa,
      totalClicks,
    };
  }, [data]);

  // Target ROAS from business or default 4.5x
  const targetRoas = business?.targetRoas || 4.5;

  // Custom Dark Tooltip
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const pointData: DailyChartPoint = payload[0].payload;
      const profit = pointData.profit ?? (pointData.revenue - pointData.spend);
      const roasVal = pointData.roas || (pointData.spend > 0 ? pointData.revenue / pointData.spend : 0);

      return (
        <div className="rounded-xl bg-slate-950/95 border border-slate-800 p-3.5 shadow-2xl backdrop-blur-md min-w-[210px] text-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="font-bold text-white font-mono flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{label}</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold text-[10px] border border-indigo-500/30">
              {roasVal.toFixed(2)}x ROAS
            </span>
          </div>

          <div className="space-y-1.5 font-mono">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span className="text-slate-400">Revenue:</span>
              </span>
              <span className="font-bold text-cyan-300">${pointData.revenue.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="text-slate-400">Ad Spend:</span>
              </span>
              <span className="font-bold text-rose-300">${pointData.spend.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-800/60">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-slate-400">Net Profit:</span>
              </span>
              <span className="font-bold text-emerald-400">+${profit.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                <span>Conversions:</span>
              </span>
              <span className="font-semibold text-purple-300">{pointData.conversions} leads/orders</span>
            </div>

            {pointData.clicks && (
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                  <span>Clicks:</span>
                </span>
                <span className="font-semibold text-slate-300">{pointData.clicks}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="interactive-performance-chart-card" className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-6">
      {/* Top Header & Interactive Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white font-display">
              Interactive Performance & Growth Trends
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-mono">
              Recharts Live
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time multi-metric trajectory over your selected window ({DATE_RANGE_OPTIONS.find(d => d.value === dateRange)?.title || '14 Days'})
          </p>
        </div>

        {/* Date Range Pills & Metric Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range Selector */}
          <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
            {DATE_RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                id={`chart-range-btn-${opt.value}`}
                type="button"
                onClick={() => onChangeDateRange?.(opt.value)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  dateRange === opt.value
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Metric Selector Tabs */}
          <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
            {[
              { id: 'revenue_spend', label: 'Rev & Spend' },
              { id: 'roas', label: 'ROAS Ratio' },
              { id: 'conversions', label: 'Conversions' },
              { id: 'traffic', label: 'Traffic & Clicks' },
            ].map((m) => (
              <button
                key={m.id}
                id={`chart-metric-btn-${m.id}`}
                type="button"
                onClick={() => setMetricMode(m.id as MetricMode)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  metricMode === m.id
                    ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Period Quick-Stat KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="text-[11px] text-slate-400">Total Period Revenue</div>
          <div className="text-base sm:text-lg font-bold text-white font-mono mt-0.5">
            ${periodTotals.totalRevenue.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>+${periodTotals.totalProfit.toLocaleString()} Net Gain</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="text-[11px] text-slate-400">Total Ad Spend</div>
          <div className="text-base sm:text-lg font-bold text-rose-300 font-mono mt-0.5">
            ${periodTotals.totalSpend.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {(periodTotals.totalSpend / (data.length || 1)).toFixed(1)}/day avg pace
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="text-[11px] text-slate-400">Average ROAS Return</div>
          <div className="text-base sm:text-lg font-bold text-cyan-400 font-mono mt-0.5">
            {periodTotals.avgRoas.toFixed(2)}x
          </div>
          <div className="text-[10px] text-cyan-300 mt-0.5">
            vs. {targetRoas.toFixed(1)}x Target (+{(periodTotals.avgRoas - targetRoas).toFixed(2)}x)
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="text-[11px] text-slate-400">Total Customer Conversions</div>
          <div className="text-base sm:text-lg font-bold text-purple-300 font-mono mt-0.5">
            {periodTotals.totalConv} Leads/Orders
          </div>
          <div className="text-[10px] text-purple-400 mt-0.5">
            ${periodTotals.avgCpa.toFixed(2)} avg CPA
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-[320px] select-none">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="cyanLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="emeraldLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#1e293b"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              dy={6}
            />

            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => {
                if (metricMode === 'roas') return `${val}x`;
                if (metricMode === 'conversions') return `${val}`;
                if (metricMode === 'traffic') return `${val}`;
                return `$${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`;
              }}
            />

            <Tooltip content={<CustomChartTooltip />} />

            {/* Target Reference Line for ROAS */}
            {metricMode === 'roas' && (
              <ReferenceLine
                y={targetRoas}
                stroke="#10b981"
                strokeDasharray="4 4"
                label={{
                  value: `Target ROAS: ${targetRoas}x`,
                  fill: '#34d399',
                  fontSize: 11,
                  position: 'insideTopRight',
                }}
              />
            )}

            {/* Metric Mode 1: Revenue vs Spend & Net Profit */}
            {metricMode === 'revenue_spend' && (
              <>
                <Line
                  type={curveType}
                  dataKey="revenue"
                  name="Revenue Generated ($)"
                  stroke="url(#cyanLineGradient)"
                  strokeWidth={3}
                  dot={{ r: 3, fill: '#06b6d4', stroke: '#0f172a', strokeWidth: 1.5 }}
                  activeDot={{ r: 6, fill: '#ffffff', stroke: '#06b6d4', strokeWidth: 2 }}
                />

                <Line
                  type={curveType}
                  dataKey="spend"
                  name="Ad Spend ($)"
                  stroke="#fb7185"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 2.5, fill: '#fb7185' }}
                  activeDot={{ r: 5, fill: '#ffffff', stroke: '#fb7185', strokeWidth: 2 }}
                />

                {showProfitLine && (
                  <Line
                    type={curveType}
                    dataKey="profit"
                    name="Net Ad Profit ($)"
                    stroke="url(#emeraldLineGradient)"
                    strokeWidth={2}
                    dot={{ r: 2.5, fill: '#10b981' }}
                    activeDot={{ r: 5, fill: '#ffffff', stroke: '#10b981', strokeWidth: 2 }}
                  />
                )}
              </>
            )}

            {/* Metric Mode 2: ROAS Multiplier */}
            {metricMode === 'roas' && (
              <Line
                type={curveType}
                dataKey="roas"
                name="ROAS Multiplier (x)"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 3.5, fill: '#10b981', stroke: '#0f172a', strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: '#ffffff', stroke: '#10b981', strokeWidth: 2 }}
              />
            )}

            {/* Metric Mode 3: Conversions */}
            {metricMode === 'conversions' && (
              <>
                <Line
                  type={curveType}
                  dataKey="conversions"
                  name="Customer Conversions"
                  stroke="#c084fc"
                  strokeWidth={3}
                  dot={{ r: 3.5, fill: '#c084fc', stroke: '#0f172a', strokeWidth: 1.5 }}
                  activeDot={{ r: 6, fill: '#ffffff', stroke: '#c084fc', strokeWidth: 2 }}
                />
                <Line
                  type={curveType}
                  dataKey="cpa"
                  name="Cost Per Acquisition ($)"
                  stroke="#fbbf24"
                  strokeWidth={2}
                  strokeDasharray="4 3"
                  dot={{ r: 2.5, fill: '#fbbf24' }}
                  activeDot={{ r: 5, fill: '#ffffff', stroke: '#fbbf24', strokeWidth: 2 }}
                />
              </>
            )}

            {/* Metric Mode 4: Traffic / Clicks */}
            {metricMode === 'traffic' && (
              <Line
                type={curveType}
                dataKey="clicks"
                name="Daily Clicks"
                stroke="#60a5fa"
                strokeWidth={3}
                dot={{ r: 3, fill: '#60a5fa', stroke: '#0f172a', strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: '#ffffff', stroke: '#60a5fa', strokeWidth: 2 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer with Interactive Legend and View Modifiers */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
        {/* Legend Indicators */}
        <div className="flex flex-wrap items-center gap-4">
          {metricMode === 'revenue_spend' && (
            <>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-1 rounded-full bg-cyan-400" />
                <span>Revenue ($)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-1 rounded-full bg-rose-400 border-dashed" />
                <span>Ad Spend ($)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowProfitLine(!showProfitLine)}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                  showProfitLine ? 'text-emerald-400 font-semibold' : 'text-slate-500 line-through'
                }`}
              >
                <span className="w-3 h-1 rounded-full bg-emerald-400" />
                <span>Net Profit ($)</span>
              </button>
            </>
          )}

          {metricMode === 'roas' && (
            <>
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-3 h-1 rounded-full bg-emerald-400" />
                <span>Actual Daily ROAS (x)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3 h-0.5 bg-emerald-500/60 border-dashed" />
                <span>Target Benchmark ({targetRoas}x)</span>
              </div>
            </>
          )}

          {metricMode === 'conversions' && (
            <>
              <div className="flex items-center gap-1.5 text-purple-300 font-semibold">
                <span className="w-3 h-1 rounded-full bg-purple-400" />
                <span>Daily Customer Conversions</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-300">
                <span className="w-3 h-1 rounded-full bg-amber-400 border-dashed" />
                <span>CPA ($/Acquisition)</span>
              </div>
            </>
          )}

          {metricMode === 'traffic' && (
            <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
              <span className="w-3 h-1 rounded-full bg-blue-400" />
              <span>High-Intent Ad Clicks</span>
            </div>
          )}
        </div>

        {/* View Options */}
        <div className="flex items-center gap-3 self-end sm:self-auto text-[11px]">
          <button
            type="button"
            onClick={() => setCurveType(curveType === 'monotone' ? 'linear' : 'monotone')}
            className="text-slate-400 hover:text-white transition-colors"
          >
            Curve: <span className="text-cyan-400 font-mono capitalize">{curveType}</span>
          </button>

          <span className="text-slate-700">•</span>

          <span className="text-slate-400">
            {data.length} Data Points Analyzed
          </span>
        </div>
      </div>
    </div>
  );
};
