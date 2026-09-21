import React, { useState } from 'react';
import { Campaign, BusinessProfile, AIRecommendation } from '../types';
import { 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  MessageSquare, 
  Send, 
  RefreshCw, 
  HelpCircle,
  Flame,
  Zap,
  DollarSign,
  Mail,
  Coins,
  ExternalLink
} from 'lucide-react';

interface GrowthOptimizerProps {
  business: BusinessProfile;
  campaigns: Campaign[];
  recommendations: AIRecommendation[];
  onApplyRecommendation: (recId: string) => void;
  onRefreshAudit: () => void;
  isAuditing?: boolean;
}

export const GrowthOptimizer: React.FC<GrowthOptimizerProps> = ({
  business,
  campaigns,
  recommendations,
  onApplyRecommendation,
  onRefreshAudit,
  isAuditing = false,
}) => {
  // Advisor Chat State
  const [advisorQuery, setAdvisorQuery] = useState('');
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const [advisorChat, setAdvisorChat] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: `Hello! I'm your AI Marketing & Growth Advisor for **${business.name}**.\n\nYour current ad return is **4.5x ROAS**. I can help you scale your ad reach efficiently, find untapped local customer segments, or allocate your budget across Google, Meta, and TikTok.\n\nNeed custom agency ad accounts or want to fund ad spend via **Crypto**? Connect directly with your human account manager on Telegram **@Admanagersolution** or email **dccntmanager@gmail.com**.\n\nWhat marketing goal would you like to achieve this month?`
    }
  ]);

  const handleSendAdvisorMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!advisorQuery.trim() || advisorLoading) return;

    const userText = advisorQuery.trim();
    setAdvisorQuery('');
    setAdvisorChat(prev => [...prev, { role: 'user', text: userText }]);
    setAdvisorLoading(true);

    try {
      const response = await fetch('/api/ai/marketing-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userText,
          businessContext: {
            businessName: business.name,
            industry: business.industry,
            monthlyBudget: business.monthlyTargetBudget,
            activeCampaignsCount: campaigns.length,
            averageRoas: (campaigns.reduce((a, b) => a + b.metrics.revenue, 0) / Math.max(campaigns.reduce((a, b) => a + b.metrics.spend, 0), 1)).toFixed(2),
          }
        })
      });

      const resData = await response.json();
      if (resData.success && resData.answer) {
        setAdvisorChat(prev => [...prev, { role: 'assistant', text: resData.answer }]);
      } else {
        setAdvisorChat(prev => [...prev, { 
          role: 'assistant', 
          text: `Here is a high-leverage plan for ${business.name}:\n\n1. **Focus on High-Intent Google Search (50%)**: Direct searches like "${business.industry} near me" convert at over 15%.\n2. **Run Meta Video Testimonial Retargeting (30%)**: Keep cost-per-lead low by showing satisfied customer stories.\n3. **Reserve 20% for Local Google Maps Direct Calls**: Great for immediate customer bookings.` 
        }]);
      }
    } catch (err) {
      console.error('Advisor error:', err);
      setAdvisorChat(prev => [...prev, {
        role: 'assistant',
        text: `To scale ${business.name} efficiently:\n- Double down on your highest ROAS channel (currently Google High-Intent Search).\n- Add negative keywords to stop burning ad dollars on non-buyers.\n- Refresh your Meta ad creative every 14 days to prevent ad fatigue.`
      }]);
    } finally {
      setAdvisorLoading(false);
    }
  };

  const appliedCount = recommendations.filter(r => r.applied).length;
  const pendingCount = recommendations.filter(r => !r.applied).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Manage • Optimize • Grow</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Strong Growth Optimization Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time automated account audits and strategic advisor to scale marketing reach with minimal waste
          </p>
        </div>

        <button
          id="refresh-audit-btn"
          onClick={onRefreshAudit}
          disabled={isAuditing}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isAuditing ? 'animate-spin text-cyan-400' : ''}`} />
          <span>{isAuditing ? 'Scanning Account...' : 'Run New AI Audit'}</span>
        </button>
      </div>

      {/* Account Health Diagnostics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-500 p-0.5 shrink-0 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center">
              <span className="text-lg font-black text-white leading-none">92</span>
              <span className="text-[9px] text-cyan-400 uppercase font-bold">Health</span>
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-white">Overall Grade: A</div>
            <div className="text-xs text-slate-400 mt-0.5">High efficiency with 3 active optimizations</div>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Waste Prevention</span>
            <span className="font-bold text-emerald-400">96% Safe</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '96%' }} />
          </div>
          <div className="text-[10px] text-slate-500">Negative keywords active</div>
        </div>

        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">ROAS Benchmark</span>
            <span className="font-bold text-cyan-400">4.5x (Target: 4.0x)</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-cyan-400 h-1.5 rounded-full" style={{ width: '92%' }} />
          </div>
          <div className="text-[10px] text-slate-500">+12% over industry median</div>
        </div>

        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Creative Fatigue</span>
            <span className="font-bold text-amber-400">1 Stale Ad</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: '75%' }} />
          </div>
          <div className="text-[10px] text-slate-500">Meta retargeting CTR declining</div>
        </div>
      </div>

      {/* Two Column Section: Actionable Recommendations & Live AI Marketing Advisor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Recommendations list */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Prioritized Growth Actions ({pendingCount} Pending)</span>
            </h3>
            <span className="text-xs text-slate-400">
              {appliedCount} Applied this week
            </span>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec) => {
              const targetCamp = campaigns.find(c => c.id === rec.targetCampaignId);

              return (
                <div
                  key={rec.id}
                  className={`rounded-2xl border p-5 transition-all space-y-3 ${
                    rec.applied
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-70'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-lg'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          rec.severity === 'high'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          {rec.severity} Priority
                        </span>
                        <span className="text-xs text-slate-400 capitalize font-mono">
                          [{rec.type}]
                        </span>
                        {targetCamp && (
                          <span className="text-[11px] text-indigo-300 font-medium truncate max-w-[200px]">
                            • {targetCamp.name}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white leading-snug">
                        {rec.title}
                      </h4>
                    </div>

                    {rec.applied ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Applied</span>
                      </span>
                    ) : (
                      <button
                        id={`optimizer-apply-btn-${rec.id}`}
                        onClick={() => onApplyRecommendation(rec.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95 transition-all shrink-0 flex items-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Apply Fix</span>
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {rec.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Expected Impact: {rec.estimatedImpact}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      1-Click Instant Safe Update
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (5 cols): AI Marketing Advisor Chat */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-xl flex flex-col h-[560px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-cyan-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-display">
                  AI Marketing Strategist
                </h3>
                <p className="text-[10px] text-slate-400">Small business growth advisor</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
              Online
            </span>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-2 space-y-3 my-3 pr-1 text-xs">
            {advisorChat.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] p-3 rounded-2xl whitespace-pre-line leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {advisorLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>Strategist analyzing your marketing data...</span>
              </div>
            )}
          </div>

          {/* Suggested Quick Prompts */}
          <div className="flex flex-wrap gap-1.5 pb-2">
            {[
              'How can I get more phone calls?',
              'What is best budget split for $2k/mo?',
              'How do I lower my cost per lead?',
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setAdvisorQuery(q);
                }}
                className="text-[10px] px-2 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800/80 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendAdvisorMessage} className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <input
              type="text"
              placeholder="Ask anything about scaling your ads..."
              value={advisorQuery}
              onChange={(e) => setAdvisorQuery(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!advisorQuery.trim() || advisorLoading}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-colors shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Human Account Manager & Crypto Escalate Card */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950/40 p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <span>Need Direct Agency Account Setup or Crypto Top-Up?</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-mono border border-cyan-500/20">
                1-on-1 Support
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              Your dedicated human account manager handles enterprise unbanned agency ad accounts, custom whitelists, and rapid crypto balance funding.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <a
            href="https://t.me/Admanagersolution"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Telegram: @Admanagersolution</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          <a
            href="mailto:dccntmanager@gmail.com?subject=Growth%20Advisor%20Escalation"
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <Mail className="w-3.5 h-3.5 text-indigo-400" />
            <span>dccntmanager@gmail.com</span>
          </a>

          <div className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5" />
            <span>Payment Method: Crypto</span>
          </div>
        </div>
      </div>
    </div>
  );
};
