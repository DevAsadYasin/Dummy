import type React from "react"
import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Key, BookOpen, Search, Linkedin, Users, Building2 } from "lucide-react"
import dynamic from "next/dynamic"

const CodeBlock = dynamic(() => import("@/components/CodeBlock"), { ssr: false })

interface EndpointCardProps {
  icon: React.ReactNode
  title: string
  endpoint: string
  requestBody: string
  responseExample: string
}

const EndpointCard = ({ icon, title, endpoint, requestBody, responseExample }: EndpointCardProps) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-4">
      {icon}
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="p-4 bg-gray-100 rounded-lg border border-gray-200 mb-4">
      <p className="text-gray-600 font-semibold">Endpoint:</p>
      <p className="text-gray-700 font-mono">{endpoint}</p>
    </div>
    <div className="p-4 bg-gray-100 rounded-lg border border-gray-200 mb-4">
      <p className="text-gray-600 font-semibold">Request Body:</p>
      <Suspense fallback={<div>Loading...</div>}>
        <CodeBlock language="json" code={requestBody} />
      </Suspense>
    </div>
    <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
      <p className="text-gray-600 font-semibold">Response Example:</p>
      <Suspense fallback={<div>Loading...</div>}>
        <CodeBlock language="json" code={responseExample} />
      </Suspense>
    </div>
  </div>
)

