'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as authService from '@/services/auth.service';
import { UserProfile, AuthResponse, ApiError } from '@/types/auth';
import { SubscriptionStatus } from '@/types/subscription';
import { ApiError as ApiErrorUtils } from '@/utils/api';
import { SubscriptionService } from '@/services/subscription.service';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  subscriptionStatus: SubscriptionStatus | null;
  credits: { active: number; used: number } | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  googleSignIn: () => void;
  handleGoogleCallback: (code: string) => Promise<void>;
  signOut: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateUser: (updatedUserData: Partial<UserProfile>) => void;
  fetchSubscriptionStatus: () => Promise<void>;
  fetchCredits: () => Promise<void>;
  updateCredits: (newCredits: { active: number; used: number }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [credits, setCredits] = useState<{ active: number; used: number } | null>(null);
  const router = useRouter();

  const fetchSubscriptionStatus = useCallback(async () => {
    if (!isAuthenticated) return; // Only fetch if authenticated
    try {
      const status = await SubscriptionService.getSubscriptionStatus();
      setSubscriptionStatus(status);
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      setSubscriptionStatus(null);
    }
  }, [isAuthenticated]);

  const fetchCredits = useCallback(async () => {
    if (!isAuthenticated) return; // Only fetch if authenticated
    try {
      const creditsInfo = await authService.getCredits();
      setCredits({
        active: creditsInfo.active_credits,
        used: creditsInfo.used_credits || 0,
      });
    } catch (error) {
      console.error('Error fetching credits:', error);
      setCredits(null);
    }
  }, [isAuthenticated]);

  const fetchProfile = useCallback(async () => {
    const token = authService.getToken();
    if (token) {
      try {
        const userProfile = await authService.getProfile();
        setUser(userProfile);
        setIsAuthenticated(true);
        authService.setUserInfo(userProfile);

        // Fetch subscription and credits only if authenticated
        await fetchSubscriptionStatus();
        await fetchCredits();
      } catch (error) {
        console.error('Error fetching user profile:', error);
        authService.removeToken();
        authService.removeUserInfo();
        setUser(null);
        setIsAuthenticated(false);
        setSubscriptionStatus(null);
        setCredits(null);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
      setSubscriptionStatus(null);
      setCredits(null);
    }
    setIsLoading(false);
  }, [fetchSubscriptionStatus, fetchCredits]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authService.signIn(email, password);
      if (response.token) {
        authService.setToken(response.token);
        await fetchProfile();
        router.push('/');
      } else {
        throw new Error('No access token received');
      }
    } catch (error: unknown) {
      console.error('Sign in error:', error);
      if (error instanceof Error) {
        if (error.message === 'EMAIL_NOT_VERIFIED') {
          throw new Error('EMAIL_NOT_VERIFIED');
        } else if (error instanceof ApiErrorUtils) {
          throw new Error(error.message);
        } else {
          throw new Error('Authentication failed. Please try again.');
        }
      } else {
        throw new Error('An unexpected error occurred');
      }
    }
  };

  const signUp = async (username: string, email: string, password: string) => {
    try {
      await authService.signUp({ username, email, password });
    } catch (error) {
      console.error('Sign up error:', error);
      throw new Error('Registration failed');
    }
  };

  const googleSignIn = () => {
    authService.initiateGoogleSignIn();
  };

  const handleGoogleCallback = async (code: string) => {
    try {
      const authResponse = await authService.handleGoogleCallback(code);
      if (!authResponse.already_processed) {
        authService.setToken(authResponse.token);
        await fetchProfile();
      }
    } catch (error) {
      console.error('Error handling Google callback:', error);
      authService.removeToken();
      authService.removeUserInfo();
      throw error;
    }
  };

  const signOut = async () => {
    try {
      authService.removeToken();
      authService.removeUserInfo();
      setUser(null);
      setIsAuthenticated(false);
      setSubscriptionStatus(null);
      setCredits(null);
      router.push('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      throw new Error('Failed to sign out. Please try again.');
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      await authService.verifyEmail(token);
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error;
    }
  };

  const updateUser = (updatedUserData: Partial<UserProfile>) => {
    setUser(prevUser => prevUser ? { ...prevUser, ...updatedUserData } : null);
    if (user) {
      authService.setUserInfo({ ...user, ...updatedUserData });
    }
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    subscriptionStatus,
    credits,
    signIn,
    signUp,
    googleSignIn,
    handleGoogleCallback,
    signOut,
    verifyEmail,
    fetchProfile,
    updateUser,
    fetchSubscriptionStatus,
    fetchCredits,
    updateCredits: (newCredits) => {
      setCredits(newCredits);
    },
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}