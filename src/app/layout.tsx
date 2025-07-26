import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { PkarrProvider } from "@/providers/pkarr-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "dig PKDNS",
  description: "Resolvable sovereign keys, now",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <PkarrProvider>
            <div className="min-h-screen bg-background text-foreground">
              <SiteHeader />
              {children}
              <footer className="fixed bottom-4 left-0 right-0 text-center">
                <p className="text-sm" style={{ color: "#383838" }}>
                  Synonym Software Ltd. ©2025
                </p>
              </footer>
            </div>
          </PkarrProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
