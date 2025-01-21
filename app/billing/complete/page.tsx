'use client'

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from '@/components/LoadingSpinner';
import SetupCompleteContent from '@/components/SetupCompleteContent';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function SetupCompletePage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const secret = searchParams.get('setup_intent_client_secret');
    if (secret) {
      setClientSecret(secret);
    } else {
      // Handle the case where there's no client secret
      console.error('No setup intent client secret found in URL');
    }
  }, [searchParams]);

  if (!clientSecret) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-[calc(100vh-8rem)] bg-gradient-to-b from-blue-50 to-white py-4">
      <div className="container sm:px-6 lg:px-8">
        <Card className="mx-auto">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-4">Setup Complete</h1>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <SetupCompleteContent />
            </Elements>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

