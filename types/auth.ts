export interface UserInfo {
    username: string;
    email: string;
    oauth_provider: string;
    api_key: string;
    access_token: string;
    token_type: string;
    subscription_id: number;
    subscription_plan_status: string;
    subscription_expiry: string;
    subscription_date: string;
    new_requested_email: string | null;
  }

  export interface Credits {
    active_credits: number;
    used_credits: number | null;
  }
  
  export interface AuthContextType {
    user: UserInfo | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    googleSignIn: () => Promise<void>;
    verifyEmail: (token: string) => Promise<void>;
  }

  export interface UserProfile {
    id: string;
    username: string;
    email: string;
    profile_picture?: string;
    api_key: string;
    subscription_id: number;
    subscription_plan_status: string;
    subscription_expiry: Date;
    active_credits: number;
    used_credits: number;
    new_requested_email: string;
    created_at: Date;
    intercom_hash: string;
  }
  export interface AuthResponse {
    token: string;
    token_type: string;
    expires_in: number;
    already_processed: boolean;
  }
  
  export interface ApiError {
    message: string;
    status: number;
  }