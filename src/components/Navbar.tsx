import React, { useState } from 'react';
import { LogoBadge } from './LogoBadge';
import { BusinessProfile } from '../types';
import { 
  Building2, 
  ChevronDown, 
  Plus, 
  Download, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  Send,
  Coins,
  Globe,
  LayoutDashboard
} from 'lucide-react';

interface NavbarProps {
  currentBusiness: BusinessProfile;
  businesses: BusinessProfile[];
  onSelectBusiness: (biz: BusinessProfile) => void;
  onOpenCreateModal: () => void;
  onOpenReportModal: () => void;
  onOpenManagerModal?: () => void;
  dateRange: string;
  onChangeDateRange: (range: string) => void;
  onRefreshData: () => void;
  isRefreshing?: boolean;
  currentMode?: 'website' | 'portal';
  onChangeMode?: (mode: 'website' | 'portal') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentBusiness,
  businesses,
  onSelectBusiness,
  onOpenCreateModal,
  onOpenReportModal,
  onOpenManagerModal,
  dateRange,
  onChangeDateRange,
  onRefreshData,
  isRefreshing = false,
  currentMode = 'website',
  onChangeMode,
}) => {
  const [showBizMenu, setShowBizMenu] = useState(false);
  const [showDateMenu, setShowDateMenu] = useState(false);

  const dateOptions = [
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 14 Days', value: '14d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Year to Date', value: 'ytd' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-4 sm:gap-6">
          <LogoBadge size="md" showText={true} />

          {/* Mode Switcher Pill */}
          {onChangeMode && (
            <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
              <button
                type="button"
                id="mode-switch-website"
                onClick={() => onChangeMode('website')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  currentMode === 'website'
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-cyan-300" />
                <span>Website</span>
              </button>
              <button
                type="button"
                id="mode-switch-portal"
                onClick={() => onChangeMode('portal')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  currentMode === 'portal'
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-indigo-300" />
                <span>Client Portal</span>
              </button>
            </div>
          )}
        </div>

        {/* Center/Right Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {currentMode === 'website' && (
            <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-300 mr-2">
              <a href="#services" className="hover:text-cyan-300 transition-colors">Services</a>
              <a href="#calculator" className="hover:text-cyan-300 transition-colors">Reach Calculator</a>
              <a href="#why-us" className="hover:text-cyan-300 transition-colors">Why Us</a>
              <a href="#pricing" className="hover:text-cyan-300 transition-colors">Pricing</a>
              <a href="#results" className="hover:text-cyan-300 transition-colors">Results</a>
              <a href="#faq" className="hover:text-cyan-300 transition-colors">FAQ</a>
              <a href="#contact" className="hover:text-cyan-300 transition-colors">Contact</a>
            </nav>
          )}

          {currentMode === 'portal' ? (
            <>
              {/* Business Switcher Dropdown */}
              <div className="relative">
            <button
              id="business-switcher-btn"
              onClick={() => setShowBizMenu(!showBizMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 transition-all text-xs sm:text-sm text-slate-200"
            >
              <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <div className="text-left hidden md:block">
                <div className="font-semibold text-white leading-tight truncate max-w-[130px]">
                  {currentBusiness.name}
                </div>
                <div className="text-[10px] text-slate-400 leading-none">
                  {currentBusiness.industry}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {/* Dropdown Menu */}
            {showBizMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="text-[11px] font-semibold text-slate-400 px-2.5 py-1.5 uppercase tracking-wider">
                  Select Business Account
                </div>
                <div className="space-y-1">
                  {businesses.map((biz) => (
                    <button
                      key={biz.id}
                      onClick={() => {
                        onSelectBusiness(biz);
                        setShowBizMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        biz.id === currentBusiness.id
                          ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                          : 'hover:bg-slate-800/70 text-slate-200'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="font-medium text-white">{biz.name}</div>
                        <div className="text-[10px] text-slate-400">{biz.location} • {biz.industry}</div>
                      </div>
                      {biz.id === currentBusiness.id && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Date Range Selector */}
          <div className="relative hidden sm:block">
            <button
              id="date-range-btn"
              onClick={() => setShowDateMenu(!showDateMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 text-xs sm:text-sm text-slate-300 transition-all"
            >
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{dateOptions.find((d) => d.value === dateRange)?.label || 'Last 14 Days'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showDateMenu && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50">
                {dateOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onChangeDateRange(opt.value);
                      setShowDateMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      opt.value === dateRange
                        ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sync / Refresh Button */}
          <button
            id="refresh-sync-btn"
            onClick={onRefreshData}
            title="Sync Latest Ad Metrics"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Dedicated Manager & Crypto Billing Button */}
          {onOpenManagerModal && (
            <button
              id="account-manager-btn"
              onClick={onOpenManagerModal}
              title="Dedicated Account Manager: Telegram @Admanagersolution | Crypto Payments"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-200 transition-all hover:border-cyan-500/50 group"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 group-hover:animate-ping" />
              <Send className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold text-white hidden md:inline">Manager:</span>
              <span className="text-cyan-300 font-mono hidden md:inline">@Admanagersolution</span>
              <span className="md:hidden font-semibold text-cyan-300">Manager</span>
              <span className="hidden xl:inline-flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-medium">
                <Coins className="w-3 h-3" />
                <span>Crypto</span>
              </span>
            </button>
          )}

          {/* Export Report Trigger */}
          <button
            id="export-report-btn"
            onClick={onOpenReportModal}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>ROI Report</span>
          </button>

          {/* Launch New Smart Ad CTA */}
          <button
            id="create-smart-ad-btn"
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span className="whitespace-nowrap">Create Smart Ad</span>
          </button>
        </>
      ) : (
        /* Website Mode Public Top Controls */
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="#calculator"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reach Calculator</span>
          </a>

          {onOpenManagerModal && (
            <button
              onClick={onOpenManagerModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 transition-all hover:border-cyan-500/50"
            >
              <Send className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline text-cyan-300 font-mono">@Admanagersolution</span>
              <span className="sm:hidden text-cyan-300">Telegram</span>
              <span className="hidden lg:inline-flex px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">
                Crypto
              </span>
            </button>
          )}

          <button
            id="website-open-portal-btn"
            onClick={() => onChangeMode?.('portal')}
            className="flex items-center gap-1.5 sm:gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="whitespace-nowrap">Client Portal</span>
          </button>
        </div>
      )}
    </div>
  </div>
</header>
  );
};
