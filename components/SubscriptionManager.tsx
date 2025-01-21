import React from "react"
import type { SubscriptionStatus, SubscriptionPlanDetails } from "@/types/subscription"
import { SubscriptionService } from "@/services/subscription.service"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, CreditCard, Zap } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import * as authService from "@/services/auth.service"

interface SubscriptionManagerProps {
  subscriptionStatus: SubscriptionStatus
  selectedPlan: SubscriptionPlanDetails | null
  onSubscriptionChange: () => void
}

export function SubscriptionManager({
  subscriptionStatus,
  selectedPlan,
  onSubscriptionChange,
}: SubscriptionManagerProps) {
  const router = useRouter()
  const { updateCredits } = useAuth()

  const handleAutoRenewToggle = async (enabled: boolean) => {
    try {
      await SubscriptionService.setAutoRenew(enabled)
      onSubscriptionChange()
    } catch (error) {
      console.error("Error toggling auto-renew:", error)
    }
  }

  const handleUpgrade = () => {
    router.push("/pricing")
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const hasActiveSubscription = !!subscriptionStatus.plan_id

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-indigo-600">Your Subscription</h2>
            <p className="text-indigo-500/70">Manage your plan and billing</p>
          </div>
          {hasActiveSubscription && (
            <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm">
              active
            </Badge>
          )}
        </div>

        {hasActiveSubscription ? (
          <>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6 mb-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <CreditCard className="h-6 w-6" />
                <div>
                  <p className="text-sm opacity-90">Current Plan</p>
                  <p className="text-2xl font-bold">{subscriptionStatus.plan_name || "N/A"}</p>
                </div>
              </div>
              <Button onClick={handleUpgrade} className="bg-white text-indigo-600 hover:bg-indigo-50">
                Update Subscription
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                <div className="flex items-center gap-4">
                  <CalendarDays className="h-6 w-6 text-indigo-600" />
                  <div>
                    <p className="text-sm text-indigo-600">Expiry Date</p>
                    <p className="text-lg font-medium text-indigo-700">{formatDate(subscriptionStatus.expiry_date)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                <div className="flex items-center gap-4">
                  <Zap className="h-6 w-6 text-indigo-600" />
                  <div>
                    <p className="text-sm text-indigo-600">Credits Remaining</p>
                    <p className="text-lg font-medium text-indigo-700">{subscriptionStatus.credits ?? "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 mb-6 border border-indigo-100">
              <div className="flex items-center justify-between">
                <span className="text-indigo-700">Auto-renew subscription</span>
                <Switch
                  checked={subscriptionStatus.auto_renew ?? false}
                  onCheckedChange={handleAutoRenewToggle}
                  className="data-[state=checked]:bg-indigo-600"
                />
              </div>
            </div>

            <p className="text-indigo-600 text-sm">Thank you for your subscription. We appreciate your business.</p>
          </>
        ) : (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold text-indigo-700 mb-4">You do not have any active subscription</h3>
            <p className="text-indigo-600 mb-6">Please subscribe and start a trial period to enjoy our services.</p>
            <Button onClick={handleUpgrade} className="bg-indigo-600 text-white hover:bg-indigo-700">
              Select Plan and Start Trial
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

