import * as React from "react"
import { Flame } from "lucide-react"

export default function Loader({ fullPage = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Outer bronze spinner ring */}
        <div className="h-16 w-16 rounded-full border-4 border-secondary/20 border-t-secondary animate-spin"></div>
        {/* Inner static flame icon */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary">
          <Flame className="h-6 w-6 animate-pulse" />
        </div>
      </div>
      <p className="text-text-secondary text-sm font-medium animate-pulse tracking-wide uppercase">
        Loading Sharabia Collections...
      </p>
    </div>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 bg-bg/90 backdrop-blur-sm flex items-center justify-center min-h-screen">
        {content}
      </div>
    )
  }

  return (
    <div className="w-full py-20 flex items-center justify-center">
      {content}
    </div>
  )
}
