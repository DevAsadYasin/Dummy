export interface EmailFinderResponse {
  name?: string;
  company?: string;
  emails: {
    email: string;
    status: 'safe' | 'partial' | 'not_found';
    success_rate: number;
  };
  search_history_id: number;
  linkedin_url?: string;
}

export interface CompanyEmailResponse {
  search_history_id: number;
  emails: Array<{
    email: string;
    status: 'safe' | 'partial' | 'not_found';
    success_rate: number;
  }>;
}

export interface EmailFinderResult {
  id: number;
  email: string;
  status: 'safe' | 'partial' | 'not_found';
  success_rate: number;
  created_at: string;
}

export interface PersonSearchResult {
  id: number;
  search_history_id: number;
  name: string;
  company: string;
  email_finder_result: EmailFinderResult;
}

export interface CompanySearchResult {
  id: number;
  search_history_id: number;
  company: string;
  initial_search: {
    email_finder_results: EmailFinderResult[];
  };
}

export interface LinkedInSearchResult {
  id: number;
  search_history_id: number;
  name: string;
  company: string;
  linkedin_url: string;
  email_finder_result: EmailFinderResult;
}

export interface DecisionMakerSearchResult {
  id: number;
  search_history_id: number;
  name: string;
  position: string;
  company: string;
  linkedin_url: string;
  email_finder_result: EmailFinderResult;
}

export interface SearchResult {
  id: number;
  created_at: string;
  user_id: number;
  search_type: 'company_search' | 'linkedin_search' | 'person_search' | 'decision_maker_search';
  company_search_results: CompanySearchResult[];
  decision_maker_search_results: DecisionMakerSearchResult[];
  linkedin_search_results: LinkedInSearchResult[];
  person_search_results: PersonSearchResult[];
}

export interface PersonSearchRequest {
  username: string;
  domain: string;
}

export interface CompanySearchRequest {
  company_name: string;
}

export interface LinkedInSearchRequest {
  linkedin_url: string;
}

export interface DecisionMakerRequest {
  company_name: string;
  decision_maker: string;
}

