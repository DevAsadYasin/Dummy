export interface SubscriptionPlanDetails {
  id: number;
  name: string;
  description: string;
  price: number;
  credits: number;
  duration_days: number;
  stripe_price_id: string;
  discount: number;
  discount_description: string;
  trial_days: number;
}

export interface SubscriptionStatus {
  has_subscription: boolean;
  plan_name?: string;
  plan_id?: number;
  subscription_status?: string;
  expiry_date?: string;
  credits?: number;
  auto_renew?: boolean;
}

export interface SubscriptionHistoryEntry {
  id: number;
  description: string;
  payment: number;
  action_date: string;
  action_type: string;
}

