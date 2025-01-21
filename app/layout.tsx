import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "../styles/globals.css"
import DashboardLayout from "@/components/ScreenLayout"
import { AuthProvider } from "../contexts/AuthContext"
import { IntercomProvider } from "@/components/IntercomProvider"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Exact Mails",
  description: "Find and verify emails with ease",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "64x64" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
    shortcut: { url: "/favicon.ico" },
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only">
          Skip to content
        </a>
        <AuthProvider>
          <DashboardLayout>
            <main id="main-content">{children}</main>
          </DashboardLayout>
          <IntercomProvider />
        </AuthProvider>
      </body>
    </html>
  )
}

