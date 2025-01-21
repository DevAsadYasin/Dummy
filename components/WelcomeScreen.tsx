import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Mail, TrendingUp, Search, Zap, Users, Globe, Shield } from 'lucide-react'

export function WelcomeScreen() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-gradient-to-b from-gray-100 to-white overflow-hidden">
      <div className="container mx-auto px-4 py-6 flex-grow flex flex-col">
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-2 md:mb-4">Welcome to Exact Mails</h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">Discover accurate email addresses with ease and supercharge your outreach campaigns</p>
        </div>

        <div className="grid gap-2 md:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mb-4 flex-grow overflow-y-auto">
          <Card className="bg-blue-50 border-blue-200 shadow hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-col items-center p-4">
              <Search className="h-10 w-10 md:h-12 md:w-12 lg:h-16 lg:w-16 text-blue-500 mb-2 md:mb-4" />
              <CardTitle className="text-lg md:text-xl font-semibold text-center text-blue-700">Fast Search</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <CardDescription className="text-center text-blue-600 text-sm md:text-base">Find emails in seconds with our lightning-fast search engine</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200 shadow hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-col items-center p-4">
              <TrendingUp className="h-10 w-10 md:h-12 md:w-12 lg:h-16 lg:w-16 text-green-500 mb-2 md:mb-4" />
              <CardTitle className="text-lg md:text-xl font-semibold text-center text-green-700">High Accuracy</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <CardDescription className="text-center text-green-600 text-sm md:text-base">Enjoy 95%+ verified emails for your outreach campaigns</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50 border-yellow-200 shadow hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-col items-center p-4">
              <Mail className="h-10 w-10 md:h-12 md:w-12 lg:h-16 lg:w-16 text-yellow-500 mb-2 md:mb-4" />
              <CardTitle className="text-lg md:text-xl font-semibold text-center text-yellow-700">Bulk Search</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <CardDescription className="text-center text-yellow-600 text-sm md:text-base">Search multiple emails at once, saving you time and effort</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-200 shadow hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-col items-center p-4">
              <Zap className="h-10 w-10 md:h-12 md:w-12 lg:h-16 lg:w-16 text-purple-500 mb-2 md:mb-4" />
              <CardTitle className="text-lg md:text-xl font-semibold text-center text-purple-700">API Access</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <CardDescription className="text-center text-purple-600 text-sm md:text-base">Integrate our powerful email discovery tools with your existing workflow</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-200 shadow hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-col items-center p-4">
              <Shield className="h-10 w-10 md:h-12 md:w-12 lg:h-16 lg:w-16 text-red-500 mb-2 md:mb-4" />
              <CardTitle className="text-lg md:text-xl font-semibold text-center text-red-700">Data Protection</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <CardDescription className="text-center text-red-600 text-sm md:text-base">Your searches and data are always protected with enterprise-grade security</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-indigo-50 border-indigo-200 shadow hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-col items-center p-4">
              <Globe className="h-10 w-10 md:h-12 md:w-12 lg:h-16 lg:w-16 text-indigo-500 mb-2 md:mb-4" />
              <CardTitle className="text-lg md:text-xl font-semibold text-center text-indigo-700">Global Coverage</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <CardDescription className="text-center text-indigo-600 text-sm md:text-base">Find email addresses from companies and individuals worldwide</CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="bg-black text-white rounded-lg p-6 md:p-8 lg:p-10 shadow-2xl">
          <div className="md:flex md:items-center md:justify-between">
            <div className="mb-6 md:mb-0 md:w-2/3">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Ready to supercharge your email discovery?</h2>
              <p className="text-base md:text-lg lg:text-xl opacity-90">Join thousands of professionals who trust Exact Mails for their email search needs.</p>
            </div>
            <div className="flex flex-col space-y-4 md:w-1/3 md:flex-row md:space-y-0 md:space-x-4 justify-end">
              <Link href="/auth?mode=signup" className="w-full md:w-auto">
                <Button size="lg" className="w-full md:w-auto bg-white text-black hover:bg-gray-200 transition-colors duration-300 text-base md:text-lg font-semibold py-2 md:py-3 lg:py-4">
                  Sign Up
                </Button>
              </Link>
              <Link href="/auth?mode=login" className="w-full md:w-auto">
                <Button size="lg" className="w-full md:w-auto border-2 border-white text-white hover:bg-white hover:text-black transition-colors duration-300 text-base md:text-lg font-semibold py-2 md:py-3 lg:py-4">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

