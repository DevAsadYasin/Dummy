'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/UserAvatar"
import { LayoutDashboard, BookOpen, Mail, Upload, Settings, CreditCard, Key, HelpCircle, Chrome, LogOut, Zap, PieChart } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import Image from "next/image"

type NavItem = {
  name: string;
  icon: LucideIcon;
  href: string;
  onClick?: () => void;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentPath = usePathname()
  const { user, signOut, credits, fetchCredits, subscriptionStatus, fetchSubscriptionStatus } = useAuth()
  const router = useRouter()

  useEffect(() => {
    fetchCredits();
    fetchSubscriptionStatus();
  }, [fetchCredits, fetchSubscriptionStatus]);

  const handleLogout = async () => {
    router.push('/auth');
    await signOut()
  }

  const navItems: NavItem[] = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'Email Finder', icon: Mail, href: '/email-finder' },
    { name: 'Email Verifier', icon: Mail, href: '/email-verifier' },
    { name: 'Bulk Finder', icon: Upload, href: '/bulk-finder' },
    { name: 'Billing', icon: CreditCard, href: '/billing' },
    { name: 'Chrome Extension', icon: Chrome, href: '/chrome-extension' },
    { name: 'API Keys', icon: Key, href: '/api-keys' },
    { name: 'Documentation', icon: BookOpen, href: '/documentation' },
    { name: 'Settings', icon: Settings, href: '/settings' },
    { name: 'Support', icon: HelpCircle, href: '/support' },
  ];

  if (user) {
    navItems.push({ name: 'Logout', icon: LogOut, href: '#', onClick: handleLogout });
  }

  return (
    <div className="flex h-screen bg-white">
      <aside className="w-64 bg-gradient-to-b from-[#0A1A3C] to-[#4B2A76] text-white">
      <div className="p-6 border-b border-white/10">
      <Link href="/" className="flex items-center space-x-3">
        <Image src="/icon.svg" alt="Exact Mails Logo" width={48} height={48} className="rounded-lg" />
        <span className="text-2xl font-semibold">Exact Mails</span>
      </Link>
    </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              onClick={item.onClick ? (e) => {
                e.preventDefault();
                item.onClick!();
              } : undefined}
            >
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200",
                  currentPath === item.href && "bg-white/15 text-white"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center space-x-4">
            {user && credits ? (
              <>
                <div className="flex items-center space-x-2 bg-blue-50 text-[#4169E1] px-3 py-1.5 rounded-full">
                  <Zap className="h-4 w-4" />
                  <span className="font-medium">Credits: {credits.active}</span>
                </div>
                <div className="flex items-center space-x-2 bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full">
                  <PieChart className="h-4 w-4" />
                  <span className="font-medium">Usage: {credits.used}</span>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full">
                <Zap className="h-4 w-4" />
                <span className="font-medium">Credits: 0</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              subscriptionStatus?.has_subscription ? (
                <Link href="/pricing">
                  <Button 
                    className="bg-gradient-to-r from-[#4169E1] to-[#6B8CFF] text-white border-0 hover:opacity-90"
                  >
                    Upgrade Subscription
                  </Button>
                </Link>
              ) : (
                <Link href="/pricing">
                  <Button 
                    className="bg-gradient-to-r from-[#4169E1] to-[#6B8CFF] text-white border-0 hover:opacity-90"
                  >
                    Start Trial
                  </Button>
                </Link>
              )
            ) : (
              <Link href="/pricing">
                <Button 
                  className="bg-gradient-to-r from-[#4169E1] to-[#6B8CFF] text-white border-0 hover:opacity-90"
                >
                  View Plans
                </Button>
              </Link>
            )}
            {user ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-pointer">
                      <UserAvatar 
                        src={user.profile_picture} 
                        alt={user.username} 
                        fallback={user.username ? user.username.charAt(0).toUpperCase() : undefined} 
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{user.username}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Link href="/auth">
                <Button 
                  variant="outline" 
                  className="border-[#4169E1] text-[#4169E1] hover:bg-blue-50"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

