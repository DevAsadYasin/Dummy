import { authenticatedFetch } from '@/utils/api';

export interface BugReportSubmission {
  title: string;
  description: string;
}

export interface BugReportResponse {
  id: number;
  title: string;
  description: string;
  created_at: string;
  status: string;
}

export const BugReportService = {
  async submitBugReport(report: BugReportSubmission): Promise<BugReportResponse> {
    const response = await authenticatedFetch('/bug-reports/submit', {
      method: 'POST',
      body: JSON.stringify(report),
    });
    return response;
  },

  async getBugReports(): Promise<BugReportResponse[]> {
    const response = await authenticatedFetch('/bug-reports/list');
    return response;
  },
};

