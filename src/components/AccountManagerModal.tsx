import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Mail, 
  Copy, 
  Check, 
  Coins, 
  ShieldCheck, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  DollarSign, 
  ArrowRight,
  Wallet
} from 'lucide-react';
import { BusinessProfile } from '../types';

interface AccountManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessProfile;
}

export const AccountManagerModal: React.FC<AccountManagerModalProps> = ({
  isOpen,
  onClose,
  business,
}) => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(500);
  const [selectedCrypto, setSelectedCrypto] = useState<'USDT' | 'BTC' | 'ETH'>('USDT');

  if (!isOpen) return null;

  const telegramHandle = '@Admanagersolution';
  const telegramUrl = 'https://t.me/Admanagersolution';
  const emailAddress = 'dccntmanager@gmail.com';
  const paymentMethod = 'Crypto (USDT, BTC, ETH)';

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(type);
    setTimeout(() => setCopiedItem(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 text-left">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400 font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white font-display">
                  Dedicated Account Manager
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
                  Online & Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Direct contact, agency management support, and crypto billing for {business.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Manager Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Telegram Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Telegram Handle
                    </div>
                    <div className="text-sm font-bold text-white">
                      {telegramHandle}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Fastest Reply
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Open Telegram</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                </a>
                <button
                  onClick={() => handleCopy(telegramHandle, 'telegram')}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                  title="Copy Handle"
                >
                  {copiedItem === 'telegram' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Email Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Direct Email
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white truncate max-w-[150px] sm:max-w-none">
                      {emailAddress}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <a
                  href={`mailto:${emailAddress}?subject=Ad%20Account%20Management%20Inquiry%20-%20${encodeURIComponent(business.name)}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                </a>
                <button
                  onClick={() => handleCopy(emailAddress, 'email')}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                  title="Copy Email"
                >
                  {copiedItem === 'email' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Crypto Payment Method Section */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/30 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-display">
                    Payment Method: Crypto
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Instant ad budget top-up & management retainers settled via cryptocurrency
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                {['USDT (TRC20/ERC20)', 'BTC', 'ETH'].map((token) => (
                  <span
                    key={token}
                    className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono font-semibold text-cyan-300"
                  >
                    {token}
                  </span>
                ))}
              </div>
            </div>

            {/* Crypto Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="text-[10px] font-bold text-cyan-400 uppercase">Instant Activation</div>
                <div className="text-slate-300">Zero banking hold delays; ad accounts funded in minutes.</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="text-[10px] font-bold text-indigo-400 uppercase">Zero Card Declines</div>
                <div className="text-slate-300">Immune to traditional bank fraud triggers & international blocks.</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="text-[10px] font-bold text-emerald-400 uppercase">Direct Ledger Verification</div>
                <div className="text-slate-300">Transparent on-chain settlement with itemized receipts.</div>
              </div>
            </div>

            {/* Crypto Budget Top-Up Calculator */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Request Ad Budget Top-Up via Crypto</span>
                </span>
                <span className="text-[11px] text-slate-400">Preferred: USDT (Tether)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Ad Spend Amount ($ USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-bold">$</span>
                    <input
                      type="number"
                      step={50}
                      min={100}
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(Math.max(Number(e.target.value), 0))}
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Select Currency
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['USDT', 'BTC', 'ETH'] as const).map((curr) => (
                      <button
                        key={curr}
                        type="button"
                        onClick={() => setSelectedCrypto(curr)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all ${
                          selectedCrypto === curr
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ready to deploy CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="text-slate-400 text-[11px]">
                  Estimated deposit: <strong className="text-white">${depositAmount.toLocaleString()} USD</strong> equivalent in <strong className="text-cyan-400">{selectedCrypto}</strong>.
                </div>

                <a
                  href={`https://t.me/Admanagersolution?text=${encodeURIComponent(`Hi, I would like to top up $${depositAmount} USD in ad budget for ${business.name} via Crypto (${selectedCrypto}). Please send payment details.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Crypto Request on Telegram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick FAQ / Guidance */}
          <div className="text-xs text-slate-400 space-y-1.5 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
            <div className="font-semibold text-slate-200">How Crypto Ad Account Management Works:</div>
            <p className="leading-relaxed">
              1. Reach out on Telegram (<strong>{telegramHandle}</strong>) or via email (<strong>{emailAddress}</strong>) with your campaign objectives.
            </p>
            <p className="leading-relaxed">
              2. Transfer your advertising allocation via <strong>Crypto</strong> to receive guaranteed zero-chargeback, instant credit onto your active Google, Meta, or TikTok campaigns.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-mono text-cyan-400">Telegram: @Admanagersolution</span>
            <span>•</span>
            <span className="font-mono text-slate-300">dccntmanager@gmail.com</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
