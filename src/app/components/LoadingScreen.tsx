"use client";

import React from "react";

interface LoadingScreenProps {
  progress: number;
}

export default function LoadingScreen({ progress }: LoadingScreenProps) {
  return (
    <div 
      id="loading-screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white font-sans transition-opacity duration-500"
    >
      <div className="flex flex-col items-center max-w-xs w-full px-6">
        {/* Animated Minimalist Spinner */}
        <div className="w-12 h-12 border-4 border-t-white border-white/20 rounded-full animate-spin mb-4" />
        
        {/* Loading Progress Text */}
        <h2 className="text-xl font-medium tracking-wide mb-2 text-center">
          Loading Experience
        </h2>
        
        {/* Live Percentage Count */}
        <span className="text-3xl font-bold text-gray-300 tabular-nums">
          {progress}%
        </span>

        {/* Visual Progress Bar */}
        <div className="w-full h-[2px] bg-white/10 mt-4 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-150 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
