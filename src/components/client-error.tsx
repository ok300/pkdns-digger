import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ClientErrorProps {
  error: string;
  onRetry?: () => void;
}

export const ClientError = ({ error, onRetry }: ClientErrorProps) => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="text-center max-w-md">
      {/* Error Title with Icon */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <div className="text-gray-300 text-xl font-semibold">
          Pkarr Client Error
        </div>
      </div>
      
      {/* Error Message */}
      <div className="text-gray-400 text-sm leading-relaxed mb-6 px-4">
        {error}
      </div>
      
      {/* Action Block */}
      <div className="mt-8">
        {/* Retry Button */}
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size="default"
            className="bg-purple-500 text-white border-purple-500 hover:bg-muted hover:text-purple-500 hover:border-purple-500/30 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload
          </Button>
        )}
        
        {/* Helper Text */}
        <div className="text-gray-500 text-xs mt-6">
          If the problem persists, try refreshing the page
        </div>
      </div>
    </div>
  </div>
); 