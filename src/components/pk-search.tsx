"use client"

import { useState, useRef, useEffect } from "react"
import { Search, AlertCircle, X, Globe } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export function PkSearch() {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAlert, setShowAlert] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Show alert when error occurs
  useEffect(() => {
    if (error) {
      setShowAlert(true)
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setShowAlert(false)
      }, 5000)
      return () => clearTimeout(timer)
    } else {
      setShowAlert(false)
    }
  }, [error])

  // Validate public key format (pkarr uses z-base-32)
  const validatePublicKey = (key: string): boolean => {
    // z-base-32 characters for pkarr public keys
    const zbase32Regex = /^[13456789abcdefghijkmnopqrstuwxyz]+$/i
    
    const trimmedKey = key.trim()
    
    if (trimmedKey.length === 0) {
      setError("Please enter a public key")
      return false
    }
    
    // Exactly 52 characters - no more, no less
    if (trimmedKey.length !== 52) {
      setError("Public key must be exactly 52 characters long")
      return false
    }
    
    if (!zbase32Regex.test(trimmedKey)) {
      setError("Invalid public key format. Must be z-base-32 encoded")
      return false
    }
    
    return true
  }

  // Handle search functionality with error control
  const handleSearch = async () => {
    const trimmedQuery = query.trim()
    
    try {
      setError(null)
      
      // Validate input
      if (!validatePublicKey(trimmedQuery)) {
        return
      }
      
      // Navigate to the key page
      router.push(`/${encodeURIComponent(trimmedQuery)}`)
      
    } catch (navigationError) {
      setError("Failed to navigate to key details. Please try again.")
    }
  }

  // Handle input changes and clear errors
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    // Clear error when user starts typing
    if (error) {
      setError(null)
    }
  }

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }

      // Close on escape and clear errors
      if (e.key === "Escape") {
        inputRef.current?.blur()
        setError(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }

  // Get border color based on state
  const getBorderColor = () => {
    if (error) return "rgb(221 107 107)" // red-500
    if (isFocused) return "rgb(91, 64, 234)" // purple-500
    return ""
  }

  // Get box shadow based on state
  const getBoxShadow = () => {
    if (error) return "0 0 0 1px rgb(221 107 107)"
    if (isFocused) return "0 0 0 1px rgb(91, 64, 234)"
    return ""
  }

  // Handle alert dismiss
  const dismissAlert = () => {
    setShowAlert(false)
    setError(null)
  }

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

      <div className="w-full max-w-2xl relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>

        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Find your piece of digital sovereignty..."
          className={`pl-10 pr-16 py-5 border-input rounded-lg focus-visible:ring-purple-500 focus-visible:ring-offset-0 ${
            error ? 'border-red-500' : ''
          }`}
          style={{
            borderColor: getBorderColor(),
            boxShadow: getBoxShadow(),
            color: error ? "rgb(221 107 107)" : "#9f9fa9",
            backgroundColor: "#161617",
            fontWeight: "600"
          }}
        />

        <div className="absolute inset-y-0 right-3 flex items-center">
          {isFocused ? (
            <button
              onMouseDown={(e) => {
                e.preventDefault() // Prevent input from losing focus
                handleSearch()
              }}
              className="px-3 py-1 text-xs font-semibold text-muted-foreground bg-muted hover:text-white hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors flex items-center gap-1 md:text-muted-foreground md:bg-muted max-md:text-white max-md:bg-purple-500"
            >
              <Globe className="h-3 w-3" />
              Resolve
            </button>
          ) : (
            <kbd className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted rounded">⌘ K</kbd>
          )}
        </div>
      </div>
    </>
  )
} 