export default function APIDocumentation() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">API Documentation</h1>
          <p className="text-gray-600 text-lg">
            Integrate our powerful email finding capabilities into your applications.
          </p>
        </div>

        {/* Overview Section */}
        <section className="mb-16" aria-labelledby="overview-title">
          <Card className="bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-blue-500" aria-hidden="true" />
                <h2 id="overview-title" className="text-2xl font-semibold text-gray-800">
                  Overview
                </h2>
              </div>
              <p className="text-gray-600 text-lg">
                Our RESTful API provides programmatic access to our email finding capabilities. With just a few API
                calls, you can search for individual emails, find emails associated with LinkedIn profiles, locate
                decision-makers, and retrieve company-wide email lists.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Authentication Section */}
        <section className="mb-16" aria-labelledby="auth-title">
          <Card className="bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Key className="w-6 h-6 text-green-500" aria-hidden="true" />
                <h2 id="auth-title" className="text-2xl font-semibold text-gray-800">
                  Authentication
                </h2>
              </div>
              <div className="p-4 bg-gray-100 rounded-lg border border-gray-200 mb-4">
                <p className="text-gray-700 text-lg mb-4">We use Basic Authentication for API access:</p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" aria-hidden="true"></span>
                    Username: Your account email address
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" aria-hidden="true"></span>
                    Password: Your API key
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16" aria-labelledby="endpoints-title">
          <Card className="bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Search className="w-6 h-6 text-purple-500" aria-hidden="true" />
                <h2 id="endpoints-title" className="text-2xl font-semibold text-gray-800">
                  Endpoints
                </h2>
              </div>
              <Tabs defaultValue="person" className="w-full">
                <TabsList className="w-full grid grid-cols-2 lg:grid-cols-4 bg-gray-100 p-1 rounded-lg">
                  <TabsTrigger value="person">Person</TabsTrigger>
                  <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                  <TabsTrigger value="decision">Decision Maker</TabsTrigger>
                  <TabsTrigger value="company">Company</TabsTrigger>
                </TabsList>
                <div className="mt-6">
                  <TabsContent value="person">
                    <EndpointCard
                      icon={<Search className="w-5 h-5 text-blue-500" />}
                      title="Find Person Email"
                      endpoint="POST /api/v1/email/find-person-email"
                      requestBody={`{
                                      "username": "string",
                                      "domain": "string (optional)"
                                    }`}
                                                          responseExample={`{
                                      "message": "Emails found successfully.",
                                      "status": 201,
                                      "name": "John Doe",
                                      "company": "example.com",
                                      "search_history_id": 11,
                                      "emails": {
                                        "email": "john.doe@example.com",
                                        "status": "safe",
                                        "success_rate": 98.0,
                                        "is_safe_to_send": true,
                                        "is_valid_syntax": true,
                                        "can_connect_smtp": true
                                      }
                                    }`}
                                                        />
                                                        <div className="mt-8">
                                                          <h4 className="text-xl font-semibold text-gray-800 mb-4">Integration Examples</h4>
                                                          <Tabs defaultValue="python" className="w-full">
                                                            <TabsList className="w-full grid grid-cols-2 lg:grid-cols-4 bg-gray-100 p-1 rounded-lg">
                                                              <TabsTrigger value="python">Python</TabsTrigger>
                                                              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                                                              <TabsTrigger value="ruby">Ruby</TabsTrigger>
                                                              <TabsTrigger value="curl">cURL</TabsTrigger>
                                                            </TabsList>
                                                            <div className="mt-4">
                                                              <TabsContent value="python">
                                                                <CodeBlock language="python" code={`import requests

                                    url = "https://api.example.com/api/v1/email/find-person-email"
                                    payload = {
                                        "username": "john.doe",
                                        "domain": "example.com"
                                    }
                                    headers = {
                                        "Authorization": "Basic YOUR_API_KEY"
                                    }

                                    response = requests.post(url, json=payload, headers=headers)
                                    print(response.json())`} />
                                                              </TabsContent>
                                                              <TabsContent value="javascript">
                                                                <CodeBlock language="javascript" code={`fetch('https://api.example.com/api/v1/email/find-person-email', {
                                        method: 'POST',
                                        headers: {
                                            'Authorization': 'Basic YOUR_API_KEY',
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            username: 'john.doe',
                                            domain: 'example.com'
                                        })
                                    })
                                    .then(response => response.json())
                                    .then(data => console.log(data));`} />
                                                              </TabsContent>
                                                              <TabsContent value="ruby">
                                                                <CodeBlock language="ruby" code={`require 'net/http'
                                    require 'json'

                                    uri = URI('https://api.example.com/api/v1/email/find-person-email')
                                    request = Net::HTTP::Post.new(uri)
                                    request['Authorization'] = 'Basic YOUR_API_KEY'
                                    request['Content-Type'] = 'application/json'
                                    request.body = {
                                        username: 'john.doe',
                                        domain: 'example.com'
                                    }.to_json

                                    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
                                        http.request(request)
                                    end

                                    puts response.body`} />
                                                              </TabsContent>
                                                              <TabsContent value="curl">
                                                                <CodeBlock language="bash" code={`curl -X POST https://api.example.com/api/v1/email/find-person-email \\
                                    -H "Authorization: Basic YOUR_API_KEY" \\
                                    -H "Content-Type: application/json" \\
                                    -d '{
                                        "username": "john.doe",
                                        "domain": "example.com"
                                    }'`} />
                                                              </TabsContent>
                                                            </div>
                                                          </Tabs>
                                                        </div>
                                                      </TabsContent>
                                                      <TabsContent value="linkedin">
                                                        <EndpointCard
                                                          icon={<Linkedin className="w-5 h-5 text-blue-500" />}
                                                          title="Find LinkedIn Email"
                                                          endpoint="POST /api/v1/email/find-linkedin-email"
                                                          requestBody={`{
                                      "linkedin_profile_url": "string"
                                    }`}
                                                          responseExample={`{
                                      "message": "Result Found Successfully",
                                      "status": 200,
                                      "name": "Jane Smith",
                                      "company": "dummycorp.com",
                                      "linkedin_url": "https://www.linkedin.com/in/janesmith/",
                                      "search_history_id": 12,
                                      "emails": {
                                        "email": "jane.smith@dummycorp.com",
                                        "status": "safe",
                                        "success_rate": 98.0,
                                        "is_safe_to_send": true,
                                        "is_valid_syntax": true,
                                        "can_connect_smtp": true
                                      }
                                    }`}
                                                        />
                                                        <div className="mt-8">
                                                          <h4 className="text-xl font-semibold text-gray-800 mb-4">Integration Examples</h4>
                                                          <Tabs defaultValue="python" className="w-full">
                                                            <TabsList className="w-full grid grid-cols-2 lg:grid-cols-4 bg-gray-100 p-1 rounded-lg">
                                                              <TabsTrigger value="python">Python</TabsTrigger>
                                                              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                                                              <TabsTrigger value="ruby">Ruby</TabsTrigger>
                                                              <TabsTrigger value="curl">cURL</TabsTrigger>
                                                            </TabsList>
                                                            <div className="mt-4">
                                                              <TabsContent value="python">
                                                                <CodeBlock language="python" code={`import requests

                                    url = "https://api.example.com/api/v1/email/find-linkedin-email"
                                    payload = {
                                        "linkedin_profile_url": "https://www.linkedin.com/in/janesmith/"
                                    }
                                    headers = {
                                        "Authorization": "Basic YOUR_API_KEY"
                                    }

                                    response = requests.post(url, json=payload, headers=headers)
                                    print(response.json())`} />
                                                              </TabsContent>
                                                              <TabsContent value="javascript">
                                                                <CodeBlock language="javascript" code={`fetch('https://api.example.com/api/v1/email/find-linkedin-email', {
                                        method: 'POST',
                                        headers: {
                                            'Authorization': 'Basic YOUR_API_KEY',
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            linkedin_profile_url: 'https://www.linkedin.com/in/janesmith/'
                                        })
                                    })
                                    .then(response => response.json())
                                    .then(data => console.log(data));`} />
                                                              </TabsContent>
                                                              <TabsContent value="ruby">
                                                                <CodeBlock language="ruby" code={`require 'net/http'
                                    require 'json'

                                    uri = URI('https://api.example.com/api/v1/email/find-linkedin-email')
                                    request = Net::HTTP::Post.new(uri)
                                    request['Authorization'] = 'Basic YOUR_API_KEY'
                                    request['Content-Type'] = 'application/json'
                                    request.body = {
                                        linkedin_profile_url: 'https://www.linkedin.com/in/janesmith/'
                                    }.to_json

                                    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
                                        http.request(request)
                                    end

                                    puts response.body`} />
                                                              </TabsContent>
                                                              <TabsContent value="curl">
                                                                <CodeBlock language="bash" code={`curl -X POST https://api.example.com/api/v1/email/find-linkedin-email \\
                                    -H "Authorization: Basic YOUR_API_KEY" \\
                                    -H "Content-Type: application/json" \\
                                    -d '{
                                        "linkedin_profile_url": "https://www.linkedin.com/in/janesmith/"
                                    }'`} />
                                                              </TabsContent>
                                                            </div>
                                                          </Tabs>
                                                        </div>
                                                      </TabsContent>
                                                      <TabsContent value="decision">
                                                        <EndpointCard
                                                          icon={<Users className="w-5 h-5 text-blue-500" />}
                                                          title="Find Decision Maker Email"
                                                          endpoint="POST /api/v1/email/find-decision-maker-email"
                                                          requestBody={`{
                                      "company_domain": "string",
                                      "role": "string (optional)"
                                    }`}
                                                          responseExample={`{
                                      "message": "Decision maker and email found successfully.",
                                      "status": 200,
                                      "name": "Alice Johnson",
                                      "company": "dummycorp.com",
                                      "linkedin_url": "https://linkedin.com/in/alicejohnson",
                                      "position": "VP of Sales",
                                      "search_history_id": 13,
                                      "emails": {
                                        "email": "alice.johnson@dummycorp.com",
                                        "status": "safe",
                                        "success_rate": 98.0,
                                        "is_safe_to_send": true,
                                        "is_valid_syntax": true,
                                        "can_connect_smtp": true
                                      }
                                    }`}
                                                        />
                                                        <div className="mt-8">
                                                          <h4 className="text-xl font-semibold text-gray-800 mb-4">Integration Examples</h4>
                                                          <Tabs defaultValue="python" className="w-full">
                                                            <TabsList className="w-full grid grid-cols-2 lg:grid-cols-4 bg-gray-100 p-1 rounded-lg">
                                                              <TabsTrigger value="python">Python</TabsTrigger>
                                                              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                                                              <TabsTrigger value="ruby">Ruby</TabsTrigger>
                                                              <TabsTrigger value="curl">cURL</TabsTrigger>
                                                            </TabsList>
                                                            <div className="mt-4">
                                                              <TabsContent value="python">
                                                                <CodeBlock language="python" code={`import requests

                                    url = "https://api.example.com/api/v1/email/find-decision-maker-email"
                                    payload = {
                                        "company_domain": "dummycorp.com",
                                        "role": "VP of Sales"
                                    }
                                    headers = {
                                        "Authorization": "Basic YOUR_API_KEY"
                                    }

                                    response = requests.post(url, json=payload, headers=headers)
                                    print(response.json())`} />
                                                              </TabsContent>
                                                              <TabsContent value="javascript">
                                                                <CodeBlock language="javascript" code={`fetch('https://api.example.com/api/v1/email/find-decision-maker-email', {
                                        method: 'POST',
                                        headers: {
                                            'Authorization': 'Basic YOUR_API_KEY',
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            company_domain: 'dummycorp.com',
                                            role: 'VP of Sales'
                                        })
                                    })
                                    .then(response => response.json())
                                    .then(data => console.log(data));`} />
                                                              </TabsContent>
                                                              <TabsContent value="ruby">
                                                                <CodeBlock language="ruby" code={`require 'net/http'
                                    require 'json'

                                    uri = URI('https://api.example.com/api/v1/email/find-decision-maker-email')
                                    request = Net::HTTP::Post.new(uri)
                                    request['Authorization'] = 'Basic YOUR_API_KEY'
                                    request['Content-Type'] = 'application/json'
                                    request.body = {
                                        company_domain: 'dummycorp.com',
                                        role: 'VP of Sales'
                                    }.to_json

                                    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
                                        http.request(request)
                                    end

                                    puts response.body`} />
                                                              </TabsContent>
                                                              <TabsContent value="curl">
                                                                <CodeBlock language="bash" code={`curl -X POST https://api.example.com/api/v1/email/find-decision-maker-email \\
                                    -H "Authorization: Basic YOUR_API_KEY" \\
                                    -H "Content-Type: application/json" \\
                                    -d '{
                                        "company_domain": "dummycorp.com",
                                        "role": "VP of Sales"
                                    }'`} />
                                                              </TabsContent>
                                                            </div>
                                                          </Tabs>
                                                        </div>
                                                      </TabsContent>
                                                      <TabsContent value="company">
                                                        <EndpointCard
                                                          icon={<Building2 className="w-5 h-5 text-blue-500" />}
                                                          title="Find Company Emails"
                                                          endpoint="POST /api/v1/email/find-company-emails"
                                                          requestBody={`{
                                      "company_domain": "string"
                                    }`}
                                                          responseExample={`{
                                      "message": "Verified emails found successfully.",
                                      "status": 200,
                                      "company": "dummycorp.com",
                                      "search_history_id": 14,
                                      "emails": [
                                        {
                                          "email": "john.doe@dummycorp.com",
                                          "status": "safe",
                                          "success_rate": 98.0,
                                          "is_safe_to_send": true,
                                          "is_valid_syntax": true,
                                          "can_connect_smtp": true
                                        },
                                        {
                                          "email": "jane.smith@dummycorp.com",
                                          "status": "safe",
                                          "success_rate": 98.0,
                                          "is_safe_to_send": true,
                                          "is_valid_syntax": true,
                                          "can_connect_smtp": true
                                        }
                                      ]
                                    }`}
                                                        />
                                                        <div className="mt-8">
                                                          <h4 className="text-xl font-semibold text-gray-800 mb-4">Integration Examples</h4>
                                                          <Tabs defaultValue="python" className="w-full">
                                                            <TabsList className="w-full grid grid-cols-2 lg:grid-cols-4 bg-gray-100 p-1 rounded-lg">
                                                              <TabsTrigger value="python">Python</TabsTrigger>
                                                              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                                                              <TabsTrigger value="ruby">Ruby</TabsTrigger>
                                                              <TabsTrigger value="curl">cURL</TabsTrigger>
                                                            </TabsList>
                                                            <div className="mt-4">
                                                              <TabsContent value="python">
                                                                <CodeBlock language="python" code={`import requests

                                    url = "https://api.example.com/api/v1/email/find-company-emails"
                                    payload = {
                                        "company_domain": "dummycorp.com"
                                    }
                                    headers = {
                                        "Authorization": "Basic YOUR_API_KEY"
                                    }

                                    response = requests.post(url, json=payload, headers=headers)
                                    print(response.json())`} />
                                                              </TabsContent>
                                                              <TabsContent value="javascript">
                                                                <CodeBlock language="javascript" code={`fetch('https://api.example.com/api/v1/email/find-company-emails', {
                                        method: 'POST',
                                        headers: {
                                            'Authorization': 'Basic YOUR_API_KEY',
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            company_domain: 'dummycorp.com'
                                        })
                                    })
                                    .then(response => response.json())
                                    .then(data => console.log(data));`} />
                                                              </TabsContent>
                                                              <TabsContent value="ruby">
                                                                <CodeBlock language="ruby" code={`require 'net/http'
                                    require 'json'

                                    uri = URI('https://api.example.com/api/v1/email/find-company-emails')
                                    request = Net::HTTP::Post.new(uri)
                                    request['Authorization'] = 'Basic YOUR_API_KEY'
                                    request['Content-Type'] = 'application/json'
                                    request.body = {
                                        company_domain: 'dummycorp.com'
                                    }.to_json

                                    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
                                        http.request(request)
                                    end

                                    puts response.body`} />
                                                              </TabsContent>
                                                              <TabsContent value="curl">
                                                                <CodeBlock language="bash" code={`curl -X POST https://api.example.com/api/v1/email/find-company-emails \\
                                    -H "Authorization: Basic YOUR_API_KEY" \\
                                    -H "Content-Type: application/json" \\
                                    -d '{
                                        "company_domain": "dummycorp.com"
                                    }'`} />
                          </TabsContent>
                        </div>
                      </Tabs>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

