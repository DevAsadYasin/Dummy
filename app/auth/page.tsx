"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import AuthSlider from "@/components/AuthSlider"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function AuthPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setIsRedirecting(true)
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <LoadingSpinner />
      </div>
    )
  }

  return <AuthSlider />
}

