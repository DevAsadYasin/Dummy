'use client'

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, User, Building2, Briefcase, Linkedin, AlertCircle } from 'lucide-react';
import { SearchResults } from "@/components/SearchResults";
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from "@/components/LoadingSpinner";
import { 
  findPersonEmail, 
  findLinkedInProfileEmail, 
  findDecisionMakerEmail, 
  findVerifiedEmails,
  exportSearchResults 
} from "@/services/search.service";
import type { SearchResult } from "@/types/search";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const searchTypes = [
  { value: "person", label: "Person Search", icon: User, color: "bg-blue-50 text-blue-600" },
  { value: "company", label: "Company Search", icon: Building2, color: "bg-indigo-50 text-indigo-600" },
  { value: "position", label: "Position Search", icon: Briefcase, color: "bg-purple-50 text-purple-600" },
  { value: "linkedin", label: "LinkedIn Search", icon: Linkedin, color: "bg-cyan-50 text-cyan-600" },
];

const decisionMakerOptions = [
  "CEO/Owner/Director/Function",
  "Vice President",
  "Engineering",
  "Finance",
  "Human Resources",
  "IT",
  "Logistics",
  "Marketing",
  "Administration",
  "Sales"
];

export default function EmailFinder() {
  const [selectedTab, setSelectedTab] = useState("person");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [newResult, setNewResult] = useState<SearchResult | null>(null);
  const { isAuthenticated, isLoading, user, credits, fetchCredits } = useAuth();

  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [decisionMaker, setDecisionMaker] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    domain: "",
    companyName: "",
    linkedinUrl: "",
    decisionMaker: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchCredits();
    }
  }, [isAuthenticated, fetchCredits]);

  const validateName = useCallback((value: string) => {
    if (!value) return "Full name is required";
    if (!/^[a-zA-Z\s]+$/.test(value)) return "Only English alphabets and spaces are allowed";
    return "";
  }, []);

  const validateDomainOrCompanyName = useCallback((value: string) => {
    if (!value) return "Domain or company name is required";
    
    const isDomain = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    
    const isCompanyName = /^[a-zA-Z0-9\s]+$/.test(value) && !/^\d+$/.test(value);
    
    if (isDomain || isCompanyName) {
      return "";
    } else {
      return "Enter a valid domain (e.g., example.com) or company name";
    }
  }, []);

  const validateLinkedinUrl = useCallback((value: string) => {
    if (!value) return "LinkedIn URL is required";
    if (!/^https:\/\/[a-z]{2,3}\.linkedin\.com\/.*$/.test(value)) return "Invalid LinkedIn URL";
    return "";
  }, []);

  const validateInputs = useCallback(() => {
    let isValid = true;
    const newErrors = { ...errors };

    if (selectedTab === "person") {
      newErrors.name = validateName(name);
      newErrors.domain = validateDomainOrCompanyName(domain);
      if (newErrors.name || newErrors.domain) isValid = false;
    } else if (selectedTab === "company") {
      newErrors.companyName = validateDomainOrCompanyName(companyName);
      if (newErrors.companyName) isValid = false;
    } else if (selectedTab === "position") {
      newErrors.companyName = validateDomainOrCompanyName(companyName);
      newErrors.decisionMaker = decisionMaker ? "" : "Please select a position";
      if (newErrors.companyName || newErrors.decisionMaker) isValid = false;
    } else if (selectedTab === "linkedin") {
      newErrors.linkedinUrl = validateLinkedinUrl(linkedinUrl);
      if (newErrors.linkedinUrl) isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [selectedTab, name, domain, companyName, decisionMaker, linkedinUrl, errors, validateName, validateDomainOrCompanyName, validateLinkedinUrl]);

  const handleFindEmail = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in and subscribe to use this feature.",
        variant: "destructive",
      });
      return;
    }

    if (!credits || credits.active <= 0) {
      toast({
        title: "No credits available",
        description: "Please subscribe or purchase credits to perform this action.",
        variant: "destructive",
      });
      return;
    }

    if (!validateInputs()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setLoadingMessage("Searching...");

    try {
      let result: SearchResult;
      const searchHistoryId = Date.now();
      switch (selectedTab) {
        case "person":
          if (!isAuthenticated) return;
          const personResult = await findPersonEmail({ username: name, domain });
          result = {
            id: personResult.search_history_id,
            created_at: new Date().toISOString(),
            user_id: Number(user!.id),
            search_type: 'person_search',
            person_search_results: [{
              id: Date.now(),
              search_history_id: personResult.search_history_id,
              name: personResult.name || name,
              company: personResult.company || domain,
              email_finder_result: {
                id: Date.now(),
                email: personResult.emails.email,
                status: personResult.emails.status,
                success_rate: personResult.emails.success_rate,
                created_at: new Date().toISOString(),
              },
            }],
            company_search_results: [],
            decision_maker_search_results: [],
            linkedin_search_results: [],
          };
          break;
        case "company":
          if (!isAuthenticated) return; // Ensure user is authenticated
          const companyResult = await findVerifiedEmails({ company_name: companyName });
          result = {
            id: companyResult.search_history_id,
            created_at: new Date().toISOString(),
            user_id: Number(user!.id),
            search_type: 'company_search',
            company_search_results: [{
              id: Date.now(),
              search_history_id: companyResult.search_history_id,
              company: companyName,
              initial_search: {
                email_finder_results: companyResult.emails.map(email => ({
                  id: Date.now(),
                  email: email.email,
                  status: email.status,
                  success_rate: email.success_rate,
                  created_at: new Date().toISOString(),
                })),
              },
            }],
            decision_maker_search_results: [],
            linkedin_search_results: [],
            person_search_results: [],
          };
          break;
        case "position":
          if (!isAuthenticated) return;
          const decisionMakerResult = await findDecisionMakerEmail({ company_name: companyName, decision_maker: decisionMaker });
          result = {
            id: decisionMakerResult.search_history_id,
            created_at: new Date().toISOString(),
            user_id: Number(user!.id),
            search_type: 'decision_maker_search',
            decision_maker_search_results: [{
              id: Date.now(),
              search_history_id: decisionMakerResult.search_history_id,
              name: decisionMakerResult.name || 'Unknown',
              position: decisionMaker,
              company: companyName,
              linkedin_url: decisionMakerResult.linkedin_url || '',
              email_finder_result: {
                id: Date.now(),
                email: decisionMakerResult.emails?.email,
                status: decisionMakerResult.emails?.status,
                success_rate: decisionMakerResult.emails?.success_rate,
                created_at: new Date().toISOString(),
              },
            }],
            company_search_results: [],
            linkedin_search_results: [],
            person_search_results: [],
          };
          break;
        case "linkedin":
          if (!isAuthenticated) return;
          const linkedinResult = await findLinkedInProfileEmail({ linkedin_url: linkedinUrl });
          result = {
            id: linkedinResult.search_history_id,
            created_at: new Date().toISOString(),
            user_id: Number(user!.id),
            search_type: 'linkedin_search',
            linkedin_search_results: [{
              id: Date.now(),
              search_history_id: linkedinResult.search_history_id,
              name: linkedinResult.name || 'Unknown',
              company: linkedinResult.company || 'Unknown',
              linkedin_url: linkedinUrl,
              email_finder_result: {
                id: Date.now(),
                email: linkedinResult.emails.email,
                status: linkedinResult.emails.status,
                success_rate: linkedinResult.emails.success_rate,
                created_at: new Date().toISOString(),
              },
            }],
            company_search_results: [],
            decision_maker_search_results: [],
            person_search_results: [],
          };
          break;
        default:
          throw new Error("Invalid search type");
      }

      setNewResult(result);

      toast({
        title: "Search completed",
        description: "Email finder results have been updated",
      });
    } catch (error) {
      console.error("Error finding email:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while searching",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleExport = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to export results.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const blob = await exportSearchResults('csv');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `email-finder-results-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "Export successful",
        description: "Your results have been downloaded",
      });
    } catch (error) {
      console.error("Error exporting results:", error);
      toast({
        title: "Export failed",
        description: "Failed to export results. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Email Finder</h1>
        <Button variant="outline" className="gap-2" onClick={handleExport} disabled={loading || searchResults.length === 0 || !isAuthenticated}>
          <Download className="h-4 w-4" /> Export Results
        </Button>
      </div>

      {!isAuthenticated && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please log in and subscribe to use the Email Finder feature.
          </AlertDescription>
        </Alert>
      )}
      <Card className="bg-gradient-to-br from-blue-100 to-white shadow-lg border-blue-200 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-black/50 z-10 rounded-lg">
            <div className="text-white space-y-4 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent mx-auto"></div>
              <p className="font-medium">{loadingMessage}</p>
            </div>
          </div>
        )}
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle className="text-2xl">Find Email Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid grid-cols-4 gap-4 bg-blue-50 p-1 rounded-lg">
              {searchTypes.map((type) => (
                <TabsTrigger
                  key={type.value}
                  value={type.value}
                  className={`flex items-center gap-2 transition-all duration-200 ${
                    selectedTab === type.value 
                      ? `${type.color} shadow-sm font-medium` 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <type.icon className="h-5 w-5" />
                  {type.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex gap-4 items-center">
            {selectedTab === "person" && (
              <>
                <div className="flex-1">
                  <Input 
                    placeholder="Full name..." 
                    className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm ${errors.name ? 'border-red-500' : ''}`}
                    disabled={loading || !isAuthenticated}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors(prev => ({ ...prev, name: validateName(e.target.value) }));
                    }}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div className="flex-1">
                  <Input 
                    placeholder="Company domain..." 
                    className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm ${errors.domain ? 'border-red-500' : ''}`}
                    disabled={loading || !isAuthenticated}
                    value={domain}
                    onChange={(e) => {
                      setDomain(e.target.value);
                      setErrors(prev => ({ ...prev, domain: validateDomainOrCompanyName(e.target.value) }));
                    }}
                  />
                  {errors.domain && <p className="text-red-500 text-xs mt-1">{errors.domain}</p>}
                </div>
              </>
            )}

            {selectedTab === "company" && (
              <div className="flex-1">
                <Input 
                  placeholder="Company name..." 
                  className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm ${errors.companyName ? 'border-red-500' : ''}`}
                  disabled={loading || !isAuthenticated}
                  value={companyName}
                  onChange={(e) => {
                    setCompanyName(e.target.value);
                    setErrors(prev => ({ ...prev, companyName: validateDomainOrCompanyName(e.target.value) }));
                  }}
                />
                {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
              </div>
            )}

            {selectedTab === "position" && (
              <>
                <div className="flex-1">
                  <Input 
                    placeholder="Company name..." 
                    className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm ${errors.companyName ? 'border-red-500' : ''}`}
                    disabled={loading || !isAuthenticated}
                    value={companyName}
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                      setErrors(prev => ({ ...prev, companyName: validateDomainOrCompanyName(e.target.value) }));
                    }}
                  />
                  {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                </div>
                <div className="flex-1">
                  <select 
                    className={`w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 ${errors.decisionMaker ? 'border-red-500' : ''}`}
                    disabled={loading || !isAuthenticated}
                    value={decisionMaker}
                    onChange={(e) => {
                      setDecisionMaker(e.target.value);
                      setErrors(prev => ({ ...prev, decisionMaker: e.target.value ? "" : "Please select a position" }));
                    }}
                  >
                    <option value="">Select Position</option>
                    {decisionMakerOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {errors.decisionMaker && <p className="text-red-500 text-xs mt-1">{errors.decisionMaker}</p>}
                </div>
              </>
            )}

            {selectedTab === "linkedin" && (
              <div className="flex-1">
                <Input 
                  placeholder="LinkedIn Profile URL..." 
                  className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm ${errors.linkedinUrl ? 'border-red-500' : ''}`}
                  disabled={loading || !isAuthenticated}
                  value={linkedinUrl}
                  onChange={(e) => {
                    setLinkedinUrl(e.target.value);
                    setErrors(prev => ({ ...prev, linkedinUrl: validateLinkedinUrl(e.target.value) }));
                  }}
                />
                {errors.linkedinUrl && <p className="text-red-500 text-xs mt-1">{errors.linkedinUrl}</p>}
              </div>
            )}

            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
              onClick={handleFindEmail}
              disabled={loading || !isAuthenticated || !credits || credits.active <= 0 || Object.values(errors).some(error => error !== "")}
            >
              <Search className="h-4 w-4 mr-2" /> Find Email
            </Button>
          </div>

          <div>
            {isAuthenticated && credits && (
              <span>
                {credits.active > 0 ? (
                  <span className="ml-2 text-green-500 font-medium">
                    You have {credits.active} active credits available.
                  </span>
                ) : (
                  <span className="ml-2 text-red-500 font-medium">
                    No credits available. Please subscribe or purchase credits.
                  </span>
                )}
              </span>
            )}
          </div>

        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900">Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchResults initialResults={searchResults} newResult={newResult} isAuthenticated={isAuthenticated} />
        </CardContent>
      </Card>
    </div>
  );
}