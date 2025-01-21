'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Search, Building2, Briefcase, Chrome } from 'lucide-react'

// Dummy function to simulate file upload and processing
const simulateFileUpload = (file: File, type: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        processedRows: 1000,
        verifiedEmails: 800,
        partiallyVerified: 150,
        notFound: 50
      })
    }, 3000) // Simulate 3 seconds processing time
  })
}

export default function BulkUpload() {
  const [uploadType, setUploadType] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file || !uploadType) return

    setIsUploading(true)
    try {
      const result = await simulateFileUpload(file, uploadType)
      setResults(result)
    } catch (error) {
      console.error('Upload failed:', error)
    }
    setIsUploading(false)
  }

  const uploadOptions = [
    { 
      title: "Bulk Email Finder by Name",
      description: "Upload a list with contact names and companies or domains.",
      icon: Search,
      type: "name"
    },
    {
      title: "Bulk Email Finder by Domain",
      description: "Upload a list of domains for which you want to find emails.",
      icon: Building2,
      type: "domain"
    },
    {
      title: "Bulk Email Finder by Company Name",
      description: "Upload a list with company names.",
      icon: Building2,
      type: "company"
    },
    {
      title: "Bulk Email Finder by Decision Maker",
      description: "Upload a list that includes job titles and companies or domains.",
      icon: Briefcase,
      type: "decision-maker"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-8rem)]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Bulk Email Finder</h1>
        <p className="text-xl text-gray-600">Get Results in Minutes</p>
        <p className="text-lg text-gray-500 mt-2">
          On average, our service processes 1,000 rows in just 5 minutes, ensuring your lists are ready quickly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {uploadOptions.map((option) => (
          <Card key={option.type} className="border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
              <CardTitle className="flex items-center text-blue-600">
                <option.icon className="w-6 h-6 mr-2" />
                {option.title}
              </CardTitle>
              <CardDescription>{option.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Input
                type="file"
                onChange={handleFileChange}
                accept=".csv,.xlsx"
                className="mb-4"
              />
              <Button
                onClick={() => {
                  setUploadType(option.type)
                  handleUpload()
                }}
                disabled={!file || isUploading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isUploading ? 'Processing...' : 'Upload and Process'}
              </Button>
            </CardContent>
            {results && uploadType === option.type && (
              <CardFooter className="bg-blue-50 border-t border-blue-100">
                <div className="w-full text-sm text-blue-800">
                  <p>Processed Rows: {results.processedRows}</p>
                  <p>Verified Emails: {results.verifiedEmails}</p>
                  <p>Partially Verified: {results.partiallyVerified}</p>
                  <p>Not Found: {results.notFound}</p>
                </div>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">
          &quot;Finding business emails has never been easier&quot;
        </h2>
        <p className="text-lg text-gray-600">
          Whether you have a few thousand or up to 100,000 rows, our efficient system ensures minimal waiting time. 
          Enjoy fast, reliable email enrichment and keep your projects on track without delays.
        </p>
      </div>
    </div>
  )
}