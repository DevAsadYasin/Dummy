'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, Check, XCircle, CheckSquare, AlertCircle, Mail, Trash2, AlertTriangle, Copy, Briefcase, Linkedin, ChevronDown, Zap, Shield, Search, History } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SearchResult, EmailFinderResult, CompanySearchResult, PersonSearchResult, LinkedInSearchResult, DecisionMakerSearchResult } from '@/types/search';
import { getSearchHistory, deleteSearchResult } from '@/services/search.service';
import { Building2, User } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";

interface SearchResultsProps {
  initialResults?: SearchResult[];
  newResult?: SearchResult | null;
  isAuthenticated: boolean;
}

type SearchType = 'company_search' | 'linkedin_search' | 'person_search' | 'decision_maker_search';

const searchTypeConfig: Record<SearchType, {
  icon: React.ElementType;
  bgColor: string;
  iconBg: string;
  textColor: string;
}> = {
  company_search: { icon: Building2, bgColor: "bg-green-50", iconBg: "bg-green-100", textColor: "text-green-800" },
  linkedin_search: { icon: Linkedin, bgColor: "bg-indigo-100", iconBg: "bg-indigo-200", textColor: "text-indigo-800" },
  person_search: { icon: User, bgColor: "bg-blue-100", iconBg: "bg-blue-200", textColor: "text-blue-800" },
  decision_maker_search: { icon: Briefcase, bgColor: "bg-sky-100", iconBg: "bg-sky-200", textColor: "text-sky-800" },
};


const StatusIcon = ({ status }: { status?: string }) => {
  switch (status?.toLowerCase()) {
    case "safe":
    case "verified":
      return <CheckSquare className="h-5 w-5 text-green-500 stroke-[3]" />;
    case "partial":
      return <AlertCircle className="h-5 w-5 text-yellow-500 stroke-[3]" />;
    default:
      return <XCircle className="h-5 w-5 text-red-500 stroke-[3]" />;
  }
};

const ConfidenceBar = ({ confidence }: { confidence: number }) => (
  <div className="flex items-center gap-2">
    <div className="w-24 h-2 rounded-full bg-white overflow-hidden border border-gray-400">
      <div
        className={`h-full ${
          confidence > 90 ? "bg-green-500" : confidence > 70 ? "bg-yellow-500" : "bg-red-500"
        }`}
        style={{ width: `${confidence}%` }}
      />
    </div>
    <span className="text-sm text-black">{confidence}%</span>
  </div>
);

const ActionButtons = ({ id, onDelete }: { id: number; onDelete: (id: number) => void }) => (
  <div className="flex items-center gap-2">
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600 hover:bg-red-50" onClick={() => onDelete(id)} aria-label="Delete record">
          <Trash2 className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Delete record</TooltipContent>
    </Tooltip>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-yellow-600 hover:bg-yellow-50" aria-label="Report data">
          <AlertTriangle className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Report data</TooltipContent>
    </Tooltip>
  </div>
);

const CopyButton = ({ text, variant = 'ghost', size = 'icon', className = '', children }: { text: string; variant?: 'ghost' | 'outline'; size?: 'sm' | 'icon'; className?: string; children?: React.ReactNode }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant={variant} size={size} className={`${isCopied ? 'text-green-500' : 'text-blue-500 hover:text-blue-700'} ${className}`} onClick={handleCopy}>
          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {children && <span className="ml-2">{children}</span>}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{isCopied ? 'Copied!' : 'Copy'}</TooltipContent>
    </Tooltip>
  );
};

