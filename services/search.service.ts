import { fetchApi } from '@/utils/api';
import { 
  SearchResult, 
  PersonSearchRequest, 
  CompanySearchRequest, 
  LinkedInSearchRequest, 
  DecisionMakerRequest,
  EmailFinderResponse,
  CompanyEmailResponse
} from '@/types/search';

export async function findPersonEmail(request: PersonSearchRequest): Promise<EmailFinderResponse> {
  return fetchApi('/email/find-person-email', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function findVerifiedEmails(request: CompanySearchRequest): Promise<CompanyEmailResponse> {
  return fetchApi('/email/find-company-emails', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function findLinkedInProfileEmail(request: LinkedInSearchRequest): Promise<EmailFinderResponse> {
  return fetchApi('/email/find-linkedin-email', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function findDecisionMakerEmail(request: DecisionMakerRequest): Promise<EmailFinderResponse> {
  return fetchApi('/email/find-decision-maker-email', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function getSearchHistory(): Promise<SearchResult[]> {
  return fetchApi('/history/search-history', {
    method: 'GET',
  });
}

export async function deleteSearchResult(id: number): Promise<void> {
  return fetchApi(`/history/search-history/${id}`, {
    method: 'DELETE',
  });
}

export async function reportSearchResult(id: number, reason: string): Promise<void> {
  return fetchApi(`/history/search-history/${id}/report`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export async function exportSearchResults(format: 'csv' | 'xlsx'): Promise<Blob> {
  const response = await fetchApi('/export-search-results', {
    method: 'POST',
    body: JSON.stringify({ format }),
    headers: {
      'Accept': 'application/octet-stream',
    },
  });
  return new Blob([response], { type: format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

