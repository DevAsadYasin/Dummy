import { AuthResponse, UserProfile } from '@/types/auth';
import { fetchApi, ApiError } from '@/utils/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface SignupData {
  email: string;
  username: string;
  password: string;
}

export async function initiateGoogleSignIn(): Promise<void> {
  const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback/google`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login/google?redirect_uri=${redirectUri}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to initiate Google Sign-In');
    }

    const data = await response.json();
    if (data.auth_url) {
      window.location.href = data.auth_url;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Error initiating Google Sign-In:', error);
    throw error;
  }
}

let isProcessingGoogleCallback = false;

export async function handleGoogleCallback(code: string): Promise<AuthResponse> {
  if (isProcessingGoogleCallback) {
    throw new Error('Google sign-in is already in progress');
  }

  isProcessingGoogleCallback = true;

  try {
    const redirectUri = `${window.location.origin}/auth/callback/google`;

    const response = await fetchApi('/auth/signin/callback/google', {
      method: 'POST',
      body: JSON.stringify({ 
        code,
        redirect_uri: redirectUri
      }),
      credentials: 'include',
    });

    return {
      token: response.access_token,
      token_type: response.token_type,
      expires_in: response.expires_in,
      already_processed: response.already_processed || false
    };
  } catch (error) {
    console.error('Google callback error:', error);
    throw error;
  } finally {
    isProcessingGoogleCallback = false;
  }
}

export async function getProfile(): Promise<UserProfile> {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetchApi('/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response as UserProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

export function getUserInfo(): UserProfile | null {
  if (typeof window !== 'undefined') {
    const userInfo = sessionStorage.getItem('user_info');
    if (userInfo) {
      try {
        return JSON.parse(userInfo);
      } catch (error) {
        console.error('Error parsing user info from session Storage:', error);
        return null;
      }
    }
  }
  return null;
}

export function setUserInfo(userInfo: UserProfile): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('user_info', JSON.stringify(userInfo));
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
}

export function setToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
}

export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
  }
}

export function removeUserInfo(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('user_info');
  }
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  try {
    const response = await fetchApi('/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (response.access_token) {
      setToken(response.access_token);
    }

    return {
      token: response.access_token,
      token_type: response.token_type,
      expires_in: response.expires_in,
      already_processed: response.already_processed || false
    };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 403 && error.message.includes('Email not verified')) {
        throw new Error('EMAIL_NOT_VERIFIED');
      }
    }
    throw error;
  }
}

interface SignUpData {
  email: string;
  username: string;
  password: string;
}

export async function signUp(signupData: SignUpData): Promise<{ message: string }> {
  try {
    const response = await fetchApi('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(signupData),
    });

    return response;
  } catch (error: unknown) {
    console.error('Sign up error:', error);

    if (error instanceof ApiError) {
      if (error.message.includes('Email already registered')) {
        throw new Error('Email already registered');
      } else if (error.message.includes('Username already taken')) {
        throw new Error('Username already taken');
      }
      throw new Error(error.message);
    }

    throw new Error('An unexpected error occurred during signup');
  }
}


export async function forgotPassword(email: string): Promise<void> {
  try {
    const response = await fetchApi('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
}

export async function resetPassword(resetToken: string, newPassword: string): Promise<void> {
  console.log('Sending reset password request');
  try {
    const response = await fetchApi('/auth/renew-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        reset_token: resetToken, 
        new_password: newPassword 
      }),
    });
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
}

export async function verifyEmail(token: string): Promise<{ message: string }> {
  try {
    const response = await fetchApi(`/auth/verify-email?token=${token}`, {
      method: 'GET',
    });
    return response as { message: string };
  } catch (error) {
    console.error('Email verification error:', error);
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred during email verification');
  }
}

export async function getCredits(): Promise<{ active_credits: number; used_credits: number }> {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetchApi('/auth/credits', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response as { active_credits: number; used_credits: number };
  } catch (error) {
    console.error('Error fetching user credits:', error);
    throw error;
  }
}