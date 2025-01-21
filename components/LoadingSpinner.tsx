'use client'

import React, { useEffect, useState } from 'react'

const LoadingSpinner: React.FC = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-8rem)]">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#4169E1] to-[#6B8CFF] blur-md opacity-50 animate-pulse" />
        
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-[#4169E1]" />
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full h-20 w-20 border-t-4 border-b-4 border-[#6B8CFF] animate-[spin_1.5s_linear_infinite]" />
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="rounded-full h-10 w-10 border-t-4 border-b-4 border-[#4169E1] animate-[spin_2s_linear_infinite]" />
          </div>
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-gradient-to-r from-[#4169E1] to-[#6B8CFF] animate-pulse" />
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#4169E1] to-[#6B8CFF] bg-clip-text text-transparent">
          Loading{dots}
        </h2>
        <p className="mt-2 text-gray-600">Please wait while we process your request</p>
      </div>
    </div>
  )
}

export default LoadingSpinner

