import { fetchApi, authenticatedFetch } from '@/utils/api';

export const ApiKeyService = {
  async refreshApiKey(): Promise<string> {
    const response = await authenticatedFetch('/api-keys/refresh', {
      method: 'POST',
    });
    return response.api_key;
  },

  async getRecentActivity(): Promise<any[]> {
    const response = await authenticatedFetch('/api-keys/recent-activity');
    return response.activity;
  },

  async getApiKeyDetails(): Promise<{ api_key: string; last_used: string | null }> {
    const response = await authenticatedFetch('/api-keys/details');
    return response;
  },
};
