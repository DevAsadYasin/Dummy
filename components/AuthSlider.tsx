'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import * as authService from '@/services/auth.service'
import { User } from 'lucide-react'
import { Input } from "@/components/ui/input"

export default function AuthSlider() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(name, email, password)
        setSuccessMessage('Your account has been created successfully! Please check your email to verify your account and continue.')
        setIsLogin(true)
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("Email already registered")) {
          setError("This email is already registered. Please use a different email or try logging in.");
        } else if (err.message.includes("Username already taken")) {
          setError("This username is already taken. Please choose a different username.");
        } else {
          setError(err.message || 'Authentication failed. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }

    setIsLoading(false)
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      await authService.initiateGoogleSignIn()
    } catch (error) {
      console.error('Error initiating Google Sign-In:', error)
      setError('Failed to initiate Google Sign-In. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex items-center justify-center bg-gradient-to-b from-gray-100 to-white p-4">
      <Card className="w-full max-w-md bg-white shadow-xl border-0">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col items-center mb-6">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Colorful avatar" />
              <AvatarFallback>
                <User className="h-12 w-12 text-gray-400" />
              </AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold text-black mb-2">
              {isLogin ? 'Welcome Back!' : 'Create Your Account'}
            </h1>
            <p className="text-gray-600 text-center">
              {isLogin ? 'Great to see you again' : 'Start your journey with us'}
            </p>
          </div>
          
          <div className="bg-gray-100 p-1 rounded-lg mb-6">
            <div className="grid grid-cols-2 relative">
              <div
                className="absolute top-0 left-0 w-1/2 h-full bg-black rounded transition-all duration-300"
                style={{
                  transform: `translateX(${isLogin ? '0%' : '100%'})`
                }}
              />
              <button
                onClick={() => setIsLogin(true)}
                className={`px-4 py-2 text-sm font-medium rounded relative z-10 transition-colors duration-300 ${
                  isLogin ? 'text-white' : 'text-gray-700'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`px-4 py-2 text-sm font-medium rounded relative z-10 transition-colors duration-300 ${
                  !isLogin ? 'text-white' : 'text-gray-700'
                }`}
              >
                Signup
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full border-gray-300 hover:bg-gray-50 text-black transition-colors duration-300"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {isLoading ? 'Processing...' : 'Continue with Google'}
            </Button>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-sm">or continue with email</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{successMessage}</span>
              </div>
            )}

            {isLogin ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>
                <div className="text-right">
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button 
                  className="w-full bg-black hover:bg-gray-800 text-white transition-colors duration-300" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Login'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={3}
                  maxLength={50}
                  className="border-gray-300 focus:border-black focus:ring-black"
                />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-gray-300 focus:border-black focus:ring-black"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="border-gray-300 focus:border-black focus:ring-black"
                />
                <Button 
                  className="w-full bg-black hover:bg-gray-800 text-white transition-colors duration-300" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Signup'}
                </Button>
              </form>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

