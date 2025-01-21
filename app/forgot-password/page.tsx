'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md overflow-hidden">
        <CardContent className="p-6">
          <Link 
            href="/auth" 
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Link>

          <h1 className="text-2xl font-semibold text-center mb-2">
            Forgot Password
          </h1>
          <p className="text-gray-500 text-center mb-6">
            No worries, we&apos;ll send you reset instructions
          </p>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Reset Password
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-green-600 font-medium">
                Check your email
              </div>
              <p className="text-gray-500">
                We have sent a password reset link to <br />
                <span className="font-medium text-gray-700">{email}</span>
              </p>
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="w-full"
              >
                Back to Reset Password
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}