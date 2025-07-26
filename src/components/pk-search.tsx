"use client"

import { useState, useRef, useEffect } from "react"
import { Search, AlertCircle, X, Clipboard, Globe, Tag, Trash2, HelpCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export function PkSearch() {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAlert, setShowAlert] = useState(false)
  const [recentKeys] = useState(Array(10).fill("kzz343fphekkrxeh6zgxe7aawzcb6otydooocoim8fgqekezizuo"))
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

    setError(null)

    // Validate input
    if (!validatePublicKey(trimmedQuery)) {
      return
    }

    // Navigate to the key page using query parameter
    router.push(`/?id=${encodeURIComponent(trimmedQuery)}`)
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

  // Handle paste functionality
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setQuery(text)
    } catch (err) {
      setError("Failed to paste from clipboard")
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
    // Reset input styles by re-validating current input
    if (query.trim().length > 0) {
      validatePublicKey(query)
    }
  }

  // Auto-dismiss effect
  useEffect(() => {
    if (error) {
      setShowAlert(true)
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        dismissAlert() // Use the same dismissAlert function for consistency
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  // Check if current input is valid without setting error
  const isValidKey = (key: string): boolean => {
    const zbase32Regex = /^[13456789abcdefghijkmnopqrstuwxyz]+$/i
    const trimmedKey = key.trim()
    return trimmedKey.length === 52 && zbase32Regex.test(trimmedKey)
  }

  // Handle clicking a recent key
  const handleRecentKeyClick = (key: string) => {
    setQuery(key)
    if (validatePublicKey(key)) {
      handleSearch()
    }
  }

  const handleDelete = (e: React.MouseEvent, key: string) => {
    e.stopPropagation() // Prevent triggering the button click
    // Add delete functionality here
  }

  const handleTag = (e: React.MouseEvent, key: string) => {
    e.stopPropagation() // Prevent triggering the button click
    // Add tag functionality here
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
      <main className="grid grid-rows-12 px-4 h-[calc(100vh-8rem)] w-full max-w-4xl mx-auto gap-8">
        <div className="row-span-9 flex items-center">
          <div className="bg-[#1d1d20] rounded-lg p-20 backdrop-blur-sm w-full text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Resolvable sovereign keys, now</h1>
            <div className="flex items-center justify-center gap-2 mb-8">
              <p className="text-lg text-muted-foreground">Find and manage PKDNS records for any pubky</p>
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="relative">
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
                placeholder="Enter or paste a pubky"
                className={`pl-10 pr-24 py-6 rounded-full border-[#27272a] focus-visible:ring-0 focus-visible:ring-offset-0 font-semibold ${
                  !isFocused ? 'border-dashed' : ''
                } ${
                  error ? 'border-red-500' : ''
                }`}
                style={{
                  borderColor: getBorderColor(),
                  boxShadow: getBoxShadow(),
                  color: error ? "rgb(221 107 107)" : isValidKey(query) ? "#ffffff" : "#9f9fa9",
                  backgroundColor: "#161617",
                }}
              />

              <div className="absolute inset-y-0 right-3 flex items-center">
                {query.length > 0 ? (
                  <button
                    onClick={handleSearch}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors flex items-center gap-2 ${
                      isValidKey(query)
                        ? 'text-white bg-[#5b40ea] hover:bg-[#4f37cc]'
                        : 'text-muted-foreground bg-[#27272a] hover:bg-[#313136] hover:text-white'
                    }`}
                  >
                    <Globe className="h-4 w-4" />
                    Resolve
                  </button>
                ) : (
                  <button
                    onClick={handlePaste}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground bg-[#27272a] hover:bg-[#313136] hover:text-white rounded-full transition-colors flex items-center gap-2"
                  >
                    <Clipboard className="h-4 w-4" />
                    Paste
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Keys List */}
        <div className="row-span-3 flex flex-col overflow-hidden h-full max-w-2xl mx-auto w-full">
          {recentKeys.length > 0 && !error && (
            <div className="flex flex-col gap-2 w-full h-full">
              <div className="text-sm text-muted-foreground font-medium">Recent Keys</div>
              <div className="bg-[#131313] rounded-lg overflow-hidden p-2 backdrop-blur-sm h-[25rem]">
                <div className="flex flex-col overflow-y-auto h-full hover:[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {recentKeys.map((key, index) => (
                    <div
                      key={index}
                      className="group flex items-center justify-between text-left px-4 py-4 text-sm text-muted-foreground hover:text-white font-medium truncate transition-all duration-200 border-b border-[#27272a] last:border-0 mx-2"
                    >
                      <button
                        onClick={() => router.push(`/?id=${key}`)}
                        className="truncate text-left"
                      >
                        {key}
                      </button>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button
                          onClick={(e) => handleTag(e, key)}
                          className="p-1.5 text-[#474747] hover:text-white hover:bg-white/10 rounded-full transition-colors"
                          title="Tag this key"
                        >
                          <Tag className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, key)}
                          className="p-1.5 text-[#474747] hover:text-[#5b40ea]/70 hover:bg-[#5b40ea]/10 rounded-full transition-colors"
                          title="Remove from history"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}