export const SearchResultsComponent: React.FC<SearchResultsProps> = ({ initialResults = [], newResult, isAuthenticated }) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [searchResults, setSearchResults] = useState<SearchResult[]>(initialResults);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    const fetchSearchHistory = async () => {
      try {
        const results = await getSearchHistory();
        setSearchResults(prevResults => {
          const combinedResults = [...prevResults, ...results];
          const uniqueResults = Array.from(new Map(combinedResults.map(item => [item.id, item])).values());
          return uniqueResults.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        });
      } catch (err) {
        setError('Failed to fetch search history. Please try again later.');
        toast({ title: "Error", description: "Failed to fetch search history.", variant: "destructive" });
      }
      setIsLoading(false);
    };

    fetchSearchHistory();
  }, []);

  useEffect(() => {
    setSearchResults(initialResults);
  }, [initialResults]);

  useEffect(() => {
    if (newResult && newResult.id) {
      setSearchResults(prevResults => {
        const exists = prevResults.some(result => result.id === newResult.id);
        if (!exists) return [newResult, ...prevResults];
        return prevResults;
      });
      setExpandedRows(new Set([newResult.id]));
    }
  }, [newResult]);

  const toggleRow = (id: number) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const confirmDelete = async () => {
    if (deletingId) {
      setIsDeleting(true);
      try {
        await deleteSearchResult(deletingId);
        setSearchResults(prevResults => prevResults.filter(result => result.id !== deletingId));
        toast({ title: "Record deleted", description: "The search history record has been successfully deleted." });
      } catch (error) {
        console.error("Error deleting record:", error);
        toast({ title: "Error", description: "Failed to delete the record. Please try again.", variant: "destructive" });
      }
      setIsDeleting(false);
    }
    setIsDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const renderSearchResult = (result: SearchResult) => {
    if (!result) return null;

    switch (result.search_type) {
      case 'company_search':
        return result.company_search_results && result.company_search_results.length > 0
          ? renderCompanySearchResult(result.company_search_results[0])
          : null;
      case 'person_search':
        return result.person_search_results && result.person_search_results.length > 0
          ? renderPersonSearchResult(result.person_search_results[0])
          : null;
      case 'linkedin_search':
        return result.linkedin_search_results && result.linkedin_search_results.length > 0
          ? renderLinkedInSearchResult(result.linkedin_search_results[0])
          : null;
      case 'decision_maker_search':
        return result.decision_maker_search_results && result.decision_maker_search_results.length > 0
          ? renderDecisionMakerSearchResult(result.decision_maker_search_results[0])
          : null;
      default:
        return null;
    }
  };

  const renderCompanySearchResult = (result: CompanySearchResult) => {
    const { icon: Icon, bgColor, iconBg, textColor } = searchTypeConfig.company_search;
    const isExpanded = expandedRows.has(result.search_history_id);
    const emailFinderResults = result.initial_search?.email_finder_results || [];
    const hasResults = emailFinderResults.length > 0;
    const verifiedEmails = emailFinderResults.filter(email => email.status === 'safe');

    return (
      <div key={result.search_history_id} className="mb-4 rounded-lg border border-green-400 overflow-hidden shadow-sm">
        <div className={`p-4 ${bgColor}`}>
          <div className="grid grid-cols-7 gap-4 items-center">
            <div className="col-span-12 md:col-span-2 flex items-center gap-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full ${iconBg} flex items-center justify-center ${textColor}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="font-medium truncate">{result.company}</div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-2 flex items-center gap-2">
              <Mail className="h-4 w-4 flex-shrink-0 text-gray-600 stroke-[3]" />
              {hasResults ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => toggleRow(result.search_history_id)} className="flex items-center gap-2 text-gray-800 hover:text-green-600 hover:bg-white">
                      <span className="text-sm">View {emailFinderResults.length} emails</span>
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isExpanded ? 'Hide' : 'View'} found email addresses</TooltipContent>
                </Tooltip>
              ) : (
                <span className="text-sm text-black">No results</span>
              )}
            </div>

            <div className="col-span-12 md:col-span-1 flex items-center gap-2">
              <StatusIcon status={emailFinderResults[0]?.status || 'not_found'} />
              <span className={`text-sm font-bold ${
                emailFinderResults[0]?.status === 'safe'
                  ? 'text-green-500'
                  : emailFinderResults[0]?.status === 'partial'
                  ? 'text-yellow-500'
                  : 'text-red-500'
              }`}>
                {emailFinderResults[0]?.status === 'safe' ? 'Verified' : emailFinderResults[0]?.status === 'partial' ? 'Partial' : 'Not Found'}
              </span>
            </div>

            <div className="col-span-12 md:col-span-1">
              <ConfidenceBar confidence={emailFinderResults[0]?.success_rate || 0} />
            </div>

            <div className="col-span-12 md:col-span-1 flex items-center justify-end gap-2">
              <ActionButtons id={result.search_history_id} onDelete={(id) => { setDeletingId(id); setIsDeleteDialogOpen(true); }} />
            </div>
          </div>

          {isExpanded && hasResults && (
            <div className="mt-4 pl-14">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Found {emailFinderResults.length} Emails</span>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <CopyButton text={verifiedEmails.map(e => e.email).join('\n')} variant="outline" size="sm" className="bg-green-100 text-green-700 border-green-200 hover:bg-green-200 hover:text-green-800">
                      Copy {verifiedEmails.length} Verified
                    </CopyButton>
                    <CopyButton text={emailFinderResults.map(e => e.email).join('\n')} variant="outline" size="sm" className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 hover:text-blue-800">
                      Copy All ({emailFinderResults.length})
                    </CopyButton>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                  {emailFinderResults.map((email: EmailFinderResult, idx: number) => (
                    <div key={idx} className="flex items-center justify-between bg-white rounded-lg p-3 border border-green-200 hover:border-green-300 transition-colors duration-200">
                      <div className="flex items-center gap-2">
                        <StatusIcon status={email.status} />
                        <span className="text-sm font-medium break-all text-gray-700">{email.email}</span>
                      </div>
                      <CopyButton text={email.email} className='text-gray hover:text-green'/>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-4 mt-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 hover:text-yellow-800">
                        <Zap className="h-4 w-4 mr-2" />
                        Instant Search
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Get instant results in bulk and pay 1 credit for 20 mails (not 100% verified)</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800">
                        <Shield className="h-4 w-4 mr-2" />
                        Verified Search
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Get 100% verified results (takes some time) and pay 1 credit for 5 emails</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPersonSearchResult = (result: PersonSearchResult) => {
    if (!result) return null;

    const { icon: Icon, bgColor, iconBg, textColor } = searchTypeConfig.person_search;
    const emailFinderResult = result.email_finder_result || { email: 'N/A', status: 'not_found', success_rate: 0 };
    const hasResults = emailFinderResult.status !== 'not_found';

    return (
      <div key={result.search_history_id} className={`mb-4 rounded-lg ${bgColor} border border-blue-200 overflow-hidden shadow-sm`}>
        <div className="p-4">
          <div className="grid grid-cols-7 gap-4 items-center">
            <div className="col-span-2 flex items-center gap-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full ${iconBg} flex items-center justify-center ${textColor}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="font-medium truncate text-blue-800">{result.name || 'Unknown'}</div>
                <div className="text-sm text-blue-500 truncate">{result.company || 'Unknown Company'}</div>
              </div>
            </div>

            <div className="col-span-2 flex items-center gap-2 overflow-hidden">
              <Mail className="h-4 w-4 flex-shrink-0 text-gray-600 stroke-[3]" />
              {hasResults ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm truncate text-gray-700">{emailFinderResult.email}</span>
                  <CopyButton text={emailFinderResult.email} className='text-gray-600'/>
                </div>
              ) : (
                <span className="text-sm text-gray-500">No results</span>
              )}
            </div>

            <div className="col-span-1 flex items-center gap-2">
              <StatusIcon status={emailFinderResult.status} />
              <span className={`text-sm font-bold ${
                emailFinderResult.status === 'safe'
                  ? 'text-green-500'
                  : emailFinderResult.status === 'partial'
                  ? 'text-yellow-500'
                  : 'text-red-500'
              }`}>
                {emailFinderResult.status === 'safe' ? 'Verified' : emailFinderResult.status === 'partial' ? 'Partial' : 'Not Found'}
              </span>
            </div>

            <div className="col-span-1">
              <ConfidenceBar confidence={emailFinderResult.success_rate} />
            </div>

            <div className="col-span-1 flex items-center justify-end gap-2">
              <ActionButtons id={result.search_history_id} onDelete={(id) => { setDeletingId(id); setIsDeleteDialogOpen(true); }} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLinkedInSearchResult = (result: LinkedInSearchResult) => {
    if (!result) return null;

    const { icon: Icon, bgColor, iconBg, textColor } = searchTypeConfig['linkedin_search'];
    const isExpanded = expandedRows.has(result.search_history_id);
    const emailFinderResult = result.email_finder_result || { email: 'N/A', status: 'not_found', success_rate: 0 };
    const hasResults = emailFinderResult.status !== 'not_found';

    return (
      <div key={result.search_history_id} className="mb-4 rounded-lg border border-indigo-400	 overflow-hidden shadow-sm">
        <div className={`p-4 ${bgColor}`}>
          <div className="grid grid-cols-7 gap-4 items-center">
            <div className="col-span-2 flex items-center gap-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full ${iconBg} flex items-center justify-center ${textColor}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="font-medium truncate text-blue-800">{result.name}</div>
                <div className="text-sm text-blue-500 truncate">{result.company}</div>
              </div>
            </div>

            <div className="col-span-2 flex items-center gap-2">
              <Mail className="h-4 w-4 flex-shrink-0 text-gray-600 stroke-[3]" />
              {hasResults ? (
                <Button variant="ghost" size="sm" onClick={() => toggleRow(result.search_history_id)} className="flex items-center gap-2 text-gray-600 hover:text-blue-800">
                  <span className="text-sm">View Results</span>
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              ) : (
                <span className="text-sm text-gray-500">No results</span>
              )}
            </div>

            <div className="col-span-1 flex items-center gap-2">
              <StatusIcon status={emailFinderResult.status} />
              <span className={`text-sm font-bold ${
                emailFinderResult.status === 'safe'
                  ? 'text-green-500'
                  : emailFinderResult.status === 'partial'
                  ? 'text-yellow-500'
                  : 'text-red-500'
              }`}>
                {emailFinderResult.status === 'safe' ? 'Verified' : emailFinderResult.status === 'partial' ? 'Partial' : 'Not Found'}
              </span>
            </div>

            <div className="col-span-1">
              <ConfidenceBar confidence={emailFinderResult.success_rate} />
            </div>

            <div className="col-span-1 flex items-center justify-end gap-2">
              <ActionButtons id={result.search_history_id} onDelete={(id) => { setDeletingId(id); setIsDeleteDialogOpen(true); }} />
            </div>

            {isExpanded && hasResults && (
              <div className="col-span-12 mt-4 pl-14">
                <div className="flex items-center space-x-8 bg-white rounded-lg p-4 border border-blue-200 hover:border-blue-300 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-400" />
                    <span className="text-sm font-medium text-blue-700">{emailFinderResult.email}</span>
                    <CopyButton text={emailFinderResult.email} />
                  </div>
                  <div className="flex items-center gap-3">
                    <Linkedin className="h-5 w-5 text-[#0A66C2]" />
                    <a href={result.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#0A66C2] hover:underline font-medium">
                      View Profile
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderDecisionMakerSearchResult = (result: DecisionMakerSearchResult) => {
    if (!result) return null;

    const { icon: Icon, bgColor, iconBg, textColor } = searchTypeConfig['decision_maker_search'];
    const isExpanded = expandedRows.has(result.search_history_id);
    const emailFinderResult = result.email_finder_result || { email: 'N/A', status: 'not_found', success_rate: 0 };
    const hasResults = emailFinderResult.status !== 'not_found';

    return (
      <div key={result.search_history_id} className="mb-4 rounded-lg border border-blue-200 overflow-hidden shadow-sm">
        <div className={`p-4 ${bgColor}`}>
          <div className="grid grid-cols-7 gap-4 items-center">
            <div className="col-span-2 flex items-center gap-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full ${iconBg} flex items-center justify-center ${textColor}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="font-medium truncate text-blue-800">{result.name}</div>
                <div className="text-sm text-blue-500 truncate">{result.company}</div>
              </div>
            </div>

            <div className="col-span-2 flex items-center gap-2">
              <Mail className="h-4 w-4 flex-shrink-0 text-gray-600 stroke-[3]" />
              {hasResults ? (
                <Button variant="ghost" size="sm" onClick={() => toggleRow(result.search_history_id)} className="flex items-center gap-2 text-gray-600 hover:text-blue-800">
                  <span className="text-sm">View Results</span>
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              ) : (
                <span className="text-sm text-gray-500">No results</span>
              )}
            </div>

            <div className="col-span-1 flex items-center gap-2">
              <StatusIcon status={emailFinderResult.status} />
              <span className={`text-sm font-bold ${
                emailFinderResult.status === 'safe'
                  ? 'text-green-500'
                  : emailFinderResult.status === 'partial'
                  ? 'text-yellow-500'
                  : 'text-red-500'
              }`}>
                {emailFinderResult.status === 'safe' ? 'Verified' : emailFinderResult.status === 'partial' ? 'Partial' : 'Not Found'}
              </span>
            </div>

            <div className="col-span-1">
              <ConfidenceBar confidence={emailFinderResult.success_rate} />
            </div>

            <div className="col-span-1 flex items-center justify-end gap-2">
              <ActionButtons id={result.search_history_id} onDelete={(id) => { setDeletingId(id); setIsDeleteDialogOpen(true); }} />
            </div>

            {isExpanded && hasResults && (
              <div className="col-span-12 mt-4 pl-14">
                <div className="flex items-center space-x-8 bg-white rounded-lg p-4 border border-blue-200 hover:border-blue-300 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-400" />
                    <span className="text-sm font-medium text-blue-700">{emailFinderResult.email}</span>
                    <CopyButton text={emailFinderResult.email} />
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium text-blue-700">{result.position}</span>
                  </div>
                  {result.linkedin_url && (
                    <div className="flex items-center gap-3">
                      <Linkedin className="h-5 w-5 text-[#0A66C2]" />
                      <a href={result.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#0A66C2] hover:underline font-medium">
                        View Profile
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div className="p-4 text-center text-blue-600">Loading search results...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-blue-500">
        <Search className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">Your search history will be displayed here</p>
        <p className="text-sm">Log in to start searching and viewing your history</p>
      </div>
    );
  }

  if (searchResults.length === 0 && !newResult) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-blue-500">
        <History className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">No search history yet</p>
        <p className="text-sm">Start searching to see your results here</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-2">
        {searchResults.map((result) => renderSearchResult(result))}
      </div>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this record?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the search history record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};

export { SearchResultsComponent as SearchResults };

