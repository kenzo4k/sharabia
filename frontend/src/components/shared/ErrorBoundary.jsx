import * as React from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an uncaught error:", error, errorInfo)
  }

  handleReload = () => {
    window.location.href = "/"
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full bg-surface border border-border-subtle p-8 rounded-lg text-center shadow-lg animate-fade-in">
            <div className="h-16 w-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-8 w-8" />
            </div>
            
            <h1 className="text-2xl font-bold text-text-primary mb-2">حدث خطأ غير متوقع</h1>
            <p className="text-text-secondary text-sm mb-6 leading-relaxed">
              واجهنا مشكلة أثناء تحميل هذه الصفحة. يرجى محاولة إعادة تحميل الصفحة أو العودة إلى الصفحة الرئيسية للمتجر.
            </p>
            
            <div className="flex flex-col space-y-3">
              <Button variant="secondary" onClick={this.handleReload}>
                العودة للرئيسية
              </Button>
              <Button 
                variant="outline" 
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                إعادة المحاولة
              </Button>
            </div>
            
            {process.env.NODE_ENV !== "production" && this.state.error && (
              <pre className="mt-6 p-4 bg-bg text-left text-xs text-red-400 overflow-x-auto rounded border border-border-subtle font-mono max-h-40">
                {this.state.error.toString()}
              </pre>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
