"use client"

import React, { useState, useCallback, memo } from "react"
import { Check, Copy } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface CodeBlockProps {
  language: string
  code: string
}

const CodeBlock = memo(({ language, code }: CodeBlockProps) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000) // Reset after 2 seconds
      })
      .catch((err) => console.error("Failed to copy:", err))
  }, [code])

  return (
    <div className="relative group">
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "1rem",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
        }}
      >
        {code}
      </SyntaxHighlighter>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 bg-gray-800 rounded-md text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
        aria-label={isCopied ? "Copied" : "Copy to Clipboard"}
      >
        {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  )
})

CodeBlock.displayName = "CodeBlock"

export default CodeBlock

