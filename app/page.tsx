'use client'

import { useAuth } from '@/contexts/AuthContext'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { Dashboard } from '@/components/Dashboard'
import LoadingSpinner from '@/components/LoadingSpinner';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return <WelcomeScreen />;
  }
  
  return <Dashboard />;
}

