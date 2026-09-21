import React from 'react';
import { BusinessProfile, Campaign } from '../types';
import { LogoBadge } from './LogoBadge';
import { Download, Printer, X, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';

interface ReportExportModalProps {
  business: BusinessProfile;
  campaigns: Campaign[];
  dateRange: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  business,
  campaigns,
  dateRange,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const totalSpend = campaigns.reduce((a, b) => a + b.metrics.spend, 0);
  const totalRevenue = campaigns.reduce((a, b) => a + b.metrics.revenue, 0);
  const totalConversions = campaigns.reduce((a, b) => a + b.metrics.conversions, 0);
  const totalClicks = campaigns.reduce((a, b) => a + b.metrics.clicks, 0);
  const totalImpressions = campaigns.reduce((a, b) => a + b.metrics.impressions, 0);
  const roas = totalSpend > 0 ? (totalRevenue / totalSpend) : 0;
  const avgCpa = totalConversions > 0 ? (totalSpend / totalConversions) : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    const headers = ['Campaign Name', 'Platform', 'Status', 'Daily Budget', 'Total Spend', 'Revenue', 'ROAS', 'Conversions', 'CPA', 'Clicks', 'CTR'];
    const rows = campaigns.map(c => [
      `"${c.name}"`,
      c.platform,
      c.status,
      c.dailyBudget,
      c.metrics.spend,
      c.metrics.revenue,
      c.metrics.roas.toFixed(2),
      c.metrics.conversions,
      c.metrics.cpa.toFixed(2),
      c.metrics.clicks,
      `${c.metrics.ctr.toFixed(2)}%`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${business.name.replace(/\s+/g, '_')}_Ad_Performance_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 text-left">
        {/* Actions header (hidden when printing) */}
        <div className="print:hidden flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="font-bold text-white">Executive Performance Report</span>
            <span>•</span>
            <span>{business.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCsv}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="p-6 sm:p-8 space-y-6 bg-slate-950 text-slate-100 print:bg-white print:text-black">
          {/* Brand Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-6 print:border-slate-300">
            <LogoBadge size="md" showText={true} />

            <div className="text-right text-xs space-y-0.5">
              <div className="font-bold text-white print:text-black text-sm">{business.name}</div>
              <div className="text-slate-400 print:text-slate-600">{business.industry} • {business.location}</div>
              <div className="text-slate-400 print:text-slate-600">Reporting Window: {dateRange.toUpperCase()}</div>
              <div className="text-[10px] text-cyan-400 print:text-blue-600 font-mono">Generated: {new Date().toLocaleDateString()}</div>
            </div>
          </div>

          {/* Executive Summary Narrative */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 print:border-slate-300 print:bg-slate-50 space-y-1">
            <div className="text-xs font-bold text-cyan-400 print:text-blue-700 uppercase tracking-wider">
              Executive Summary
            </div>
            <p className="text-xs sm:text-sm text-slate-300 print:text-slate-700 leading-relaxed">
              During this reporting cycle, <strong>{business.name}</strong> deployed a total advertising spend of <strong>${totalSpend.toLocaleString()}</strong> across targeted channels, producing <strong>${totalRevenue.toLocaleString()}</strong> in verified top-line return. The blended Return on Ad Spend (ROAS) reached <strong>{roas.toFixed(2)}x</strong> with <strong>{totalConversions}</strong> customer conversions at an average acquisition cost of <strong>${avgCpa.toFixed(2)}</strong>.
            </p>
          </div>

          {/* KPI Scorecards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 print:border-slate-300 print:bg-slate-50">
              <div className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-semibold">Total Ad Spend</div>
              <div className="text-lg sm:text-xl font-black text-white print:text-black mt-1">${totalSpend.toLocaleString()}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 print:border-slate-300 print:bg-slate-50">
              <div className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-semibold">Revenue Return</div>
              <div className="text-lg sm:text-xl font-black text-emerald-400 print:text-emerald-700 mt-1">${totalRevenue.toLocaleString()}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 print:border-slate-300 print:bg-slate-50">
              <div className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-semibold">Blended ROAS</div>
              <div className="text-lg sm:text-xl font-black text-cyan-400 print:text-blue-700 mt-1">{roas.toFixed(2)}x</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 print:border-slate-300 print:bg-slate-50">
              <div className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-semibold">Conversions</div>
              <div className="text-lg sm:text-xl font-black text-purple-400 print:text-purple-700 mt-1">{totalConversions}</div>
            </div>
          </div>

          {/* Campaign Table Breakdown */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-white print:text-black">Channel & Campaign Breakdown</div>
            <div className="overflow-x-auto border border-slate-800 print:border-slate-300 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 print:bg-slate-100 text-slate-300 print:text-slate-700 border-b border-slate-800 print:border-slate-300">
                  <tr>
                    <th className="p-2.5">Campaign Name</th>
                    <th className="p-2.5">Network</th>
                    <th className="p-2.5">Spend</th>
                    <th className="p-2.5">Revenue</th>
                    <th className="p-2.5">ROAS</th>
                    <th className="p-2.5">Conversions</th>
                    <th className="p-2.5">Avg CPA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                  {campaigns.map(c => (
                    <tr key={c.id} className="text-slate-300 print:text-slate-800">
                      <td className="p-2.5 font-medium text-white print:text-black">{c.name}</td>
                      <td className="p-2.5 capitalize">{c.platform.replace('_', ' ')}</td>
                      <td className="p-2.5 font-mono">${c.metrics.spend.toLocaleString()}</td>
                      <td className="p-2.5 font-mono text-emerald-400 print:text-emerald-700">${c.metrics.revenue.toLocaleString()}</td>
                      <td className="p-2.5 font-bold">{c.metrics.roas.toFixed(2)}x</td>
                      <td className="p-2.5">{c.metrics.conversions}</td>
                      <td className="p-2.5 font-mono">${c.metrics.cpa.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendations / Scaling Steps */}
          <div className="pt-2 border-t border-slate-800 print:border-slate-300 text-xs text-slate-400 print:text-slate-600 space-y-1">
            <div className="font-bold text-white print:text-black">Next Steps For Next Billing Period:</div>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Increase Google Search Intent budget by $15/day to capture unserved local queries.</li>
              <li>Deploy refreshed AI creative hook on Meta to counter ad fatigue.</li>
              <li>Continue filtering negative search terms to keep wasted spend under 3%.</li>
            </ul>
          </div>

          {/* Dedicated Account Manager & Billing Credentials */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 print:border-slate-300 print:bg-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-white print:text-black flex items-center gap-1.5">
                <span>Dedicated Account Manager</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">Active</span>
              </div>
              <div className="text-slate-300 print:text-slate-700 mt-0.5">
                Telegram: <span className="font-mono font-bold text-cyan-400 print:text-blue-700">@Admanagersolution</span> • Email: <span className="font-mono text-white print:text-black">dccntmanager@gmail.com</span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400 print:text-slate-600">Settlement / Billing</div>
              <div className="font-semibold text-amber-400 print:text-amber-700">Payment Method: Crypto</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
