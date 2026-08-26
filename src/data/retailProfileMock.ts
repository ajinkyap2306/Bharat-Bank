import type { UserProfile } from '../types/banking';
import type { KycDetails, PersonalInfo } from '../types/profile';
import { INITIAL_RETAIL_USER } from './mockData';
import { INITIAL_KYC_DETAILS, INITIAL_PERSONAL_INFO } from './profileMockData';

export interface RetailProfileBundle {
  user: UserProfile;
  personalInfo: PersonalInfo;
  kycDetails: KycDetails;
}

const AVATAR_ARJUN =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
const AVATAR_RAHUL =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80';
const AVATAR_AMIT =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';

function buildKyc(personal: PersonalInfo, verificationDate: string): KycDetails {
  return {
    status: 'verified',
    verificationDate,
    nationalIdMasked: personal.nationalIdMasked,
    addressVerified: true,
    lastUpdated: verificationDate,
    documents: [
      { name: 'Aadhaar Card', status: 'Verified' },
      { name: 'PAN Card', status: 'Verified' },
      { name: 'Address Proof', status: 'Verified' },
    ],
  };
}

const RAHUL_PERSONAL: PersonalInfo = {
  fullName: 'Rahul Sharma',
  dateOfBirth: '08 Jul 1988',
  gender: 'Male',
  mobile: '+91 98200 45821',
  email: 'rahul.sharma@email.com',
  nationalIdMasked: 'XXXX XXXX 7251',
  residentialAddress: 'Flat 502, Horizon Towers, Andheri East, Mumbai - 400069',
  mailingAddress: 'Flat 502, Horizon Towers, Andheri East, Mumbai - 400069',
  mobileVerified: true,
  emailVerified: true,
};

const AMIT_PERSONAL: PersonalInfo = {
  fullName: 'Amit Sharma',
  dateOfBirth: '22 Nov 1990',
  gender: 'Male',
  mobile: '+91 98190 33456',
  email: 'amit.sharma@email.com',
  nationalIdMasked: 'XXXX XXXX 8394',
  residentialAddress: '18/B Shivaji Park, Dadar West, Mumbai - 400028',
  mailingAddress: '18/B Shivaji Park, Dadar West, Mumbai - 400028',
  mobileVerified: true,
  emailVerified: true,
};

export const RETAIL_PROFILE_BUNDLES: Record<string, RetailProfileBundle> = {
  usr_ret_001: {
    user: { ...INITIAL_RETAIL_USER, avatar: AVATAR_ARJUN },
    personalInfo: INITIAL_PERSONAL_INFO,
    kycDetails: INITIAL_KYC_DETAILS,
  },
  usr_joint_rahul: {
    user: {
      id: 'usr_joint_rahul',
      name: 'Rahul Sharma',
      email: RAHUL_PERSONAL.email,
      phone: RAHUL_PERSONAL.mobile,
      avatar: AVATAR_RAHUL,
      type: 'retail',
      customerNumber: 'RB-RAHUL01',
      kycStatus: 'verified',
      lastLogin: 'Today, 10:15 AM from iPhone 15',
    },
    personalInfo: RAHUL_PERSONAL,
    kycDetails: buildKyc(RAHUL_PERSONAL, '15 Jun 2024'),
  },
  usr_joint_amit: {
    user: {
      id: 'usr_joint_amit',
      name: 'Amit Sharma',
      email: AMIT_PERSONAL.email,
      phone: AMIT_PERSONAL.mobile,
      avatar: AVATAR_AMIT,
      type: 'retail',
      customerNumber: 'RB-AMIT01',
      kycStatus: 'verified',
      lastLogin: 'Today, 09:48 AM from Galaxy S24',
    },
    personalInfo: AMIT_PERSONAL,
    kycDetails: buildKyc(AMIT_PERSONAL, '03 Sep 2024'),
  },
};

export function getRetailProfileBundle(userId: string): RetailProfileBundle {
  return RETAIL_PROFILE_BUNDLES[userId] ?? RETAIL_PROFILE_BUNDLES.usr_ret_001;
}

export function getRetailUserProfile(userId: string): UserProfile {
  return getRetailProfileBundle(userId).user;
}
