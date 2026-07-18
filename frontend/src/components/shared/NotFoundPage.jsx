import * as React from "react"
import { Link } from "react-router-dom"
import { Compass } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <div className="flex-1 bg-bg flex items-center justify-center px-4 py-32">
      <div className="max-w-md w-full text-center animate-slide-up">
        <div className="h-20 w-20 bg-secondary/10 text-secondary border border-secondary/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-bronze">
          <Compass className="h-10 w-10 animate-spin" style={{ animationDuration: '8s' }} />
        </div>
        
        <h1 className="text-6xl font-extrabold text-text-primary tracking-tight mb-2">404</h1>
        <h2 className="text-xl font-semibold text-text-primary mb-4">الصفحة غير موجودة</h2>
        <p className="text-text-secondary text-sm mb-8 max-w-sm mx-auto leading-relaxed">
          الصفحة التي تبحث عنها قد تم نقلها أو أنها غير موجودة. دعنا نساعدك في العودة لمتجرنا.
        </p>
        
        <Button variant="secondary" asChild>
          <Link to="/">العودة للرئيسية</Link>
        </Button>
      </div>
    </div>
  )
}
