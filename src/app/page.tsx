"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { PkSearch } from "@/components/pages/landing/pk-search"
import { PkResolver } from "@/components/pages/records/pk-resolver"

function DomainDiggerContent() {

  const searchParams = useSearchParams()
  const publicKey = searchParams.get('id')

  // If no publicKey is provided, show the search interface
  if (!publicKey) {
    return <PkSearch />
  }

  // If publicKey is provided, show the resolver results
  return <PkResolver publicKey={publicKey} />
}

export default function DomainDigger() {
  return (
    <Suspense fallback={<PkSearch />}>
      <DomainDiggerContent />
    </Suspense>
  )
}
