/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { CampaignsManager } from './components/CampaignsManager';
import { GrowthOptimizer } from './components/GrowthOptimizer';
import { CreativeStudio } from './components/CreativeStudio';
import { SmartAdWizard } from './components/SmartAdWizard';
import { ReportExportModal } from './components/ReportExportModal';
import { CampaignDetailsModal } from './components/CampaignDetailsModal';
import { AccountManagerModal } from './components/AccountManagerModal';
import { PublicWebsite } from './components/PublicWebsite';
import { 
  INITIAL_BUSINESSES, 
  INITIAL_CAMPAIGNS, 
  INITIAL_CHART_DATA, 
  INITIAL_RECOMMENDATIONS,
  getPerformanceTrendData
} from './data/mockInitialData';
import { BusinessProfile, Campaign, AIRecommendation, DailyChartPoint } from './types';
import { 
  LayoutDashboard, 
  Layers, 
  Sparkles, 
  Image as ImageIcon, 
  CheckCircle2, 
  Bell, 
  ShieldCheck,
  TrendingUp,
  Send,
  Mail,
  Coins,
  ExternalLink,
  Globe
} from 'lucide-react';

export default function App() {
  // Website vs Portal Mode (defaults to website for public visitors)
  const [currentMode, setCurrentMode] = useState<'website' | 'portal'>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'portal') return 'portal';
      const saved = localStorage.getItem('aam_mode');
      return (saved === 'portal' || saved === 'website') ? (saved as any) : 'website';
    } catch {
      return 'website';
    }
  });

  // Load saved state or default
  const [businesses, setBusinesses] = useState<BusinessProfile[]>(() => {
    const saved = localStorage.getItem('aam_businesses');
    return saved ? JSON.parse(saved) : INITIAL_BUSINESSES;
  });

  const [currentBusiness, setCurrentBusiness] = useState<BusinessProfile>(() => {
    return businesses[0] || INITIAL_BUSINESSES[0];
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('aam_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [chartData, setChartData] = useState<DailyChartPoint[]>(INITIAL_CHART_DATA);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(() => {
    const saved = localStorage.getItem('aam_recommendations');
    return saved ? JSON.parse(saved) : INITIAL_RECOMMENDATIONS;
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'optimize' | 'creative'>('overview');
  const [dateRange, setDateRange] = useState<string>('14d');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState<boolean>(false);
  const [inspectCampaign, setInspectCampaign] = useState<Campaign | null>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  const showToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('aam_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('aam_recommendations', JSON.stringify(recommendations));
  }, [recommendations]);

  useEffect(() => {
    localStorage.setItem('aam_businesses', JSON.stringify(businesses));
  }, [businesses]);

  // Synchronize chart data with selected date range
  useEffect(() => {
    setChartData(getPerformanceTrendData(dateRange));
  }, [dateRange]);

  // Campaign status toggle
  const handleToggleStatus = (campId: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === campId) {
        const nextStatus = c.status === 'active' ? 'paused' : 'active';
        showToast(
          nextStatus === 'active' ? 'Campaign Activated' : 'Campaign Paused',
          `"${c.name}" is now ${nextStatus}.`
        );
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  // Campaign budget update
  const handleUpdateBudget = (campId: string, newBudget: number) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === campId) {
        showToast('Daily Budget Updated', `"${c.name}" updated to $${newBudget}/day.`);
        return { ...c, dailyBudget: newBudget };
      }
      return c;
    }));
  };

  // Delete Campaign
  const handleDeleteCampaign = (campId: string) => {
    const target = campaigns.find(c => c.id === campId);
    setCampaigns(prev => prev.filter(c => c.id !== campId));
    showToast('Campaign Removed', `"${target?.name || 'Campaign'}" was deleted.`);
  };

  // Duplicate Campaign
  const handleDuplicateCampaign = (campId: string) => {
    const target = campaigns.find(c => c.id === campId);
    if (!target) return;
    const duplicated: Campaign = {
      ...target,
      id: `camp-${Date.now()}`,
      name: `${target.name} (Copy)`,
      status: 'paused',
      metrics: { ...target.metrics, spend: 0, revenue: 0, conversions: 0, clicks: 0, impressions: 0 },
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setCampaigns(prev => [duplicated, ...prev]);
    showToast('Campaign Duplicated', `"${duplicated.name}" created in paused state.`);
  };

  // Launch from Smart Ads Wizard
  const handleLaunchNewCampaign = (newCamp: Campaign) => {
    setCampaigns(prev => [newCamp, ...prev]);
    showToast('Smart Ad Launched!', `"${newCamp.name}" is now live and optimizing.`);
    setActiveTab('campaigns');
  };

  // Apply AI Recommendation
  const handleApplyRecommendation = (recId: string) => {
    const rec = recommendations.find(r => r.id === recId);
    if (!rec) return;

    // Apply mutation based on action type
    if (rec.actionType === 'INCREASE_BUDGET' && rec.targetCampaignId && rec.suggestedValue) {
      setCampaigns(prev => prev.map(c => {
        if (c.id === rec.targetCampaignId) {
          return { ...c, dailyBudget: rec.suggestedValue! };
        }
        return c;
      }));
    } else if (rec.actionType === 'ADD_NEGATIVE_KEYWORDS' && rec.targetCampaignId) {
      setCampaigns(prev => prev.map(c => {
        if (c.id === rec.targetCampaignId) {
          const newNegs = ['free', 'cheap', 'diy', 'coupon cheat', 'tutorial pdf'];
          return {
            ...c,
            targeting: {
              ...c.targeting,
              negativeKeywords: Array.from(new Set([...c.targeting.negativeKeywords, ...newNegs]))
            }
          };
        }
        return c;
      }));
    } else if (rec.actionType === 'REFRESH_CREATIVE' && rec.targetCampaignId) {
      setCampaigns(prev => prev.map(c => {
        if (c.id === rec.targetCampaignId) {
          return {
            ...c,
            creative: {
              ...c.creative,
              headline: `Austin's #1 Choice | Real Reviews & Proven Results`,
              primaryText: `Over 350+ 5-Star Reviews: See why locals switch to ${currentBusiness.name}. Claim your limited trial before spots fill up!`
            }
          };
        }
        return c;
      }));
    }

    // Mark as applied
    setRecommendations(prev => prev.map(r => r.id === recId ? { ...r, applied: true } : r));
    showToast('Growth Optimization Applied', `${rec.title} is now active.`);
  };

  // Refresh Sync Simulation
  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Live Ad Sync Complete', 'All metrics synced with Google, Meta, TikTok, and Maps APIs.');
    }, 900);
  };

  // Run AI Audit
  const handleRefreshAudit = async () => {
    setIsAuditing(true);
    try {
      const totalSpend = campaigns.reduce((a, b) => a + b.metrics.spend, 0);
      const totalRev = campaigns.reduce((a, b) => a + b.metrics.revenue, 0);
      const roas = totalSpend > 0 ? (totalRev / totalSpend).toFixed(2) : '4.5';

      const res = await fetch('/api/ai/audit-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaigns,
          totalSpend,
          totalRevenue: totalRev,
          roas,
        })
      });

      const data = await res.json();
      if (data.success && data.recommendations?.length) {
        setRecommendations(data.recommendations);
        showToast('Account Audit Finished', `Generated ${data.recommendations.length} smart growth recommendations.`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Navbar
        currentBusiness={currentBusiness}
        businesses={businesses}
        onSelectBusiness={(biz) => {
          setCurrentBusiness(biz);
          showToast('Business Switched', `Active workspace: ${biz.name}`);
        }}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenManagerModal={() => setIsManagerModalOpen(true)}
        dateRange={dateRange}
        onChangeDateRange={(range) => {
          setDateRange(range);
          showToast('Date Range Adjusted', `Displaying analytics for ${range.toUpperCase()}`);
        }}
        onRefreshData={handleRefreshData}
        isRefreshing={isRefreshing}
        currentMode={currentMode}
        onChangeMode={(mode) => {
          setCurrentMode(mode);
          try {
            localStorage.setItem('aam_mode', mode);
          } catch {}
        }}
      />

      {/* Navigation Tabs Bar (Visible in Client Portal Mode) */}
      {currentMode === 'portal' && (
        <div className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-20 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 sm:gap-2 py-2">
              {[
                { id: 'overview', label: 'Dashboard & Metrics', icon: LayoutDashboard },
                { id: 'campaigns', label: `Campaigns (${campaigns.length})`, icon: Layers },
                { 
                  id: 'optimize', 
                  label: 'Strong Growth & AI Advisor', 
                  icon: Sparkles,
                  badge: recommendations.filter(r => !r.applied).length
                },
                { id: 'creative', label: 'Ad Preview & Copy Lab', icon: ImageIcon },
              ].map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    id={`tab-${t.id}`}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600/30 to-cyan-500/20 text-cyan-300 border border-indigo-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{t.label}</span>
                    {t.badge ? (
                      <span className="ml-1 px-1.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-bold text-[10px]">
                        {t.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Budgets Guarded Against Overspend</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentMode === 'website' ? (
          <PublicWebsite
            business={currentBusiness}
            onOpenPortal={() => {
              setCurrentMode('portal');
              try {
                localStorage.setItem('aam_mode', 'portal');
              } catch {}
            }}
            onOpenManagerModal={() => setIsManagerModalOpen(true)}
          />
        ) : (
          <>
            {activeTab === 'overview' && (
              <DashboardOverview
                business={currentBusiness}
                campaigns={campaigns}
                chartData={chartData}
                recommendations={recommendations}
                dateRange={dateRange}
                onChangeDateRange={(range) => {
                  setDateRange(range);
                  showToast('Date Range Adjusted', `Displaying analytics for ${range.toUpperCase()}`);
                }}
                onNavigateTab={(tab) => {
                  if (tab === 'create') {
                    setIsCreateModalOpen(true);
                  } else {
                    setActiveTab(tab);
                  }
                }}
                onApplyRecommendation={handleApplyRecommendation}
                onOpenManagerModal={() => setIsManagerModalOpen(true)}
              />
            )}

            {activeTab === 'campaigns' && (
              <CampaignsManager
                campaigns={campaigns}
                onToggleStatus={handleToggleStatus}
                onUpdateBudget={handleUpdateBudget}
                onDeleteCampaign={handleDeleteCampaign}
                onDuplicateCampaign={handleDuplicateCampaign}
                onOpenCreateModal={() => setIsCreateModalOpen(true)}
                onSelectCampaignDetails={(camp) => setInspectCampaign(camp)}
              />
            )}

            {activeTab === 'optimize' && (
              <GrowthOptimizer
                business={currentBusiness}
                campaigns={campaigns}
                recommendations={recommendations}
                onApplyRecommendation={handleApplyRecommendation}
                onRefreshAudit={handleRefreshAudit}
                isAuditing={isAuditing}
              />
            )}

            {activeTab === 'creative' && (
              <CreativeStudio
                business={currentBusiness}
                campaigns={campaigns}
              />
            )}
          </>
        )}
      </main>

      {/* Footer with Dedicated Manager Contact & Crypto Payment Details */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-900">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-600 p-0.5 shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-400 font-bold text-xs">
                  AAM
                </div>
              </div>
              <div>
                <div className="font-bold text-white text-sm font-display">Ad Account Manager</div>
                <div className="text-xs text-slate-400">Smart Ads. Strong Growth. Better Results. US ALL.</div>
              </div>
            </div>

            {/* Direct Contact & Payment Method */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <a
                href="https://t.me/Admanagersolution"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 transition-colors"
                title="Telegram Support"
              >
                <Send className="w-3.5 h-3.5 text-cyan-400" />
                <span>Telegram: <strong className="font-mono text-white">@Admanagersolution</strong></span>
              </a>

              <a
                href="mailto:dccntmanager@gmail.com"
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center gap-1.5 transition-colors"
                title="Email Support"
              >
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-mono">dccntmanager@gmail.com</span>
              </a>

              <button
                onClick={() => setIsManagerModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Crypto Payment Details"
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>Payment Method: <strong className="text-white">Crypto</strong></span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex flex-wrap items-center gap-4">
              <a href="#services" className="hover:text-cyan-300 transition-colors">Services</a>
              <a href="#calculator" className="hover:text-cyan-300 transition-colors">Reach Calculator</a>
              <a href="#why-us" className="hover:text-cyan-300 transition-colors">Why Us</a>
              <a href="#pricing" className="hover:text-cyan-300 transition-colors">Pricing</a>
              <a href="#results" className="hover:text-cyan-300 transition-colors">Case Studies</a>
              <a href="#faq" className="hover:text-cyan-300 transition-colors">FAQ</a>
              <button 
                onClick={() => setCurrentMode(currentMode === 'website' ? 'portal' : 'website')} 
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                {currentMode === 'website' ? 'Launch Client Portal' : 'View Public Website'}
              </button>
            </div>

            <div className="flex items-center gap-4 text-slate-500">
              <span>Payment Method: <strong className="text-amber-400 font-normal">Crypto Accepted (USDT/BTC/ETH)</strong></span>
              <span>•</span>
              <span className="text-cyan-400">Instant Ad Top-Ups</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-600 text-center sm:text-left">
            © {new Date().getFullYear()} Ad Account Manager. Smart Ads. Strong Growth. Better Results. Dedicated agency ad management for small businesses worldwide.
          </div>
        </div>
      </footer>

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex items-start gap-3 max-w-sm animate-in slide-in-from-bottom-5 duration-200">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-white">{toastMessage.title}</div>
            <div className="text-[11px] text-slate-300">{toastMessage.desc}</div>
          </div>
        </div>
      )}

      {/* Dedicated Account Manager & Crypto Billing Modal */}
      <AccountManagerModal
        business={currentBusiness}
        isOpen={isManagerModalOpen}
        onClose={() => setIsManagerModalOpen(false)}
      />

      {/* Smart Ads Creation Wizard Modal */}
      <SmartAdWizard
        business={currentBusiness}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onLaunchCampaign={handleLaunchNewCampaign}
      />

      {/* ROI Report Export Modal */}
      <ReportExportModal
        business={currentBusiness}
        campaigns={campaigns}
        dateRange={dateRange}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      {/* Campaign Details & Stats Inspector Modal */}
      <CampaignDetailsModal
        campaign={inspectCampaign}
        isOpen={Boolean(inspectCampaign)}
        onClose={() => setInspectCampaign(null)}
      />
    </div>
  );
}
