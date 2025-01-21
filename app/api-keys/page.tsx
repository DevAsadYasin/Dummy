'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Key, Copy, RefreshCw, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { ApiKeyService } from '@/services/apiKey.service'
import LoadingSpinner from '@/components/LoadingSpinner'

interface ApiKeyDetails {
  api_key: string;
  last_used: string | null;
}

interface ApiActivity {
  id: string;
  status: 'success' | 'error';
  message: string;
  endpoint: string;
  timestamp: string;
}

export default function APIKeys() {
  const { user, updateUser } = useAuth()
  const [apiKeyDetails, setApiKeyDetails] = useState<ApiKeyDetails | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [recentActivity, setRecentActivity] = useState<ApiActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await ApiKeyService.getApiKeyDetails()
        setApiKeyDetails(details)
        const activity = await ApiKeyService.getRecentActivity()
        setRecentActivity(activity)
      } catch (error) {
        console.error('Error fetching API key data:', error)
        setError('Failed to load API key data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCopyApiKey = () => {
    if (apiKeyDetails?.api_key) {
      navigator.clipboard.writeText(apiKeyDetails.api_key)
      toast({
        title: "API Key Copied",
        description: "The API key has been copied to your clipboard.",
      })
    }
  }

  const handleRefreshApiKey = async () => {
    setIsRefreshing(true)
    try {
      const newApiKey = await ApiKeyService.refreshApiKey()
      setApiKeyDetails(prev => prev ? { ...prev, api_key: newApiKey } : null)
      toast({
        title: "API Key Refreshed",
        description: "Your API key has been successfully refreshed.",
      })
    } catch (error) {
      console.error('Error refreshing API key:', error)
      toast({
        title: "Error",
        description: "Failed to refresh API key. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-900">API Keys</h1>
      </div>

      <Card className="border-blue-200 shadow-lg">
        <CardHeader className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-blue-900">Your API Key</CardTitle>
          </div>
          <CardDescription className="text-blue-600">
            Use this key to authenticate your requests to the Exact Mails API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <code className="font-mono text-sm text-blue-800">
                {apiKeyDetails?.api_key ? `${apiKeyDetails.api_key.slice(0, 12)}...${apiKeyDetails.api_key.slice(-4)}` : 'No API key available'}
              </code>
              {apiKeyDetails?.last_used && (
                <p className="text-xs text-blue-600 mt-1 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Last used: {new Date(apiKeyDetails.last_used).toLocaleString()}
                </p>
              )}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyApiKey}
                disabled={!apiKeyDetails?.api_key}
                className="text-blue-600 border-blue-200 hover:bg-blue-100"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshApiKey}
                disabled={isRefreshing}
                className="text-blue-600 border-blue-200 hover:bg-blue-100"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">Important</AlertTitle>
            <AlertDescription className="text-yellow-700">
              Keep your API key secret. If compromised, refresh it immediately.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card className="border-blue-200 shadow-lg">
        <CardHeader className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white">
          <CardTitle className="text-blue-900">Recent API Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {recentActivity && recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                {activity.status === "success" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <div className="flex-1">
                  <p className="font-medium text-blue-900">{activity.message}</p>
                  <p className="text-sm text-blue-600">
                    {activity.endpoint} • {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
                <Badge variant={activity.status === "success" ? "default" : "destructive"}>
                  {activity.status}
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No recent activity</div>
          )}
        </CardContent>
      </Card>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertTitle className="text-blue-800">API Documentation</AlertTitle>
        <AlertDescription className="text-blue-700">
          Learn how to integrate Exact Mails into your application by reading our comprehensive API documentation.
          <Button variant="link" className="p-0 h-auto font-normal text-blue-600 hover:text-blue-700">
            View Documentation →
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  )
}

