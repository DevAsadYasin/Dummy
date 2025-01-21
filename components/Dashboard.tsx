'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Mail, CheckCircle, AlertCircle, TrendingUp, Activity, BarChart2, Info } from 'lucide-react'
import { EmailDiscoveryChart } from '@/components/email-discovery-chart'
import { getSearchHistory } from '@/services/search.service'
import { calculateDashboardMetrics, getEmailDiscoveryTrend, getRecentActivity } from '@/services/dashboard.service'
import { useAuth } from '@/contexts/AuthContext'
import { SearchResult } from '@/types/search'
import LoadingSpinner from './LoadingSpinner'

export function Dashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [searchHistory, setSearchHistory] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const history = await getSearchHistory()
        setSearchHistory(history)
      } catch (error) {
        console.error('Error fetching search history:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }

  const metrics = calculateDashboardMetrics(searchHistory)
  const { data: discoveryTrend, isWeekly } = getEmailDiscoveryTrend(searchHistory)
  const recentActivity = getRecentActivity(searchHistory)

  const hasSearchHistory = searchHistory.length > 0
  const hasRecentActivity = recentActivity.length > 0

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-900">Dashboard Overview</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
            <Mail className="h-4 w-4 opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalSearches.toLocaleString()}</div>
            <CardDescription className="text-xs mt-1 text-blue-100">
              {hasSearchHistory 
                ? `${metrics.monthlyGrowth > 0 ? '+' : ''}${metrics.monthlyGrowth.toFixed(1)}% from last month`
                : "Start searching to see growth"}
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Verified Emails</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{metrics.verifiedEmails.toLocaleString()}</div>
            <Progress value={metrics.successRate} className="h-1 mt-2" />
            <CardDescription className="text-xs mt-1">
              {hasSearchHistory ? `${metrics.successRate.toFixed(1)}% success rate` : "No verified emails yet"}
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Credits Left</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{user?.active_credits?.toLocaleString() || 0}</div>
            <Progress 
              value={user?.active_credits ? (user.active_credits / (user.active_credits + (user.used_credits || 0))) * 100 : 0} 
              className="h-1 mt-2" 
            />
            <CardDescription className="text-xs mt-1">
              {user?.active_credits 
                ? `${Math.round((user.active_credits / (user.active_credits + (user.used_credits || 0))) * 100)}% remaining`
                : "No credits available"}
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {hasSearchHistory ? `${metrics.successRate.toFixed(1)}%` : "N/A"}
            </div>
            <CardDescription className="text-xs mt-1">
              {hasSearchHistory
                ? `${metrics.weeklyGrowth > 0 ? '+' : ''}${metrics.weeklyGrowth.toFixed(1)}% from last week`
                : "Start searching to see success rate"}
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {hasSearchHistory ? (
          <EmailDiscoveryChart data={discoveryTrend} isWeekly={isWeekly} />
        ) : (
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-900">Email Discovery Trend</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-[350px] text-center">
              <BarChart2 className="h-16 w-16 text-blue-300 mb-4" />
              <h3 className="text-lg font-semibold text-blue-900 mb-2">No Search Data Yet</h3>
              <p className="text-sm text-blue-600 max-w-md">
                Start searching for emails to see your discovery trend. Your search history will be displayed here.
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {hasRecentActivity ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-blue-50/50 rounded-lg border border-blue-100"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-blue-900">{activity.email}</p>
                      <CardDescription>{activity.time}</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge
                          className={
                            activity.status === "Verified"
                              ? "bg-green-100 text-green-800"
                              : activity.status === "Processing" || activity.status === "Partial"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {activity.status}
                        </Badge>
                        <CardDescription>
                          {activity.confidence}% confidence
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[350px] text-center">
                <Activity className="h-16 w-16 text-blue-300 mb-4" />
                <h3 className="text-lg font-semibold text-blue-900 mb-2">No Recent Activity</h3>
                <p className="text-sm text-blue-600 max-w-md">
                  Your recent email searches will appear here. Start finding emails to see your activity.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {!hasSearchHistory && (
        <Card className="border-blue-100 bg-blue-50">
          <CardContent className="flex items-center p-6">
            <Info className="h-8 w-8 text-blue-500 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-1">Get Started with Email Discovery</h3>
              <p className="text-sm text-blue-700">
                Welcome to your dashboard! To begin, use our email finder tool to search for professional email addresses. 
                Your search history and results will be displayed here, providing insights into your email discovery process.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

