import { authenticatedFetch } from '@/utils/api';

export interface NotificationSetting {
  notification_type_id: number;
  name: string;
  description: string;
  enabled: boolean;
}

export interface NotificationUpdate {
  notification_type_id: number;
  enabled: boolean;
}

export interface ProfileInfo {
  username: string;
  role: string;
  company_name: string;
}

export const SettingsService = {
  getUserNotifications: async (): Promise<NotificationSetting[]> => {
    try {
      return await authenticatedFetch('/notifications/user');
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw error;
    }
  },

  updateNotifications: async (updates: NotificationUpdate[]): Promise<{ message: string }> => {
    try {
      return await authenticatedFetch('/notifications/update', {
        method: 'POST',
        body: JSON.stringify({ updates }),
      });
    } catch (error) {
      console.error('Error updating notifications:', error);
      throw error;
    }
  },

  getProfileInfo: async (): Promise<ProfileInfo> => {
    try {
      const response = await authenticatedFetch('/auth/get-profile-info');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile info:', error);
      throw error;
    }
  },

  updateProfileInfo: async (profileInfo: {
    new_username?: string;
    new_role?: string;
    new_company_name?: string;
  }): Promise<{ message: string, updated_fields: Partial<ProfileInfo> }> => {
    try {
      const response = await authenticatedFetch('/auth/update-profile-info', {
        method: 'POST',
        body: JSON.stringify(profileInfo),
      });
      return response;
    } catch (error) {
      console.error('Error updating profile info:', error);
      throw error;
    }
  },

  requestEmailUpdate: async (newEmail: string): Promise<{ message: string }> => {
    try {
      return await authenticatedFetch('/auth/update-email', {
        method: 'POST',
        body: JSON.stringify({ new_email: newEmail }),
      });
    } catch (error) {
      console.error('Error requesting email update:', error);
      throw error;
    }
  },

  cancelEmailUpdate: async (): Promise<{ message: string }> => {
    try {
      return await authenticatedFetch('/auth/cancel-email-update', {
        method: 'GET',
      });
    } catch (error) {
      console.error('Error canceling email update:', error);
      throw error;
    }
  },

  updatePassword: async (newPassword: string): Promise<{ message: string }> => {
    try {
      return await authenticatedFetch('/auth/update-password', {
        method: 'POST',
        body: JSON.stringify({ new_password: newPassword }),
      });
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  },

  disableAccount: async (): Promise<{ message: string }> => {
    try {
      return await authenticatedFetch('/auth/disable-account', {
        method: 'PUT',
      });
    } catch (error) {
      console.error('Error disabling account:', error);
      throw error;
    }
  },
};

