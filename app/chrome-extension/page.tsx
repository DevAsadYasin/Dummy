'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Chrome, Timer, Bell } from 'lucide-react'

const RELEASE_DATE = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)

export default function ChromeExtensionPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = RELEASE_DATE.getTime() - now

      if (distance < 0) {
        clearInterval(timer)
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleNotifyMe = () => {
    console.log('Notification preference saved')
  }

  return (
    <div className="h-[calc(100vh-8rem)] bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-background p-6">
      <div className="container max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-6 mb-12">
          <div className="rounded-full bg-blue-100 dark:bg-purple-900/50 p-4">
            <Chrome className="w-12 h-12 text-blue-600 dark:text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Chrome Extension Coming Soon
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            We&apos;re working hard to bring you our powerful email finder directly to your browser. 
            Stay tuned for an enhanced experience with our Chrome extension.
          </p>
        </div>

        <Card className="bg-white/50 dark:bg-background/50 backdrop-blur border-purple-100 dark:border-purple-900">
          <CardHeader className="text-center">
            <CardTitle>Launch Countdown</CardTitle>
            <CardDescription>Mark your calendar for our Chrome extension release</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 p-4">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds }
              ].map(({ label, value }) => (
                <div 
                  key={label}
                  className="flex flex-col items-center p-4 bg-blue-600 rounded-lg text-white"
                >
                  <span className="text-3xl font-bold tabular-nums">
                    {String(value).padStart(2, '0')}
                  </span>
                  <span className="text-purple-100 text-sm">{label}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex flex-col items-center gap-4">
                <Badge variant="purple" className="text-sm">
                  Release Date: {RELEASE_DATE.toLocaleDateString()}
                </Badge>
                <Button
                  variant="purple"
                  className="gap-2"
                  onClick={handleNotifyMe}
                >
                  <Bell className="w-4 h-4" />
                  Notify me when it&apos;s ready
                </Button>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mt-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  What to expect
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Quick email finder directly in your browser</li>
                  <li>✓ Integration with popular websites</li>
                  <li>✓ One-click email verification</li>
                  <li>✓ Seamless synchronization with your account</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}