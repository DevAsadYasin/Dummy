'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'

export default function VerifyEmail() {
  const searchParams = useSearchParams()
  // const { verifyEmail } = useAuth()

  // useEffect(() => {
  //   const token = searchParams.get('token')
  //   if (token) {
  //     verifyEmail(token).catch((error) => {
  //       console.error('Email verification failed:', error)
  //       alert('Email verification failed. Please try again or contact support.')
  //     })
  //   }
  // }, [searchParams, verifyEmail])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verifying your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please wait while we verify your email address.
          </p>
        </div>
      </div>
    </div>
  )
}

