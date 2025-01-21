"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import type { SubscriptionPlanDetails } from "@/types/subscription"
import { Button } from "@/components/ui/button"

interface CheckoutFormProps {
  plan: SubscriptionPlanDetails
  onSuccess: () => void
  isNewUser: boolean | undefined
  isUpgrade: boolean | undefined
  returnUrl: string
}

export default function CheckoutForm({ plan, onSuccess, isNewUser, isUpgrade, returnUrl }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string>("card")

  useEffect(() => {
    if (stripe) {
      const paymentRequest = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Subscription",
          amount: plan.price * 100,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      })

      paymentRequest.canMakePayment().then((result) => {
        if (result) {
          setPaymentMethod("wallet")
        }
      })
    }
  }, [stripe, plan.price])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!stripe || !elements) {
      setError("Stripe hasn't loaded yet. Please try again.")
      setIsLoading(false)
      return
    }

    const result = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
    })

    if (result.error) {
      setError(result.error.message || "An error occurred during checkout.")
      setIsLoading(false)
    } else {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-br from-[rgb(79,127,255)]/10 to-[rgb(79,127,255)]/5 p-6 rounded-lg shadow-sm">
        <PaymentElement
          options={{
            paymentMethodOrder: ["card", "paypal", "google_pay", "apple_pay"],
          }}
        />
      </div>
      {error && (
        <div className="text-red-500 bg-gradient-to-br from-red-50 to-red-100/80 p-3 rounded-lg border border-red-200 shadow-sm">
          {error}
        </div>
      )}
      <Button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-[rgb(29,78,216)] hover:bg-[rgb(59,130,246)] text-white transition-colors"
      >
        {isLoading ? "Processing..." : "Process Subscription"}
      </Button>
    </form>
  )
}

