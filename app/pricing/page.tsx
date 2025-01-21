'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionService } from '@/services/subscription.service';
import { SubscriptionPlanDetails } from '@/types/subscription';
import { Check, Settings, Globe, CircleDot } from 'lucide-react';
import TrialBanner from '@/components/TrialBanner';

export default function PricingPage() {
  const [plans, setPlans] = useState<SubscriptionPlanDetails[]>([]);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { subscriptionStatus, fetchSubscriptionStatus } = useAuth();

  useEffect(() => {
    fetchPlans();
    fetchSubscriptionStatus();
  }, [fetchSubscriptionStatus]);

  const fetchPlans = async () => {
    try {
      const fetchedPlans = await SubscriptionService.getAllSubscriptionPlans();
      setPlans(fetchedPlans);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setError('Failed to fetch plans. Please try again.');
    }
  };

  const handlePlanSelection = async (plan: SubscriptionPlanDetails) => {
    router.push(`/billing?plan=${plan.id}&action=${subscriptionStatus?.has_subscription ? 'upgrade' : 'subscribe'}&is_new_user=${!subscriptionStatus?.has_subscription}`);
  };

  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('basic')) return <Settings className="w-6 h-6" />;
    if (name.includes('standard')) return <CircleDot className="w-6 h-6" />;
    return <Globe className="w-6 h-6" />;
  };

  const getGradientClass = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('basic')) return 'bg-gradient-to-br from-emerald-400 to-teal-600';
    if (name.includes('standard')) return 'bg-gradient-to-br from-purple-400 to-blue-600';
    return 'bg-gradient-to-br from-pink-400 to-orange-400';
  };

  const formatPrice = (price: number) => {
    return price.toFixed(2).replace(/\.00$/, '');
  };

  const renderPlanCard = (plan: SubscriptionPlanDetails) => {
    const isMonthly = billingInterval === 'monthly';
    const basePrice = isMonthly ? plan.price : plan.price * 12;
    const discountedPrice = plan.discount ? basePrice * (1 - plan.discount / 100) : basePrice;
    
    return (
      <div 
        key={plan.id}
        className={`relative rounded-2xl overflow-hidden ${getGradientClass(plan.name)} text-white shadow-xl flex flex-col h-full`}
      >
        <div className="p-6 space-y-6 flex flex-col flex-grow">
          <div className="flex items-center gap-2 text-xl font-bold">
            {getPlanIcon(plan.name)}
            {plan.name.toUpperCase()}
          </div>

          <div className="relative">
            <div className="bg-white text-gray-900 rounded-full py-3 px-6 inline-block">
              {plan.discount ? (
                <span className="text-lg line-through text-gray-500 mr-2">
                  ${formatPrice(basePrice)}
                </span>
              ) : null}
              <span className="text-3xl font-bold text-green-600">
                ${formatPrice(discountedPrice)}
              </span>
              <span className="text-gray-600">/{isMonthly ? 'Month' : 'Year'}</span>
            </div>
            {plan.discount ? (
              <div className="absolute -right-2 -top-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full transform rotate-12">
                {plan.discount}% OFF
              </div>
            ) : null}
          </div>

          {plan.discount && plan.discount_description ? (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-sm">
              <strong>Save {plan.discount}%:</strong> {plan.discount_description}
            </div>
          ) : null}

          <div className="space-y-3 flex-grow">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 flex-shrink-0" />
              <span>{plan.credits} credits included</span>
            </div>
            {plan.description.split('\n').map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-5 h-5 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => handlePlanSelection(plan)}
            className="w-full py-3 px-6 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors font-semibold mt-auto"
          >
            {subscriptionStatus?.has_subscription ? 'Upgrade to this Plan' : 'START NOW'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {subscriptionStatus?.subscription_status === 'trial' && subscriptionStatus.expiry_date && (
          <TrialBanner expiryDate={subscriptionStatus.expiry_date} />
        )}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {subscriptionStatus?.has_subscription ? 'Upgrade Your Plan' : 'Choose Your Plan'}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {subscriptionStatus?.has_subscription 
              ? 'Select a new plan to upgrade your subscription.' 
              : 'Select the perfect plan for your needs. Start with a trial and upgrade at any time.'}
          </p>
          {error && <p className="text-red-500">{error}</p>}
        </div>

        <div className="flex flex-col items-center justify-center mb-12 space-y-4">
          <div className="flex items-center bg-white rounded-full p-1 shadow-lg">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                billingInterval === 'monthly'
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                billingInterval === 'yearly'
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="flex flex-nowrap overflow-x-auto gap-8 pb-4 px-4 -mx-4 sm:mx-0 sm:px-0 sm:overflow-x-visible sm:flex-wrap sm:justify-center">
          {plans
            .filter(plan => billingInterval === 'monthly' ? plan.duration_days === 30 : plan.duration_days === 365)
            .map((plan) => (
              <div key={plan.id} className="w-[300px] flex-shrink-0 sm:flex-shrink">
                {renderPlanCard(plan)}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

