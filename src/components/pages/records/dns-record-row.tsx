import { DnsRecord, getBadgeColor } from '@/lib/dns'

interface DnsRecordRowProps {
  dnsRecord: DnsRecord,
  index: number
}

export function DnsRecordRow({ dnsRecord, index }: DnsRecordRowProps) {
  const { recordType, name, value, ttl } = dnsRecord;
  // Determine background based on index (odd = black, even = grey gradient)
  const isOdd = index % 2 === 1
  const backgroundClass = isOdd 
    ? "bg-background" 
    : "bg-gradient-to-r from-background via-[rgb(24,24,27)] to-background"
  
  const badgeColor = getBadgeColor(recordType)
  
  return (
    <div className={`grid grid-cols-12 gap-6 px-6 py-3 ${backgroundClass} hover:bg-[linear-gradient(to_right,theme(colors.background)_0%,#32303e_10%,#32303e_90%,theme(colors.background)_100%)] transition-colors`}>
      {/* Name */}
      <div className="col-span-3 text-white text-sm font-medium overflow-x-auto whitespace-nowrap scrollbar-hide">
        {name}
      </div>
      
      {/* Record Type Badge */}
      <div className="col-span-2 flex justify-center">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${badgeColor} text-white`}>
          {recordType as string}
        </span>
      </div>
      
      {/* Value */}
      <div className="col-span-6 text-gray-300 text-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
        {value}
      </div>
      
      {/* TTL */}
      <div className="col-span-1 text-white text-sm">
        {ttl}
      </div>
    </div>
  )
} 