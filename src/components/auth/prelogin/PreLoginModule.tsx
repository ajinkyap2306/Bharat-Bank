import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, Lock, Phone, PlayCircle, Shield, ShieldCheck } from 'lucide-react';
import {
  ATM_LOCATORS,
  BRANCH_LOCATORS,
  CONTACT_CHANNELS,
  INDUSFACE_SCAN,
  MOBILE_BANKING_DEMO_STEPS,
  PRE_LOGIN_FAQS,
  PRE_LOGIN_TICKER_MESSAGES,
  PRIVACY_POLICY_EXCERPT,
  PROMOTIONAL_OFFERS,
  SAFETY_TIPS,
  SECURITY_TIPS,
  TERMS_EXCERPT,
  PreLoginTip,
} from '../../../data/preLoginMock';
import { PreLoginCard, PreLoginListItem, PreLoginShell, PreLoginTopBar } from './PreLoginUI';
import { PreLoginServicesSheet } from './PreLoginServicesSheet';
import { openPreLoginScreen } from './preLoginNavigation';
import { LOGIN_QUICK_ITEM_IDS, PRE_LOGIN_MENU_ITEMS } from './preLoginMenuConfig';
import { getPreLoginScreenFromPath } from './preLoginScreenRegistry';
import { useBanking } from '../../../context/BankingContext';
import { BharatBankDemoVideoModal } from './BharatBankDemoVideoModal';

export { PRE_LOGIN_MENU_ITEMS, LOGIN_QUICK_ITEM_IDS } from './preLoginMenuConfig';

const TIP_ICONS = {
  shield: Shield,
  lock: Lock,
  alert: AlertTriangle,
  phone: Phone,
};

const SCREEN_TITLES: Record<string, string> = {
  contact: 'Contact Us',
  faqs: 'FAQs',
  'atm-locator': 'ATM Locator',
  'branch-locator': 'Branch Locator',
  offers: 'Promotional Offers',
  'security-tips': 'Security Tips',
  'safety-tips': 'Safety Tips',
  indusface: 'Indusface Security Scan',
  ticker: 'Ticker',
  demo: 'Mobile Banking Demo',
  terms: 'Terms & Conditions',
  privacy: 'Privacy Policy',
};

const TipsList: React.FC<{ tips: PreLoginTip[] }> = ({ tips }) => (
  <div className="space-y-3 px-4 pb-8">
    {tips.map((tip) => {
      const Icon = TIP_ICONS[tip.icon];
      return (
        <PreLoginCard key={tip.id}>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold">{tip.title}</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tip.body}</p>
            </div>
          </div>
        </PreLoginCard>
      );
    })}
  </div>
);

const LocatorList: React.FC<{ items: typeof ATM_LOCATORS; label: string }> = ({ items, label }) => {
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.address.toLowerCase().includes(query.toLowerCase())
      ),
    [items, query]
  );

  return (
    <div className="px-4 pb-8 space-y-3">
      <p className="text-xs font-semibold text-slate-500">
        {filtered.length} {label} near you
      </p>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name or area..."
        className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
      />
      {filtered.map((loc) => (
        <PreLoginCard key={loc.id}>
          <div className="flex justify-between gap-2 mb-1">
            <p className="text-sm font-bold">{loc.name}</p>
            <span className="text-[10px] font-bold text-blue-600">{loc.distance}</span>
          </div>
          <p className="text-xs text-slate-500">{loc.address}</p>
          <p className="text-[11px] text-slate-400 mt-1">{loc.hours}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {loc.services.map((s) => (
              <span
                key={s}
                className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                {s}
              </span>
            ))}
          </div>
        </PreLoginCard>
      ))}
      {filtered.length === 0 && (
        <p className="text-center text-sm text-slate-500 py-8">No locations match your search.</p>
      )}
    </div>
  );
};

