import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  Building2,
  FileText,
  Gift,
  HelpCircle,
  MapPinned,
  Phone,
  PlayCircle,
  Shield,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import {
  ATM_LOCATORS,
  BRANCH_LOCATORS,
  CONTACT_CHANNELS,
  INDUSFACE_SCAN,
  MOBILE_BANKING_DEMO_STEPS,
  PRE_LOGIN_FAQS,
  PRIVACY_POLICY_EXCERPT,
  PROMOTIONAL_OFFERS,
  SAFETY_TIPS,
  SECURITY_TIPS,
  TERMS_EXCERPT,
  PreLoginTip,
} from '../../../data/preLoginMock';
import { PreLoginCard, PreLoginListItem, PreLoginShell, PreLoginTopBar } from './PreLoginUI';

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
  indusface: 'App Security Scan',
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

const LocatorList: React.FC<{ items: typeof ATM_LOCATORS }> = ({ items }) => {
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
  const { screen = 'faqs' } = useParams<{ screen: string }>();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [faqFilter, setFaqFilter] = useState('All');

  const goBack = () => navigate('/');

  const faqCategories = useMemo(
    () => ['All', ...Array.from(new Set(PRE_LOGIN_FAQS.map((f) => f.category)))],
    []
  );

  const filteredFaqs = PRE_LOGIN_FAQS.filter((f) => faqFilter === 'All' || f.category === faqFilter);

  const title = SCREEN_TITLES[screen] ?? 'Information';

  const renderContent = () => {
    switch (screen) {
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
        return <LocatorList items={ATM_LOCATORS} />;

      case 'branch-locator':
        return <LocatorList items={BRANCH_LOCATORS} />;

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

      case 'demo':
        return (
          <div className="px-4 pb-8 space-y-3">
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
              onClick={goBack}
              className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl"
            >
              Start Demo Login
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
    <PreLoginShell>
      <PreLoginTopBar title={title} onBack={goBack} />
      <div className="flex-1 overflow-y-auto pt-4">{renderContent()}</div>
    </PreLoginShell>
  );
};

export const PRE_LOGIN_LINKS = [
  { id: 'contact', label: 'Contact', icon: Phone, path: '/prelogin/contact' },
  { id: 'atm', label: 'ATM', icon: MapPinned, path: '/prelogin/atm-locator' },
  { id: 'branch', label: 'Branch', icon: Building2, path: '/prelogin/branch-locator' },
  { id: 'faqs', label: 'FAQs', icon: HelpCircle, path: '/prelogin/faqs' },
  { id: 'offers', label: 'Offers', icon: Gift, path: '/prelogin/offers' },
  { id: 'security', label: 'Security', icon: Shield, path: '/prelogin/security-tips' },
  { id: 'safety', label: 'Safety', icon: AlertTriangle, path: '/prelogin/safety-tips' },
  { id: 'scan', label: 'Scan', icon: ShieldCheck, path: '/prelogin/indusface' },
  { id: 'demo', label: 'Demo', icon: PlayCircle, path: '/prelogin/demo' },
  { id: 'terms', label: 'T&C', icon: FileText, path: '/prelogin/terms' },
  { id: 'privacy', label: 'Privacy', icon: FileText, path: '/prelogin/privacy' },
] as const;

export const PreLoginQuickLinks: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-4 border-t border-slate-200 dark:border-slate-900">
      <p className="text-[11px] text-slate-500 text-center mb-2.5 font-medium">Before you sign in</p>
      <div className="grid grid-cols-4 gap-2">
        {PRE_LOGIN_LINKS.slice(0, 8).map((link) => {
          const Icon = link.icon;
          return (
            <button
              key={link.id}
              type="button"
              onClick={() => navigate(link.path)}
              className="flex flex-col items-center gap-1 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 active:scale-95 transition-transform"
            >
              <Icon className="w-4 h-4 text-blue-600" />
              <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300">{link.label}</span>
            </button>
          );
        })}
      </div>
      <div className="flex justify-center gap-4 mt-2">
        <button
          type="button"
          onClick={() => navigate('/prelogin/terms')}
          className="text-[10px] font-semibold text-blue-600"
        >
          Terms & Conditions
        </button>
        <button
          type="button"
          onClick={() => navigate('/prelogin/privacy')}
          className="text-[10px] font-semibold text-blue-600"
        >
          Privacy Policy
        </button>
      </div>
    </div>
  );
};
