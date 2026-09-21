import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Target, 
  Users, 
  Send, 
  Mail, 
  Coins, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  Layers, 
  BarChart3, 
  Zap, 
  ChevronRight, 
  ChevronDown,
  Star, 
  MessageSquare,
  Globe,
  DollarSign,
  Lock,
  Compass,
  Check,
  Headphones,
  FileCheck
} from 'lucide-react';
import { BusinessProfile } from '../types';
import { RoiReachCalculator } from './RoiReachCalculator';

interface PublicWebsiteProps {
  business: BusinessProfile;
  onOpenPortal: () => void;
  onOpenManagerModal: () => void;
}

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({
  business,
  onOpenPortal,
  onOpenManagerModal,
}) => {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryBudget, setInquiryBudget] = useState('$50 - $100 / day');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
  };

  const services = [
    {
      icon: Target,
      title: 'Google High-Intent Search & Maps',
      color: 'from-blue-500 to-indigo-600',
      description: 'Capture motivated buyers actively searching for your services right now in your local zip code or nationwide.',
      features: ['Local Service Ads & Google Maps 3-Pack', 'High-Converting Negative Keyword Filtering', 'Live Call & Lead Form Attribution'],
    },
    {
      icon: Users,
      title: 'Meta (Instagram & Facebook) Ads',
      color: 'from-purple-500 to-pink-600',
      description: 'Engage your target demographic with high-performing carousel creatives, video reels, and warm retargeting sequences.',
      features: ['Demographic & Lookalike Audience Targeting', 'Dynamic Retargeting Tracking Pixels', 'Custom UGC-Style Creatives & Copy'],
    },
    {
      icon: Zap,
      title: 'TikTok Viral Video Campaigns',
      color: 'from-cyan-400 to-blue-600',
      description: 'Leverage the highest attention rates in digital marketing with snappy, authentic video ads designed for rapid brand discovery.',
      features: ['Fast-Paced Hook & Angle Testing', 'Trend-Jacked Native Audio & Sound Creatives', 'Hyper-Engaged Gen Z & Millennial Customers'],
    },
    {
      icon: BarChart3,
      title: 'Real-Time ROI & Audit Guard',
      color: 'from-emerald-400 to-teal-600',
      description: 'Never waste a penny on low-performing ads. Intelligent budget allocation shifts spend to your highest-return campaigns.',
      features: ['Autonomous 24/7 Overspend Protection', 'Transparent Live Client Portal Access', 'Instant Crypto Top-Ups with Zero Friction'],
    },
  ];

  const packages = [
    {
      name: 'Starter Local Growth',
      tag: 'Best for Small Businesses',
      budget: '$20 – $50 / day',
      price: '$450',
      period: '/ month management',
      features: [
        '1 Main Advertising Network (Google or Meta)',
        'Up to 3 Custom Ad Variations & Professional Copy',
        'Daily Budget & Negative Keyword Guard',
        'Transparent Client Dashboard Access',
        'Direct Telegram Support & Weekly Check-ins',
      ],
      popular: false,
    },
    {
      name: 'Multi-Channel Scale',
      tag: 'Most Popular',
      budget: '$50 – $200 / day',
      price: '$850',
      period: '/ month management',
      features: [
        'Google Search + Meta (Instagram & FB) Synced',
        'Full Video & Carousel Creative Design',
        'Dynamic Retargeting & Lead Optimization',
        'A/B Audience & Creative Split Testing',
        'Direct 1-on-1 Telegram Account Manager',
        'Crypto Payment (USDT / BTC / ETH) Accepted',
      ],
      popular: true,
    },
    {
      name: 'High-Velocity Dominance',
      tag: 'Regional & Multi-Location',
      budget: '$200+ / day',
      price: '$1,400',
      period: '/ month management',
      features: [
        'All 4 Networks: Google, Meta, TikTok, Maps',
        'Unlimited Campaign Scaling & Daily Refinements',
        'Custom Conversion Funnel & Landing Page Audit',
        'Priority 24/7 Telegram Hot-Line Support',
        'Dedicated Creative & Copywriting Team',
      ],
      popular: false,
    },
  ];

  const comparisons = [
    {
      feature: 'Communication Channel',
      us: 'Direct 1-on-1 Telegram (@Admanagersolution) — 24/7 rapid replies',
      them: 'Slow email ticketing with 48–72 hour delays',
    },
    {
      feature: 'Contracts & Terms',
      us: '100% Month-to-Month with zero locked contracts',
      them: 'Forced 6 to 12-month lock-in retainers',
    },
    {
      feature: 'Payment Options',
      us: 'Instant Crypto (USDT TRC20/ERC20, BTC, ETH) with zero bank holds',
      them: 'Strict bank wires, card limits, and foreign transaction fees',
    },
    {
      feature: 'Reporting & Visibility',
      us: 'Live 24/7 interactive Client Portal with exact ROAS & daily spend',
      them: 'Cluttered end-of-month PDF summaries with vanity metrics',
    },
    {
      feature: 'Campaign Launch Speed',
      us: 'Live ads running within 48 hours of onboarding',
      them: '2 to 4 weeks of repetitive setup meetings',
    },
  ];

  const testimonials = [
    {
      name: 'Marcus Vance',
      role: 'Owner, Vance Home Remodeling',
      result: '5.2x ROAS in 45 Days',
      quote: 'Within our first two weeks, our local phone calls doubled. The transparency and ability to pay via crypto without bank bureaucracy was a huge plus.',
    },
    {
      name: 'Elena Rostova',
      role: 'Founder, Lumina Aesthetic Clinic',
      result: '340+ Qualified Bookings',
      quote: 'Ad Account Manager took over our Meta and Google campaigns. We went from losing money on boosted posts to a consistent 4.8x return.',
    },
    {
      name: 'David Chen',
      role: 'E-Commerce Director, Peak Gear',
      result: '42% Lower Cost Per Purchase',
      quote: 'Having real-time dashboard analytics and instant updates over Telegram gives us complete peace of mind. Highly recommended.',
    },
  ];

  const faqs = [
    {
      q: 'How does the advertising budget work?',
      a: 'Your ad budget is paid directly to the ad platforms (Google, Meta, TikTok) or deposited via crypto directly to your dedicated ad account. Our flat agency fee covers end-to-end setup, creative production, negative keyword auditing, and daily ROAS optimization.',
    },
    {
      q: 'Which cryptocurrency payment methods are accepted?',
      a: 'We accept USDT (TRC20 and ERC20), Bitcoin (BTC), and Ethereum (ETH). Crypto transactions settle within minutes with zero banking delays, allowing immediate campaign budget top-ups.',
    },
    {
      q: 'How quickly can my new campaigns be launched?',
      a: 'Once we confirm your target audience and creative angles over Telegram, your multi-channel campaigns are drafted, approved, and live within 48 hours.',
    },
    {
      q: 'Do you require long-term contracts?',
      a: 'Never. All our management packages are strictly month-to-month. We earn your business every month through transparent results, positive ROAS, and dedicated service.',
    },
    {
      q: 'Can I view my active campaign stats anytime?',
      a: 'Yes! You have 24/7 access to our live Client Portal. You can inspect daily revenue, cost-per-click, conversion rates, and creative variations in real time without waiting for monthly reports.',
    },
  ];

  return (
    <div className="text-left space-y-24 pb-20 scroll-smooth">
      {/* Hero Section */}
      <section id="home" className="relative pt-6 sm:pt-14 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950/0 to-transparent pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-xl">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-semibold text-white">Full-Service Digital Advertising Agency</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400 font-medium">Accepting New Client Accounts</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white font-display tracking-tight leading-[1.1]">
            Smart Ads. Strong Growth.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500">
              Better Results.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We scale small businesses and high-growth brands through hyper-targeted Google, Meta, and TikTok advertising campaigns with transparent reporting and dedicated manager oversight.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <a
              href="#calculator"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Calculate Your Reach & ROI</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>

            <a
              href="https://t.me/Admanagersolution"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <Send className="w-4 h-4 text-cyan-400" />
              <span>Consult on Telegram</span>
            </a>

            <button
              onClick={onOpenPortal}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Compass className="w-4 h-4 text-indigo-400" />
              <span>Client Ad Portal</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-left space-y-1">
              <div className="text-2xl font-bold text-white font-display">4.8x</div>
              <div className="text-xs text-slate-400">Average Client ROAS</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-left space-y-1">
              <div className="text-2xl font-bold text-cyan-400 font-display">24/7</div>
              <div className="text-xs text-slate-400">Direct Telegram Desk</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-left space-y-1">
              <div className="text-2xl font-bold text-amber-400 font-display">Crypto</div>
              <div className="text-xs text-slate-400">USDT / BTC / ETH Accepted</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-left space-y-1">
              <div className="text-2xl font-bold text-emerald-400 font-display">Zero</div>
              <div className="text-xs text-slate-400">Locked Contracts</div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Standalone ROI Calculator on the Website */}
      <section id="calculator" className="scroll-mt-24 space-y-4">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-bold text-cyan-400">Interactive Estimator</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Estimate How Many Customers Your Ad Budget Will Reach
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Select your daily budget and industry to see projected impressions, high-intent clicks, and gross revenue return.
          </p>
        </div>

        <RoiReachCalculator
          business={business}
          onNavigateTab={() => onOpenPortal()}
          onOpenManagerModal={onOpenManagerModal}
        />
      </section>

      {/* Services Grid */}
      <section id="services" className="scroll-mt-24 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-400">Core Capabilities</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Multi-Network Advertising Built for Real Conversions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            We do not just buy clicks — we architect full customer acquisition funnels engineered for profitable revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.title}
                className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all space-y-4 group shadow-xl"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${svc.color} p-0.5 shadow-lg`}>
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                    {svc.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
                  {svc.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Agency Comparison Table: Why Choose Us */}
      <section id="why-us" className="scroll-mt-24 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-bold text-cyan-400">The Agency Advantage</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Why Business Owners Switch to Us
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Compare our agile, high-touch ad management against bloated traditional marketing retainers.
          </p>
        </div>

        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-12 bg-slate-950 p-4 sm:p-5 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
            <div className="col-span-4 sm:col-span-3">Deliverable</div>
            <div className="col-span-8 sm:col-span-5 text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ad Account Manager</span>
            </div>
            <div className="hidden sm:block sm:col-span-4 text-slate-500">Typical Marketing Agencies</div>
          </div>

          <div className="divide-y divide-slate-800/80">
            {comparisons.map((c) => (
              <div key={c.feature} className="grid grid-cols-12 p-4 sm:p-5 gap-3 items-center text-xs sm:text-sm">
                <div className="col-span-12 sm:col-span-3 font-semibold text-white">
                  {c.feature}
                </div>
                <div className="col-span-12 sm:col-span-5 text-slate-200 flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{c.us}</span>
                </div>
                <div className="col-span-12 sm:col-span-4 text-slate-400 flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-rose-400/80 shrink-0 mt-0.5" />
                  <span>{c.them}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing & Management Packages */}
      <section id="pricing" className="scroll-mt-24 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-bold text-cyan-400">Transparent Pricing</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Simple Management Plans for Any Stage
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Predictable flat agency fee. All ad spend is paid directly to advertising networks, with flexible crypto billing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                pkg.popular
                  ? 'bg-gradient-to-b from-indigo-950/60 via-slate-900 to-slate-950 border-2 border-indigo-500 shadow-2xl shadow-indigo-500/10'
                  : 'bg-slate-900/80 border border-slate-800'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider shadow-lg">
                  {pkg.tag}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                  <div className="text-xs text-cyan-400 font-medium mt-0.5">Ad Budget: {pkg.budget}</div>
                </div>

                <div className="flex items-baseline gap-1.5 pt-2 border-t border-slate-800">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">{pkg.price}</span>
                  <span className="text-xs text-slate-400">{pkg.period}</span>
                </div>

                <div className="pt-4 space-y-2.5">
                  {pkg.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-auto">
                <a
                  href="https://t.me/Admanagersolution"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    pkg.popular
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Start Plan via Telegram</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Client Success Stories */}
      <section id="results" className="scroll-mt-24 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-bold text-emerald-400">Verified Proof</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Trusted by Business Owners Worldwide
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real feedback from business founders who scaled their customer acquisition with our dedicated operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <div className="text-sm font-bold text-emerald-400 font-mono">
                  {t.result}
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <div className="font-semibold text-white text-xs">{t.name}</div>
                <div className="text-[11px] text-slate-400">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section id="faq" className="scroll-mt-24 space-y-8 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-400">Clear Answers</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Everything you need to know about working with our ad management team.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-cyan-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Consultation & Contact Box */}
      <section id="contact" className="scroll-mt-24 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/30">
              Direct Contact & Onboarding
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
              Ready to Turn Ad Clicks Into Paying Clients?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Reach out directly to your dedicated agency manager. We can audit your existing ad account, build fresh high-converting creatives, or launch your multi-channel growth system within 48 hours.
            </p>

            <div className="pt-2 space-y-2.5 text-xs text-slate-300">
              <a
                href="https://t.me/Admanagersolution"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors"
              >
                <Send className="w-4 h-4 text-cyan-400" />
                <span>Telegram Support: <strong className="text-white font-mono">@Admanagersolution</strong></span>
              </a>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>Email: <strong className="text-white font-mono">dccntmanager@gmail.com</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>Crypto Payments Accepted: <strong className="text-white">USDT (TRC20/ERC20), BTC, ETH</strong></span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white">
                Request a Free Ad Strategy Call
              </h3>

              {inquirySubmitted ? (
                <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <div className="text-sm font-bold text-white">Thank You! Inquiry Received</div>
                  <div className="text-xs text-slate-300">
                    Our manager will message you back within 2 hours. For instant response, message on Telegram at <strong>@Admanagersolution</strong>.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Your Name / Business</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins (Bright Dental)"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Email or Telegram Username</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. sarah@domain.com or @sarah_biz"
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Target Daily Ad Budget</label>
                    <select
                      value={inquiryBudget}
                      onChange={(e) => setInquiryBudget(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="$20 - $50 / day">$20 – $50 / day (Testing & Starter)</option>
                      <option value="$50 - $100 / day">$50 – $100 / day (Local Dominance)</option>
                      <option value="$100 - $300 / day">$100 – $300 / day (Regional Growth)</option>
                      <option value="$300+ / day">$300+ / day (High-Velocity Multi-Market)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <span>Submit Free Inquiry</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Floating Telegram Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href="https://t.me/Admanagersolution"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 text-cyan-300 border border-cyan-500/40 shadow-2xl hover:scale-105 active:scale-95 transition-all group backdrop-blur-md"
          title="Direct Telegram Chat"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <Send className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold text-white hidden sm:inline font-mono">@Admanagersolution</span>
          <span className="text-xs font-bold text-cyan-300 sm:hidden">Telegram</span>
        </a>
      </div>
    </div>
  );
};