export const PreLoginModule: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quickDemoLogin } = useBanking();
  const activeScreen = useMemo(
    () => getPreLoginScreenFromPath(location.pathname),
    [location.pathname]
  );
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [faqFilter, setFaqFilter] = useState('All');
  const [showDemoVideo, setShowDemoVideo] = useState(false);

  const goBack = () => navigate('/');

  const faqCategories = useMemo(
    () => ['All', ...Array.from(new Set(PRE_LOGIN_FAQS.map((f) => f.category)))],
    []
  );

  const filteredFaqs = PRE_LOGIN_FAQS.filter((f) => faqFilter === 'All' || f.category === faqFilter);

  const title = activeScreen ? SCREEN_TITLES[activeScreen] ?? 'Information' : 'Information';

  const renderContent = () => {
    if (!activeScreen) {
      return (
        <div className="px-4 pb-8">
          <p className="text-sm text-slate-500">This help topic is not available.</p>
          <button type="button" onClick={goBack} className="mt-4 text-sm font-bold text-blue-600">
            Back to login
          </button>
        </div>
      );
    }

    switch (activeScreen) {
      case 'contact':
        return (
          <div className="px-4 pb-8 space-y-3">
            {CONTACT_CHANNELS.map((ch) => (
              <PreLoginCard key={ch.id}>
                <p className="text-[10px] font-bold text-slate-500 uppercase">{ch.label}</p>
                <p className="text-sm font-bold mt-1">{ch.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{ch.sub}</p>
              </PreLoginCard>
            ))}
          </div>
        );

      case 'faqs':
        return (
          <div className="px-4 pb-8">
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
              {faqCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFaqFilter(cat)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold border ${
                    faqFilter === cat
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <PreLoginCard>
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full text-left py-3"
                  >
                    <p className="text-sm font-bold pr-4">{faq.question}</p>
                    {expandedFaq === faq.id && (
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">{faq.answer}</p>
                    )}
                  </button>
                </div>
              ))}
            </PreLoginCard>
          </div>
        );

      case 'atm-locator':
        return <LocatorList items={ATM_LOCATORS} label="ATMs" />;

      case 'branch-locator':
        return <LocatorList items={BRANCH_LOCATORS} label="branches" />;

      case 'offers':
        return (
          <div className="px-4 pb-8 space-y-3">
            {PROMOTIONAL_OFFERS.map((offer) => (
              <PreLoginCard key={offer.id}>
                <div className="flex justify-between gap-2">
                  <p className="text-sm font-bold">{offer.title}</p>
                  {offer.badge && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {offer.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{offer.description}</p>
                <p className="text-[10px] text-slate-400 mt-2">Valid till {offer.validTill}</p>
                <button
                  type="button"
                  onClick={goBack}
                  className="mt-3 text-xs font-bold text-blue-600"
                >
                  {offer.cta} →
                </button>
              </PreLoginCard>
            ))}
          </div>
        );

      case 'security-tips':
        return <TipsList tips={SECURITY_TIPS} />;

      case 'safety-tips':
        return <TipsList tips={SAFETY_TIPS} />;

      case 'indusface':
        return (
          <div className="px-4 pb-8 space-y-3">
            <PreLoginCard className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                  {INDUSFACE_SCAN.status}
                </p>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                Powered by {INDUSFACE_SCAN.provider}
              </p>
            </PreLoginCard>
            <PreLoginCard>
              <PreLoginListItem title="Last scan run date" subtitle={INDUSFACE_SCAN.lastScanDate} />
              <PreLoginListItem title="App integrity" subtitle={INDUSFACE_SCAN.appIntegrity} />
              <PreLoginListItem title="Certificate pinning" subtitle={INDUSFACE_SCAN.certificatePinning} />
              <PreLoginListItem
                title="Threats blocked (last 30 days)"
                subtitle={String(INDUSFACE_SCAN.threatsBlocked)}
              />
            </PreLoginCard>
          </div>
        );

      case 'ticker':
        return (
          <div className="px-4 pb-8 space-y-3">
            <PreLoginCard>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                Important updates and security alerts shown on the login screen.
              </p>
              {PRE_LOGIN_TICKER_MESSAGES.map((message, index) => (
                <div
                  key={message}
                  className="flex gap-3 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                  <span className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{message}</p>
                </div>
              ))}
            </PreLoginCard>
          </div>
        );

      case 'demo':
        return (
          <div className="px-4 pb-8 space-y-3">
            <PreLoginCard>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">
                Official Bharat Co-operative Bank overview
              </p>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                Watch the product overview, then follow the steps below to explore retail and corporate
                banking flows in this sandbox.
              </p>
              <button
                type="button"
                onClick={() => setShowDemoVideo(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-100 dark:border-blue-900/50"
              >
                <PlayCircle className="w-4 h-4" />
                Watch Official Demo Video
              </button>
            </PreLoginCard>
            <PreLoginCard>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                This is a demo environment. Follow these steps to explore retail and corporate banking flows.
              </p>
              {MOBILE_BANKING_DEMO_STEPS.map((s) => (
                <div key={s.step} className="flex gap-3 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {s.step}
                  </span>
                  <div>
                    <p className="text-sm font-bold">{s.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </PreLoginCard>
            <button
              type="button"
              onClick={() => {
                setShowDemoVideo(true);
              }}
              className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl"
            >
              Watch Demo & Start Login
            </button>
          </div>
        );

      case 'terms':
        return (
          <div className="px-4 pb-8">
            <PreLoginCard>
              <pre className="text-[11px] text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-sans leading-relaxed">
                {TERMS_EXCERPT}
              </pre>
            </PreLoginCard>
          </div>
        );

      case 'privacy':
        return (
          <div className="px-4 pb-8">
            <PreLoginCard>
              <pre className="text-[11px] text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-sans leading-relaxed">
                {PRIVACY_POLICY_EXCERPT}
              </pre>
            </PreLoginCard>
          </div>
        );

      default:
        return (
          <div className="px-4 pb-8">
            <p className="text-sm text-slate-500">Screen not found.</p>
          </div>
        );
    }
  };

  return (
    <>
      <PreLoginShell>
        <PreLoginTopBar title={title} onBack={goBack} />
        <div className="flex-1 overflow-y-auto pt-4">{renderContent()}</div>
      </PreLoginShell>
      <BharatBankDemoVideoModal
        isOpen={showDemoVideo}
        onClose={() => setShowDemoVideo(false)}
        onStartDemo={() => {
          setShowDemoVideo(false);
          quickDemoLogin('retail');
        }}
        startLabel="Demo — Open Retail Banking"
      />
    </>
  );
};

/** @deprecated Use PRE_LOGIN_MENU_ITEMS */
export const PRE_LOGIN_LINKS = PRE_LOGIN_MENU_ITEMS;

export const PreLoginQuickLinks: React.FC = () => {
  const navigate = useNavigate();
  const { quickDemoLogin } = useBanking();
  const [showMore, setShowMore] = useState(false);
  const [showDemoVideo, setShowDemoVideo] = useState(false);

  const quickItems = LOGIN_QUICK_ITEM_IDS.map((id) =>
    PRE_LOGIN_MENU_ITEMS.find((item) => item.id === id)
  ).filter((item): item is (typeof PRE_LOGIN_MENU_ITEMS)[number] => item != null);

  return (
    <>
      <div className="mt-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] text-slate-500 font-medium">Help & services</p>
          <button
            type="button"
            onClick={() => setShowMore(true)}
            className="text-[11px] font-bold text-blue-600"
          >
            More ›
          </button>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {quickItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => openPreLoginScreen(navigate, item.path)}
                aria-label={item.label}
                className="flex flex-col items-center gap-1 py-2 px-0.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 active:scale-95 transition-transform"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300 text-center leading-tight">
                  {item.gridLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
        <button
          type="button"
          onClick={() => setShowDemoVideo(true)}
          className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm shadow-blue-600/20 active:scale-[0.98] transition-all"
        >
          <PlayCircle className="w-4 h-4" />
          Demo — Open Retail Banking
        </button>
        <div className="flex justify-center gap-3 mt-2">
          <button
            type="button"
            onClick={() => openPreLoginScreen(navigate, '/prelogin/terms')}
            className="text-[10px] font-semibold text-slate-500 hover:text-blue-600"
          >
            Terms
          </button>
          <span className="text-slate-300">·</span>
          <button
            type="button"
            onClick={() => openPreLoginScreen(navigate, '/prelogin/privacy')}
            className="text-[10px] font-semibold text-slate-500 hover:text-blue-600"
          >
            Privacy
          </button>
        </div>
      <PreLoginServicesSheet isOpen={showMore} onClose={() => setShowMore(false)} />
      <BharatBankDemoVideoModal
        isOpen={showDemoVideo}
        onClose={() => setShowDemoVideo(false)}
        onStartDemo={() => {
          setShowDemoVideo(false);
          quickDemoLogin('retail');
        }}
        startLabel="Demo — Open Retail Banking"
      />
    </>
  );
};
