'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionService } from '@/services/subscription.service';
import { SubscriptionPlanDetails, SubscriptionStatus } from '@/types/subscription';
import { SubscriptionManager } from '@/components/SubscriptionManager';
import { SubscriptionHistory } from '@/components/SubscriptionHistory';
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import CheckoutForm from '@/components/CheckoutForm';
import TrialBanner from '@/components/TrialBanner';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function BillingPage() {
  const { user, isLoading: isAuthLoading, isAuthenticated, subscriptionStatus, fetchSubscriptionStatus } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanDetails | null>(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const initPage = async () => {
      if (isAuthLoading) return;

      setIsLoading(true);
      try {
        if (!isAuthenticated) {
          throw new Error("User not authenticated");
        }

        await fetchSubscriptionStatus();
        await fetchSubscriptionHistory();
        const planId = searchParams.get('plan');
        if (planId) {
          await fetchPlanDetails(parseInt(planId, 10));
          setShowCheckoutForm(true);
          
          const { client_secret } = await SubscriptionService.createSetupIntent();
          setClientSecret(client_secret);
        }
      } catch (error) {
        console.error('Error initializing page:', error);
        setError('Failed to load page data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initPage();
  }, [isAuthLoading, isAuthenticated, searchParams, fetchSubscriptionStatus]);

  const fetchSubscriptionHistory = async () => {
    try {
      const history = await SubscriptionService.getSubscriptionHistory();
      setSubscriptionHistory(history);
    } catch (error) {
      console.error('Error fetching subscription history:', error);
      setError('Failed to fetch subscription history.');
    }
  };

  const fetchPlanDetails = async (planId: number) => {
    try {
      const plan = await SubscriptionService.getPlanDetails(planId);
      setSelectedPlan(plan);
    } catch (error) {
      console.error('Error fetching plan details:', error);
      setError('Failed to fetch plan details.');
    }
  };

  const handleSubscriptionSuccess = async () => {
    await fetchSubscriptionStatus();
    setShowCheckoutForm(false);
  };

  if (isAuthLoading || isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[rgb(79,127,255)]/5 to-white py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="mb-8 border-red-300 bg-gradient-to-br from-red-50 to-red-100/80">
            <CardContent className="flex items-center space-x-2 text-red-800 p-4">
              <AlertCircle className="h-5 w-5" />
              <p>User not authenticated. Please log in to access billing information.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50/30 to-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {subscriptionStatus?.subscription_status === 'trial' && subscriptionStatus.expiry_date && (
          <TrialBanner expiryDate={subscriptionStatus.expiry_date} />
        )}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-indigo-600 mb-4">Billing & Subscription</h1>
        </div>
        
        {error && (
          <Card className="mb-8 border-red-300 bg-gradient-to-br from-red-50 to-red-100/80">
            <CardContent className="flex items-center space-x-2 text-red-800 p-4">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-8 md:grid-cols-3">
          <Card className="md:col-span-2 border-indigo-200/20 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-indigo-50/50">
            <CardContent className="p-6">
              {showCheckoutForm && selectedPlan && clientSecret && (
                <Elements 
                  stripe={stripePromise} 
                  options={{
                    clientSecret,
                    appearance: { 
                      theme: 'stripe',
                      variables: {
                        colorPrimary: 'rgb(29,78,216)',
                        colorBackground: '#ffffff',
                        colorText: '#1e3a8a',
                      }
                    },
                  }}
                >
                  <CheckoutForm 
                    plan={selectedPlan} 
                    onSuccess={handleSubscriptionSuccess}
                    isNewUser={!user?.subscription_id}
                    isUpgrade={subscriptionStatus?.has_subscription ?? false}
                    returnUrl={`${window.location.origin}/billing/complete?plan_id=${selectedPlan.id}&is_new_user=${!user?.subscription_id}`}
                  />
                </Elements>
              )}
              {!showCheckoutForm && subscriptionStatus && (
                <SubscriptionManager 
                  subscriptionStatus={subscriptionStatus} 
                  selectedPlan={selectedPlan}
                  onSubscriptionChange={fetchSubscriptionStatus}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {!showCheckoutForm && subscriptionStatus?.has_subscription && (
          <Card className="mt-8 border-indigo-200/20 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-indigo-50/50">
            <CardContent className="p-6">
              <SubscriptionHistory history={subscriptionHistory} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

