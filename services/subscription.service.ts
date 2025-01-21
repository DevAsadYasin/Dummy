import { authenticatedFetch } from '@/utils/api';
import { SubscriptionPlanDetails, SubscriptionStatus, SubscriptionHistoryEntry } from '@/types/subscription';

export const SubscriptionService = {
  async getAllSubscriptionPlans(): Promise<SubscriptionPlanDetails[]> {
    const response = await authenticatedFetch('/subscription/plans');
    return response;
  },

  async getPlanDetails(planId: number): Promise<SubscriptionPlanDetails> {
    const response = await authenticatedFetch(`/subscription/plan/${planId}`);
    return response;
  },

  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    const response = await authenticatedFetch('/subscription/status');
    return response;
  },

  async createSetupIntent(): Promise<{ client_secret: string }> {
    const response = await authenticatedFetch('/subscription/create-setup-intent', {
      method: 'POST',
    });
    return response;
  },

  async startTrialSubscription(planId: number, paymentMethodId: string): Promise<{ subscription_id: string }> {
    const response = await authenticatedFetch('/subscription/start-trial', {
      method: 'POST',
      body: JSON.stringify({ 
        subscription_plan_id: planId, 
        payment_method_id: paymentMethodId,
      }),
    });
    return response;
  },

  async createOrUpgradeSubscription(planId: number, paymentMethodId: string): Promise<{ subscription_id: string }> {
    const response = await authenticatedFetch('/subscription/create-or-upgrade', {
      method: 'POST',
      body: JSON.stringify({ 
        plan_id: planId,
        payment_method_id: paymentMethodId,
      }),
    });
    return response;
  },

  async setAutoRenew(enabled: boolean): Promise<void> {
    await authenticatedFetch('/subscription/set-auto-renew', {
      method: 'POST',
      body: JSON.stringify({ auto_renew: enabled }),
    });
  },

  async getSubscriptionHistory(): Promise<SubscriptionHistoryEntry[]> {
    const response = await authenticatedFetch('/subscription/subscription-history');
    return response;
  },
};

