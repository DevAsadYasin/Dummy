'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LockIcon, InfoIcon, MessageSquare, Bug, Video } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"
import { useAuth } from '@/contexts/AuthContext'
import { BugReportService } from '@/services/bugReport.service'
import { useIntercom } from '@/hooks/use.intercom'
import Cal, { getCalApi } from "@calcom/embed-react"

export default function Support() {
  const [issueTitle, setIssueTitle] = useState('')
  const [issueDescription, setIssueDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()
  const { show } = useIntercom()

  // Initialize Cal.com embed
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "15min" });
      cal("ui", { hideEventTypeDetails: true, layout: "column_view" });
    })();
  }, []);

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit a bug report.",
        variant: "destructive",
      })
      return
    }
    setIsSubmitting(true)
    try {
      await BugReportService.submitBugReport({
        title: issueTitle,
        description: issueDescription,
      })
      toast({
        title: "Bug Report Submitted",
        description: "Thank you for your report. We&apos;ll look into it shortly.",
      })
      setIssueTitle('')
      setIssueDescription('')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit bug report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenIntercom = () => {
    show()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl min-h-[calc(100vh-10rem)] overflow-y-auto">
      <h1 className="text-3xl font-bold text-blue-900 mb-8">Support Center</h1>

      {!user && (
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="flex items-start space-x-4 p-6">
            <InfoIcon className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-blue-800 mb-2">Welcome to our Support Center</h2>
              <p className="text-blue-600">
                Once you&apos;re logged in, you&apos;ll have full access to our support services, including:
              </p>
              <ul className="list-disc list-inside mt-2 text-blue-600">
                <li>Personalized demo scheduling</li>
                <li>Ability to submit detailed bug reports</li>
                <li>Access to premium support channels</li>
              </ul>
              <p className="mt-2 text-blue-600">
                Please log in to make the most of our support resources and get the assistance you need.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Other Sections (Grid Layout Above) */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Report an Issue Section */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
            <div className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-blue-900">Report an Issue</CardTitle>
            </div>
            <CardDescription>
              Let us know if you&apos;ve encountered a problem
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {user ? (
              <form onSubmit={handleSubmitReport} className="space-y-4">
                <Input 
                  placeholder="Issue Title" 
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  required
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 transition-colors duration-200"
                />
                <Textarea 
                  placeholder="Describe the issue you&apos;re experiencing..." 
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  required
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 transition-colors duration-200 min-h-[120px]"
                />
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </Button>
              </form>
            ) : (
              <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <LockIcon className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Please log in to report an issue</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Chat Support Section */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-blue-900">Live Chat Support</CardTitle>
            </div>
            <CardDescription>
              Get immediate assistance from our support team
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-4">
              Our chat support is available 24/7. Click the button below to start a conversation with our support team.
            </p>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
              onClick={handleOpenIntercom}
            >
              Start Live Chat
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center gap-2">
            <Video className="h-6 w-6" />
            <CardTitle className="text-2xl">Schedule a Demo</CardTitle>
          </div>
          <CardDescription className="text-blue-100 text-lg mt-2">
            Book a personalized demo with our team
          </CardDescription>
        </CardHeader>
        <CardContent className=" bg-white">
          <Cal
            namespace="15min"
            calLink="asad-yasin-irpgc3/15min"
            style={{ width: "100%", height: "60vh", overflow: "scroll" }}
            config={{ layout: "column_view" }}
          />
        </CardContent>
      </Card>
    </div>
  )
}