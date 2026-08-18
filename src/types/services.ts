import { RetailTab } from './banking';

export type ServiceRoute =
  | { kind: 'tab'; tab: RetailTab }
  | { kind: 'profile'; screen: string }
  | { kind: 'scanner' }
  | { kind: 'toast'; title: string; message: string };

export type ServiceBadge = 'Active' | 'Pending' | 'Due Soon' | 'Action Required' | 'New' | 'Available';

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  keywords: string[];
  badge?: ServiceBadge;
  route: ServiceRoute;
}

export interface ServiceCategory {
  id: string;
  title: string;
  services: ServiceItem[];
}
