'use client'

import { useEffect, useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { useRouter, useSearchParams } from 'next/navigation';
import { SubscriptionService } from '@/services/subscription.service';
import { Button } from "@/components/ui/button";
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/components/ui/use-toast";

export default function SetupCompleteContent() {
  const stripe = useStripe();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { credits, fetchCredits, subscriptionStatus, fetchSubscriptionStatus } = useAuth();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = searchParams.get('setup_intent_client_secret');
    const planId = searchParams.get('plan_id');
    const isNewUser = searchParams.get('is_new_user') === 'true';

    if (!clientSecret || !planId) {
      setMessage('Missing setup intent or plan information. Please try again.');
      setIsLoading(false);
      return;
    }

    stripe.retrieveSetupIntent(clientSecret).then(async ({ setupIntent }) => {
      switch (setupIntent?.status) {
        case 'succeeded':
          try {
            if (isNewUser) {
              await SubscriptionService.startTrialSubscription(
                parseInt(planId, 10),
                setupIntent.payment_method as string
              );
              setMessage('Trial subscription started successfully. You will not be charged until the trial period ends.');
            } else {
              await SubscriptionService.createOrUpgradeSubscription(
                parseInt(planId, 10),
                setupIntent.payment_method as string
              );
              setMessage('Subscription created or upgraded successfully.');
            }
            
            await fetchCredits();
            await fetchSubscriptionStatus();

            setTimeout(() => {
              router.push('/');
            }, 3000);

          } catch (error) {
            console.error('Error finalizing subscription:', error);
            setMessage('Payment method set up successfully, but there was an error finalizing your subscription. Please contact support.');
          }
          break;
        case 'processing':
          setMessage("Processing payment details. We'll update you when processing is complete.");
          break;
        case 'requires_payment_method':
          setMessage('Failed to process payment details. Please try another payment method.');
          break;
        default:
          setMessage('Something went wrong.');
          break;
      }
      setIsLoading(false);
    });
  }, [stripe, searchParams, router, fetchCredits, fetchSubscriptionStatus]);

  useEffect(() => {
    if (credits) {
      toast({
        title: "Credits Updated",
        description: `You now have ${credits.active} active credits.`,
      });
    }
  }, [credits]);

  useEffect(() => {
    if (subscriptionStatus) {
      toast({
        title: "Subscription Status Updated",
        description: `Your subscription status is now: ${subscriptionStatus.plan_name || 'No active plan'}`,
      });
    }
  }, [subscriptionStatus]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <p className="text-[rgb(29,78,216)]">{message}</p>
      {credits && (
        <p className="font-semibold text-[rgb(29,78,216)]">
          Your current credit balance: {credits.active} credits
        </p>
      )}
      {subscriptionStatus && (
        <p className="font-semibold text-[rgb(29,78,216)]">
          Your subscription: {subscriptionStatus.plan_name || 'No active plan'}
        </p>
      )}
      {message && message.includes('contact support') && (
        <Button 
          onClick={() => router.push('/support')}
          className="bg-[rgb(29,78,216)] hover:bg-[rgb(59,130,246)] text-white transition-colors"
        >
          Contact Support
        </Button>
      )}
    </div>
  );
}
