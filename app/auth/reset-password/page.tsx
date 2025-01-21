'use client'

import { ResetPasswordForm } from '@/components/ResetPasswordForm'
import { useSearchParams } from 'next/navigation'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const resetToken = searchParams.get('token')

  if (!resetToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Invalid Reset Link</h2>
          <p className="mt-2 text-sm text-gray-600">
            The password reset link is invalid or has expired. Please request a new one.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ResetPasswordForm resetToken={resetToken} />
    </div>
  )
}

