"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { EmailVerificationService, type EmailVerificationResponse } from "@/services/emailVerification.service"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Mail, AlertCircle, Server, Download, Zap, Loader2, LogIn } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/AuthContext"

export default function EmailVerificationPage() {
  const [email, setEmail] = useState("")
  const [result, setResult] = useState<EmailVerificationResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { credits, fetchCredits, isAuthenticated } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)
    try {
      const response = await EmailVerificationService.verifyEmail(email)
      setResult(response)
      await fetchCredits()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while verifying the email."
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const ResultItem = ({
    label,
    value,
    icon,
    percentage,
  }: { label: string; value: boolean; icon: React.ReactNode; percentage?: number }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-full ${value ? "bg-green-100" : "bg-red-100"}`}>{icon}</div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      {percentage !== undefined ? (
        <span className={`text-sm font-semibold ${value ? "text-green-600" : "text-red-600"}`}>{percentage}%</span>
      ) : (
        <span className={`text-sm font-semibold ${value ? "text-green-600" : "text-red-600"}`}>
          {value ? "Yes" : "No"}
        </span>
      )}
    </div>
  )

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <LogIn className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-4">
              You are not logged in. Please sign in to use this functionality.
            </p>
            <Button onClick={() => router.push("/auth")} className="bg-blue-600 hover:bg-blue-700">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Email Verification</h1>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Verify an Email Address</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                    Verify Email
                  </Button>
                </div>
              </form>

              {!result && (
                <div className="mt-8 text-center py-12">
                  {isLoading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">Verifying email...</h3>
                      <p className="text-sm text-gray-500">This may take a few moments</p>
                    </div>
                  ) : (
                    <>
                      <Download className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No verification result to show yet</h3>
                      <p className="text-sm text-gray-500">Your email verification results will display here</p>
                    </>
                  )}
                </div>
              )}

              {result && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Verification Score</h3>
                      <p className="text-sm text-gray-500">{result.message}</p>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{result.score.toFixed(0)}/100</div>
                  </div>

                  <Progress
                    value={result.score}
                    className="h-2 mb-6"
                    color={
                      result.score > 80
                        ? "bg-green-500"
                        : result.score > 60
                          ? "bg-orange-500"
                          : result.score > 40
                            ? "bg-yellow-500"
                            : "bg-red-500"
                    }
                  />

                  <div className="grid gap-3">
                    <ResultItem
                      label="Email Verified"
                      value={result.is_verified}
                      icon={<Shield className="w-4 h-4 text-green-600" />}
                    />
                    <ResultItem
                      label="Valid Format"
                      value={result.is_valid_format}
                      icon={<Mail className="w-4 h-4 text-blue-600" />}
                    />
                    <ResultItem
                      label="Free Email Service"
                      value={result.is_free_email}
                      icon={<Mail className="w-4 h-4 text-blue-600" />}
                    />
                    <ResultItem
                      label="Disposable Email"
                      value={result.is_disposable_email}
                      icon={<AlertCircle className="w-4 h-4 text-orange-600" />}
                    />
                    <ResultItem
                      label="Role-based Email"
                      value={result.is_role_email}
                      icon={<Mail className="w-4 h-4 text-blue-600" />}
                    />
                    <ResultItem
                      label="Catch-all Domain"
                      value={result.is_catchall_email}
                      icon={<Mail className="w-4 h-4 text-blue-600" />}
                    />
                    <ResultItem
                      label="MX Records Found"
                      value={result.is_mx_found}
                      icon={<Server className="w-4 h-4 text-purple-600" />}
                    />
                    <ResultItem
                      label="SMTP Server Valid"
                      value={result.is_smtp_valid}
                      icon={<Server className="w-4 h-4 text-purple-600" />}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

