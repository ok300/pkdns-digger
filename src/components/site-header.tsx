import { Button } from "@/components/ui/button"
import { Cog, Fingerprint } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-800 dark:border-gray-800">
      <div className="flex items-center space-x-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full border-1 border-foreground flex items-center justify-center">
            <Fingerprint className="w-5 h-5" />
          </div>
          <span className="font-medium">PKDNS digger</span>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {/* <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-purple-500 group">
          <Cog className="w-5 h-5" />
        </Button>
        <ThemeToggle /> */}
      </div>
    </header>
  )
} 