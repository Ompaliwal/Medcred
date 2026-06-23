/**
 * AuthContext — Mock authentication context.
 * No backend calls. Designed with future API integration in mind.
 * Replace the mock functions with real API calls when backend is ready.
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CardStatus =
  | 'DRAFT'
  | 'MOBILE_VERIFIED'
  | 'KYC_PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'ACTIVE';

export interface Claim {
  id: string;
  type: 'Hospital' | 'HomeTreatment';
  hospitalName?: string; // only for Hospital claims
  treatmentDate: string;
  amount: number;
  status: 'Submitted' | 'UnderReview' | 'Approved' | 'Rejected';
  documents: { uri: string; name: string }[];
  timeline: { step: string; date: string }[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  type: 'INFO' | 'WARNING' | 'SUCCESS';
}

export interface User {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  aadhaarNumber: string;
  profilePhoto?: string;
  cardStatus: CardStatus;
  isKycVerified: boolean;
  cardValidity: string;
  createdAt: string;
  familyMembers: FamilyMember[];
  walletBalance: number;
  activeClaims: number;
  unreadNotifications: number;
  notifications: AppNotification[];
  claims: Claim[];
}

export interface RegisterFormData {
  // Step 1 — Personal
  fullName: string;
  mobile: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  // Step 2 — Address
  address: string;
  city: string;
  state: string;
  pincode: string;
  // Step 3 — Identity
  aadhaarNumber: string;
  profilePhoto?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  // Mock actions — swap internals with real API calls later
  sendOTP: (mobile: string) => Promise<{ success: boolean; message: string }>;
  verifyOTP: (mobile: string, otp: string) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterFormData) => Promise<{ success: boolean; message: string }>;
  login: (mobile: string, otp: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<{ success: boolean; message: string }>;
  activateCard: () => Promise<void>;
  renewCard: () => Promise<void>;
  addFamilyMember: (member: Omit<FamilyMember, 'id' | 'isVerified'>) => Promise<string>;
  verifyFamilyMember: (memberId: string, otp: string) => Promise<{ success: boolean; message: string }>;
  createClaim: (claim: Omit<Claim, 'id' | 'status' | 'documents' | 'timeline'>) => Promise<string>;
  uploadClaimDocuments: (claimId: string, files: { uri: string; name: string }[]) => Promise<void>;
  updateClaimStatus: (claimId: string, status: Claim['status']) => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * MOCK: Update user details.
   */
  const updateUser = async (data: Partial<User>): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    await delay(800);
    
    if (user) {
      setUser({ ...user, ...data });
    }
    
    setIsLoading(false);
    return { success: true, message: 'Profile updated successfully!' };
  };

  /**
   * MOCK: Send OTP to mobile number.
   * Future: POST /api/auth/send-otp  { mobile }
   */
  const sendOTP = async (mobile: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    // Simulate network delay
    await delay(1200);
    setIsLoading(false);

    if (mobile.length !== 10) {
      return { success: false, message: 'Please enter a valid 10-digit mobile number.' };
    }

    // Mock success — in production, backend sends real OTP via MSG91
    console.log(`[MOCK] OTP sent to +91 ${mobile}. Use 123456 to verify.`);
    return { success: true, message: 'OTP sent successfully!' };
  };

  /**
   * MOCK: Verify OTP.
   * Future: POST /api/auth/verify-otp  { mobile, otp }
   */
  const verifyOTP = async (mobile: string, otp: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    await delay(1000);
    setIsLoading(false);

    // Mock: accept any 6-digit OTP (production will validate against Redis)
    if (otp.length !== 6) {
      return { success: false, message: 'Please enter the complete 6-digit OTP.' };
    }

    return { success: true, message: 'OTP verified!' };
  };

  /**
   * MOCK: Register a new user.
   * Future: POST /api/auth/register  { ...formData }
   *   → returns JWT access+refresh tokens + user object
   */
  const register = async (data: RegisterFormData): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    await delay(1500);

    const mockUser: User = {
      id: `USR-${Date.now()}`,
      fullName: data.fullName,
      mobile: data.mobile,
      email: data.email,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      aadhaarNumber: data.aadhaarNumber,
      profilePhoto: data.profilePhoto,
      cardStatus: 'KYC_PENDING', // always KYC_PENDING after registration per BRD
      isKycVerified: false,
      cardValidity: '2025-12-31',
      createdAt: new Date().toISOString(),
      familyMembers: [],
      walletBalance: 0,
      activeClaims: 0,
      unreadNotifications: 1,
      notifications: [
        {
          id: 'n1',
          title: 'Welcome to MedCred',
          message: 'Complete your KYC to activate your health card.',
          date: new Date().toISOString(),
          isRead: false,
          type: 'INFO',
        }
      ],
      claims: [],
    };

    setUser(mockUser);
    setIsLoading(false);
    return { success: true, message: 'Registration successful!' };
  };

  /**
   * MOCK: Login with mobile + OTP.
   * Future: POST /api/auth/login  { mobile, otp }
   *   → returns JWT access+refresh tokens + user object
   */
  const login = async (mobile: string, otp: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    await delay(1200);

    if (otp.length !== 6) {
      setIsLoading(false);
      return { success: false, message: 'Invalid OTP.' };
    }

    // Mock existing user
    const mockUser: User = {
      id: 'USR-DEMO-001',
      fullName: 'Rahul Sharma',
      mobile,
      email: 'rahul.sharma@email.com',
      dateOfBirth: '1990-05-15',
      gender: 'Male',
      address: '42, MG Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      aadhaarNumber: '1234-5678-9012',
      cardStatus: 'KYC_PENDING',
      isKycVerified: false,
      cardValidity: '2025-12-31',
      createdAt: '2024-01-10T00:00:00.000Z',
      familyMembers: [],
      walletBalance: 5000,
      activeClaims: 1,
      unreadNotifications: 2,
      notifications: [
        {
          id: 'n2',
          title: 'Claim Update',
          message: 'Your claim #CLM-992 is under review.',
          date: new Date().toISOString(),
          isRead: false,
          type: 'INFO',
        },
        {
          id: 'n3',
          title: 'Wallet Credited',
          message: '₹5000 was added to your wallet as signup bonus.',
          date: new Date(Date.now() - 86400000).toISOString(),
          isRead: false,
          type: 'SUCCESS',
        }
      ],
      claims: [
        {
          id: 'CLM-001',
          type: 'Hospital',
          hospitalName: 'City Hospital',
          treatmentDate: '2023-11-01',
          amount: 1200,
          status: 'Approved',
          documents: [],
          timeline: [
            { step: 'Submitted', date: '2023-11-01' },
            { step: 'Under Review', date: '2023-11-02' },
            { step: 'Approved', date: '2023-11-04' }
          ]
        },
        {
          id: 'CLM-002',
          type: 'HomeTreatment',
          treatmentDate: '2023-10-15',
          amount: 800,
          status: 'Submitted',
          documents: [],
          timeline: [{ step: 'Submitted', date: '2023-10-15' }]
        }
      ],
    };

    setUser(mockUser);
    setIsLoading(false);
    return { success: true, message: 'Login successful!' };
  };

  const logout = () => {
    setUser(null);
  };

  /**
   * MOCK: Activate Card (simulate KYC approval)
   */
  const activateCard = async () => {
    setIsLoading(true);
    await delay(800);
    if (user) {
      setUser({ ...user, cardStatus: 'ACTIVE', isKycVerified: true });
    }
    setIsLoading(false);
  };

  /**
   * MOCK: Renew Card (extend validity)
   */
  const renewCard = async () => {
    setIsLoading(true);
    await delay(1200);
    if (user) {
      // Simulate extending validity by 1 year from the current validity
      const currentYear = parseInt(user.cardValidity.split('-')[0], 10);
      setUser({ ...user, cardValidity: `${currentYear + 1}-12-31` });
    }
    setIsLoading(false);
  };

  /**
   * MOCK: Add Family Member
   */
  const addFamilyMember = async (member: Omit<FamilyMember, 'id' | 'isVerified'>) => {
    setIsLoading(true);
    await delay(1000);
    const newMember: FamilyMember = {
      ...member,
      id: `FAM-${Date.now()}`,
      isVerified: false,
    };
    if (user) {
      setUser({ ...user, familyMembers: [...user.familyMembers, newMember] });
    }
    setIsLoading(false);
    return newMember.id;
  };

  /**
   * MOCK: Verify Family Member
   */
  const verifyFamilyMember = async (memberId: string, otp: string) => {
    setIsLoading(true);
    await delay(1000);
    if (otp.length !== 6) {
      setIsLoading(false);
      return { success: false, message: 'Invalid OTP.' };
    }
    if (user) {
      setUser({
        ...user,
        familyMembers: user.familyMembers.map((m) =>
          m.id === memberId ? { ...m, isVerified: true } : m
        ),
      });
    }
    setIsLoading(false);
    return { success: true, message: 'Family member verified!' };
  };

  /**
   * MOCK: Create a new claim
   */
  const createClaim = async (claim: Omit<Claim, 'id' | 'status' | 'documents' | 'timeline'>): Promise<string> => {
    setIsLoading(true);
    await delay(1000);
    const newClaim: Claim = {
      ...claim,
      id: `CLM-${Date.now()}`,
      status: 'Submitted',
      documents: [],
      timeline: [{ step: 'Submitted', date: new Date().toISOString() }],
    };
    if (user) {
      setUser({
        ...user,
        claims: [...user.claims, newClaim],
        activeClaims: user.activeClaims + 1,
        walletBalance: user.walletBalance - newClaim.amount,
        unreadNotifications: user.unreadNotifications + 1,
        notifications: [
          ...user.notifications,
          {
            id: `n-${Date.now()}`,
            title: 'Claim Submitted',
            message: `₹${newClaim.amount} claim submitted.`,
            date: new Date().toISOString(),
            isRead: false,
            type: 'INFO',
          },
        ],
      });
    }
    setIsLoading(false);
    return newClaim.id;
  };

  /**
   * MOCK: Upload documents for a claim
   */
  const uploadClaimDocuments = async (claimId: string, files: { uri: string; name: string }[]): Promise<void> => {
    setIsLoading(true);
    await delay(800);
    if (user) {
      const updatedClaims = user.claims.map((c) =>
        c.id === claimId ? { ...c, documents: [...c.documents, ...files] } : c
      );
      setUser({ ...user, claims: updatedClaims });
    }
    setIsLoading(false);
  };

  /**
   * MOCK: Update claim status and add timeline entry
   */
  const updateClaimStatus = async (claimId: string, status: Claim['status']): Promise<void> => {
    setIsLoading(true);
    await delay(800);
    if (user) {
      const updatedClaims = user.claims.map((c) => {
        if (c.id === claimId) {
          const newTimeline = [...c.timeline, { step: status, date: new Date().toISOString() }];
          return { ...c, status, timeline: newTimeline };
        }
        return c;
      });
      setUser({ ...user, claims: updatedClaims, activeClaims: status === 'Approved' ? user.activeClaims - 1 : user.activeClaims });
    }
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, isLoading, sendOTP, verifyOTP, register, login, logout, 
      updateUser, activateCard, renewCard, addFamilyMember, verifyFamilyMember,
      createClaim, uploadClaimDocuments, updateClaimStatus 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
