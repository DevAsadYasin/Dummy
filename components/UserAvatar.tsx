import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { User } from 'lucide-react'

interface UserAvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
}

export function UserAvatar({ src, alt, fallback }: UserAvatarProps) {
  return (
    <Avatar>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>
        {fallback ? fallback : <User className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  );
}

