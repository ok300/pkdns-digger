"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy, CheckCircle } from "lucide-react"
import { DnsRecordRow } from "@/components/dns-record-row"
import Link from "next/link"
import { useParams } from "next/navigation"
import { getDnsRecord, type DnsRecord } from "@/lib/dns"
import { SkeletonRow } from "@/components/row-skeleton"
import { NoRecordsFound } from "@/components/no-records-found"
import { ClientError } from "@/components/client-error"
import { usePkarr } from "@/providers/pkarr-provider"

// Constants
const SKELETON_ROWS = 8
const COPY_TIMEOUT = 2000
const IBM_PLEX_MONO_FONT = "'IBM Plex Mono', 'Courier New', monospace"

// Pkarr packet type
type PkarrPacket = {
  records: DnsRecord[] | null
  lastUpdated: string | null
  compressedSize: number | null
}

// Note: Pkarr client is now managed globally via usePkarr() hook

export default function ResolverPage() {
  const { id } = useParams()
  const publicKey = id as string
  
  // Global pkarr client state
  const { client, isLoading: clientLoading, error: clientError, retry } = usePkarr()

  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [pkarrPacket, setPkarrPacket] = useState<PkarrPacket>({
    records: null,
    lastUpdated: null,
    compressedSize: null
  })

  useEffect(() => {
    const fetchKeyData = async () => {
      if (!publicKey || !client) return;

      try {
        setLoading(true);
        const resolvedPacket = await client.resolve(publicKey);
        
        if (!resolvedPacket) {
          console.log("No packet found for key:", publicKey);
          setPkarrPacket({ records: null, lastUpdated: null, compressedSize: null });
          return;
        }
        
        setPkarrPacket({
          records: resolvedPacket.records.map(getDnsRecord),
          lastUpdated: new Date(resolvedPacket.timestampMs / 1000).toISOString(),
          compressedSize: resolvedPacket.compressedBytes().length
        });
      } catch (err) {
        console.error("Error fetching key data:", err);
        setPkarrPacket({ records: null, lastUpdated: null, compressedSize: null });
      } finally {
        setLoading(false);
      }
    };

    fetchKeyData();
  }, [publicKey, client]) // Added client dependency

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), COPY_TIMEOUT)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <main className="container mx-auto px-8 py-12 max-w-6xl">
        {/* Header with Back Button and Results */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-8">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-purple-500">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-lg font-medium text-gray-400">Results for</h1>
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="text-3xl font-bold text-white break-all font-mono" style={{ fontFamily: IBM_PLEX_MONO_FONT }}>{publicKey}</div>
            <Button
              onClick={copyToClipboard}
              size="sm"
              variant="outline"
              className="shrink-0"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-[rgb(91,64,234)]" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* DNS Records Table, No Records Message, or Client Error */}
        {clientError ? (
          <ClientError error={clientError} onRetry={retry} />
        ) : (clientLoading || loading) || pkarrPacket.records ? (
          <div className="mb-6">
            <div className="rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-6 px-6 py-2">
                <div className="col-span-3 text-sm font-semibold text-white uppercase tracking-wider">NAME</div>
                <div className="col-span-2 text-sm font-semibold text-white uppercase tracking-wider text-center">TYPE</div>
                <div className="col-span-6 text-sm font-semibold text-white uppercase tracking-wider">VALUE</div>
                <div className="col-span-1 text-sm font-semibold text-white uppercase tracking-wider">TTL</div>
              </div>

              {/* Table Rows */}
              <div className="max-h-[46vh] overflow-y-auto scrollbar-purple">
                {(clientLoading || loading) ? (
                  Array.from({ length: SKELETON_ROWS }).map((_, index) => (
                    <SkeletonRow key={index} index={index} />
                  ))
                ) : (
                  pkarrPacket.records?.map((record: DnsRecord, index: number) => (
                    <DnsRecordRow
                      key={index}
                      dnsRecord={record}
                      index={index}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <NoRecordsFound />
        )}

        {/* Key Info - Below table with margin */}
        {pkarrPacket.records && (
          <div className="mt-10 pt-6 border-t border-gray-700/30">
            <div className="flex justify-end space-x-8 text-sm">
              <div className="flex flex-col">
                <div className="text-gray-400 mb-1 text-xs uppercase tracking-wider">Last Updated</div>
                <div className="text-white font-medium">
                  {pkarrPacket.lastUpdated ? new Date(pkarrPacket.lastUpdated).toLocaleString() : 'Unknown'}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="text-gray-400 mb-1 text-xs uppercase tracking-wider">Compressed Size</div>
                <div className="text-white font-medium">
                    {pkarrPacket.compressedSize ? (
                    <>
                      <span className="font-bold">{pkarrPacket.compressedSize}</span><span className="text-gray-500">/1000</span> bytes
                    </>
                  ) : 'Unknown'}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
  )
} 