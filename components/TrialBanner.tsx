import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

interface TrialBannerProps {
  expiryDate: string;
}

export default function TrialBanner({ expiryDate }: TrialBannerProps) {
  const daysLeft = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));

  return (
    <Alert variant="default" className="mb-6 border-[rgb(79,127,255)] bg-gradient-to-r from-[rgb(79,127,255)]/10 to-[rgb(79,127,255)]/5 shadow-md">
      <AlertCircle className="h-4 w-4 text-[rgb(29,78,216)]" />
      <AlertTitle className="text-[rgb(29,78,216)] font-semibold">Trial Period Active</AlertTitle>
      <AlertDescription className="text-[rgb(59,130,246)]">
        Your trial period will expire in {daysLeft} day{daysLeft !== 1 ? 's' : ''}. Upgrade now to continue enjoying our services!
      </AlertDescription>
    </Alert>
  );
}

