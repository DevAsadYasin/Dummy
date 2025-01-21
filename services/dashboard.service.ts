import { SearchResult, EmailFinderResult } from '@/types/search';

export interface DashboardMetrics {
  totalSearches: number;
  verifiedEmails: number;
  successRate: number;
  monthlyGrowth: number;
  weeklyGrowth: number;
}

export interface EmailDiscoveryData {
  date: string;
  count: number;
}

export function calculateDashboardMetrics(searchHistory: SearchResult[]): DashboardMetrics {
  const totalSearches = searchHistory.length;
  let verifiedEmails = 0;
  let totalEmails = 0;

  searchHistory.forEach(result => {
    if (result.company_search_results?.length) {
      result.company_search_results.forEach(company => {
        company.initial_search?.email_finder_results?.forEach(email => {
          totalEmails++;
          if (email.status === 'safe') verifiedEmails++;
        });
      });
    }

    ['person_search_results', 'linkedin_search_results', 'decision_maker_search_results'].forEach(type => {
      const results = result[type as keyof SearchResult] as Array<{ email_finder_result: EmailFinderResult }>;
      if (results?.length) {
        results.forEach(r => {
          totalEmails++;
          if (r.email_finder_result?.status === 'safe') verifiedEmails++;
        });
      }
    });
  });

  // Calculate growth rates
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const lastWeek = new Date(now.setDate(now.getDate() - 7));

  const thisMonthSearches = searchHistory.filter(r => new Date(r.created_at) > lastMonth).length;
  const lastMonthSearches = searchHistory.filter(r => {
    const date = new Date(r.created_at);
    return date <= lastMonth && date > new Date(lastMonth.getFullYear(), lastMonth.getMonth() - 1, lastMonth.getDate());
  }).length;

  const thisWeekSearches = searchHistory.filter(r => new Date(r.created_at) > lastWeek).length;
  const lastWeekSearches = searchHistory.filter(r => {
    const date = new Date(r.created_at);
    return date <= lastWeek && date > new Date(lastWeek.setDate(lastWeek.getDate() - 7));
  }).length;

  const monthlyGrowth = lastMonthSearches ? ((thisMonthSearches - lastMonthSearches) / lastMonthSearches) * 100 : 0;
  const weeklyGrowth = lastWeekSearches ? ((thisWeekSearches - lastWeekSearches) / lastWeekSearches) * 100 : 0;

  return {
    totalSearches,
    verifiedEmails,
    successRate: totalEmails ? (verifiedEmails / totalEmails) * 100 : 0,
    monthlyGrowth,
    weeklyGrowth,
  };
}

export function getEmailDiscoveryTrend(searchHistory: SearchResult[]): { data: EmailDiscoveryData[], isWeekly: boolean } {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  
  // Check if all searches are from the current month
  const allCurrentMonth = searchHistory.every(result => {
    const date = new Date(result.created_at);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });

  if (allCurrentMonth) {
    // Show weekly data for the current month
    const weeklyData = new Map<string, number>();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const weeksInMonth = Math.ceil((now.getDate() + startOfMonth.getDay()) / 7);

    for (let i = 0; i < weeksInMonth; i++) {
      const weekStart = new Date(startOfMonth);
      weekStart.setDate(weekStart.getDate() + (i * 7));
      const weekLabel = `Week ${i + 1}`;
      weeklyData.set(weekLabel, 0);
    }

    searchHistory.forEach(result => {
      const date = new Date(result.created_at);
      const weekNumber = Math.floor((date.getDate() - 1) / 7) + 1;
      const weekLabel = `Week ${weekNumber}`;
      weeklyData.set(weekLabel, (weeklyData.get(weekLabel) || 0) + 1);
    });

    return {
      data: Array.from(weeklyData.entries()).map(([date, count]) => ({ date, count })),
      isWeekly: true
    };
  } else {
    // Show monthly data for the last 6 months
    const monthlyData = new Map<string, number>();

    for (let i = 0; i < 6; i++) {
      const date = new Date(sixMonthsAgo);
      date.setMonth(date.getMonth() + i);
      const key = date.toLocaleString('default', { month: 'short' });
      monthlyData.set(key, 0);
    }

    searchHistory.forEach(result => {
      const date = new Date(result.created_at);
      if (date >= sixMonthsAgo) {
        const month = date.toLocaleString('default', { month: 'short' });
        monthlyData.set(month, (monthlyData.get(month) || 0) + 1);
      }
    });

    return {
      data: Array.from(monthlyData.entries()).map(([date, count]) => ({ date, count })),
      isWeekly: false
    };
  }
}

export function getRecentActivity(searchHistory: SearchResult[]) {
  return searchHistory
    .slice(0, 4)
    .map(result => {
      let email = '';
      let status = '';
      let confidence = 0;

      if (result.company_search_results?.[0]?.initial_search?.email_finder_results?.[0]) {
        const emailResult = result.company_search_results[0].initial_search.email_finder_results[0];
        email = emailResult.email;
        status = emailResult.status;
        confidence = emailResult.success_rate;
      } else if (result.person_search_results?.[0]?.email_finder_result) {
        const emailResult = result.person_search_results[0].email_finder_result;
        email = emailResult.email;
        status = emailResult.status;
        confidence = emailResult.success_rate;
      } else if (result.linkedin_search_results?.[0]?.email_finder_result) {
        const emailResult = result.linkedin_search_results[0].email_finder_result;
        email = emailResult.email;
        status = emailResult.status;
        confidence = emailResult.success_rate;
      } else if (result.decision_maker_search_results?.[0]?.email_finder_result) {
        const emailResult = result.decision_maker_search_results[0].email_finder_result;
        email = emailResult.email;
        status = emailResult.status;
        confidence = emailResult.success_rate;
      }

      return {
        email,
        status: status === 'safe' ? 'Verified' : status === 'partial' ? 'Partial' : 'Failed',
        time: new Date(result.created_at).toLocaleString(),
        confidence,
      };
    });
}

