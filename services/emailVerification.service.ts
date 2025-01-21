import { authenticatedFetch } from "@/utils/api"

export interface EmailVerificationResponse {
  email: string
  is_verified: boolean
  is_valid_format: boolean
  is_free_email: boolean
  is_disposable_email: boolean
  is_role_email: boolean
  is_catchall_email: boolean
  is_mx_found: boolean
  is_smtp_valid: boolean
  score: number
  message: string
}

export const EmailVerificationService = {
  async verifyEmail(email: string): Promise<EmailVerificationResponse> {
    try {
      const response = await authenticatedFetch("/email/verify-email", {
        method: "POST",
        body: JSON.stringify({ email }),
      })
      return response
    } catch (error) {
      console.error("Error verifying email:", error)
      throw new Error("Failed to verify email. Please try again later.")
    }
  },

}

