import { AlertCircle, X } from "lucide-react"

export function KeyAlert({ showAlert, error, dismissAlert }: { showAlert: boolean, error: string | null, dismissAlert: () => void }) {
    return (
        <>
            {/* Error Alert */}
            {showAlert && error && (
                <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-red-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-lg border border-red-400/50 transition-all duration-300 ease-in-out animate-in slide-in-from-right-full">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                    <button
                        onClick={dismissAlert}
                        className="ml-2 hover:bg-red-600/50 rounded-full p-1 transition-colors"
                        aria-label="Dismiss error"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </div>
            )}
        </>
    )
}