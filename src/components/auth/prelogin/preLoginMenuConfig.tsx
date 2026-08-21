import {
  AlertTriangle,
  Building2,
  FileText,
  Gift,
  HelpCircle,
  KeyRound,
  MapPinned,
  Megaphone,
  Phone,
  PlayCircle,
  Shield,
  ShieldCheck,
} from 'lucide-react';
import { INDUSFACE_SCAN } from '../../../data/preLoginMock';

export const PRE_LOGIN_MENU_ITEMS = [
  { id: 'contact', label: 'Contact Us', gridLabel: 'Contact', icon: Phone, path: '/prelogin/contact' },
  { id: 'atm', label: 'ATM Locator', gridLabel: 'ATM', icon: MapPinned, path: '/prelogin/atm-locator' },
  { id: 'branch', label: 'Branch Locator', gridLabel: 'Branch', icon: Building2, path: '/prelogin/branch-locator' },
  { id: 'faqs', label: 'FAQs', gridLabel: 'FAQs', icon: HelpCircle, path: '/prelogin/faqs' },
  { id: 'offers', label: 'Promotional Offers', gridLabel: 'Offers', icon: Gift, path: '/prelogin/offers' },
  { id: 'security', label: 'Security Tips', gridLabel: 'Security', icon: Shield, path: '/prelogin/security-tips' },
  { id: 'safety', label: 'Safety Tips', gridLabel: 'Safety', icon: AlertTriangle, path: '/prelogin/safety-tips' },
  {
    id: 'indusface',
    label: 'Indusface last scan run date',
    gridLabel: 'Indusface',
    subtitle: INDUSFACE_SCAN.lastScanDate,
    icon: ShieldCheck,
    path: '/prelogin/indusface',
  },
  { id: 'forgot-mpin', label: 'Forgot MPIN', gridLabel: 'Forgot MPIN', icon: KeyRound, path: '/forgot-mpin' },
  { id: 'ticker', label: 'Ticker option', gridLabel: 'Ticker', icon: Megaphone, path: '/prelogin/ticker' },
  { id: 'demo', label: 'Mobile Banking Demo', gridLabel: 'Demo', icon: PlayCircle, path: '/prelogin/demo' },
  { id: 'terms', label: 'Terms & Conditions', gridLabel: 'T&C', icon: FileText, path: '/prelogin/terms' },
  { id: 'privacy', label: 'Privacy Policy', gridLabel: 'Privacy', icon: FileText, path: '/prelogin/privacy' },
] as const;

export const LOGIN_QUICK_ITEM_IDS = ['offers', 'atm', 'branch', 'faqs', 'contact'] as const;
