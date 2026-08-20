import type { PreLoginLocator, PreLoginTip } from '../../../data/preLoginMock';

/** URL segment after /prelogin/ — must match preLoginMenuConfig paths */
export type PreLoginScreenKey =
  | 'contact'
  | 'atm-locator'
  | 'branch-locator'
  | 'faqs'
  | 'offers'
  | 'security-tips'
  | 'safety-tips'
  | 'indusface'
  | 'ticker'
  | 'demo'
  | 'terms'
  | 'privacy';

export type PreLoginScreenType =
  | 'contact'
  | 'locator'
  | 'faqs'
  | 'offers'
  | 'tips'
  | 'indusface'
  | 'ticker'
  | 'demo'
  | 'text';

export interface PreLoginScreenDefinition {
  key: PreLoginScreenKey;
  title: string;
  type: PreLoginScreenType;
  locatorData?: PreLoginLocator[];
  tipsData?: PreLoginTip[];
  textContent?: string;
}

export function pathToScreenKey(path: string): PreLoginScreenKey | null {
  const match = path.match(/^\/prelogin\/([^/?#]+)/);
  if (!match) return null;
  const key = match[1];
  return isPreLoginScreenKey(key) ? key : null;
}

/** Read screen key from current location (App renders PreLoginModule outside Route params). */
export function getPreLoginScreenFromPath(pathname: string): PreLoginScreenKey | null {
  return pathToScreenKey(pathname);
}

export function isPreLoginScreenKey(value: string): value is PreLoginScreenKey {
  return (
    value === 'contact' ||
    value === 'atm-locator' ||
    value === 'branch-locator' ||
    value === 'faqs' ||
    value === 'offers' ||
    value === 'security-tips' ||
    value === 'safety-tips' ||
    value === 'indusface' ||
    value === 'ticker' ||
    value === 'demo' ||
    value === 'terms' ||
    value === 'privacy'
  );
}
