import { Utils } from '@synonymdev/pkarr'

/**
 * DNS Record Types with badge styling
 * Colors match the existing purple/indigo theme
 */
export enum DnsRecordType {
  A = 'A',
  AAAA = 'AAAA', 
  CNAME = 'CNAME',
  TXT = 'TXT',
  HTTPS = 'HTTPS',
  SVCB = 'SVCB',
  NS = 'NS'
}

export interface DnsRecordConfig {
  name: string
  badgeColor: string
  description: string
}

export interface DnsRecord {
    recordType: DnsRecordType
    name: string
    value: string
    ttl: number
}

export const DNS_RECORD_CONFIGS: Record<DnsRecordType, DnsRecordConfig> = {
  [DnsRecordType.A]: {
    name: 'A',
    badgeColor: 'bg-[rgb(91,64,234)]/30',
    description: 'IPv4 address record'
  },
  [DnsRecordType.AAAA]: {
    name: 'AAAA', 
    badgeColor: 'bg-[rgb(31,0,185)]/30',
    description: 'IPv6 address record'
  },
  [DnsRecordType.CNAME]: {
    name: 'CNAME',
    badgeColor: 'bg-[rgb(76,48,220)]/30', 
    description: 'Canonical name record'
  },
  [DnsRecordType.TXT]: {
    name: 'TXT',
    badgeColor: 'bg-[rgb(46,16,192)]/30',
    description: 'Text record'
  },
  [DnsRecordType.HTTPS]: {
    name: 'HTTPS',
    badgeColor: 'bg-[rgb(61,32,206)]/30',
    description: 'HTTPS service binding'
  },
  [DnsRecordType.SVCB]: {
    name: 'SVCB', 
    badgeColor: 'bg-[rgb(55,20,200)]/30',
    description: 'Service binding record'
  },
  [DnsRecordType.NS]: {
    name: 'NS',
    badgeColor: 'bg-[rgb(40,12,178)]/30',
    description: 'Name server record'
  }
}

/**
 * Get badge color from string input
 * Returns the badge color if valid DNS record type, otherwise returns default color
 */
export function getBadgeColor(recordType: DnsRecordType): string {
  if (Object.values(DnsRecordType).includes(recordType)) {
    return DNS_RECORD_CONFIGS[recordType].badgeColor
  }
  // Default color for unknown record types
  return 'bg-gray-500/30'
}


export function getDnsRecord(record: { name: string; rdata: { type: string; address?: string; target?: string; nsdname?: string; params?: any, value?: string }; ttl: number }): DnsRecord {
    console.log("- Record", record);
    const recordType = record.rdata.type as DnsRecordType;
    // Remove the last element (public key) from the DNS name
    const nameParts = record.name.split(".").slice(0, -1);
    // If the name is empty, set it to @, marking a root record
    const name = nameParts.length > 0 ? nameParts.join(".") : "@";
    let value: string;
    switch (recordType) {
        case DnsRecordType.A:
        case DnsRecordType.AAAA:
            value = record.rdata.address || "-";
            break;
        case DnsRecordType.CNAME:
          value = record.rdata.target || "-";
        case DnsRecordType.HTTPS:
        case DnsRecordType.SVCB:
            value = formatPkarrKeyValue(record.rdata) || Utils.formatRecordValue(record.rdata) || "-";
            break;
        case DnsRecordType.NS:
            value = record.rdata.nsdname || "-";
            break;
        case DnsRecordType.TXT:
            value = record.rdata.value || "-";
            break;
        default:
            value = "-";
            break;
    }
    return {
        recordType,
        name,
        value,
        ttl: record.ttl
    }
}

/**
 * TODO: This is a hack until we publish the homeserver record properly
 * Formats a PKARR key value into the standard format
 * @param rdata The raw rdata object
 */
export function formatPkarrKeyValue(rdata: any): string | null {
  if (rdata.priority === 0 && rdata.target === "") {
    return "1 . " + Object.entries(rdata.params).map(([k,v]) => `${k}=${v}`).join(" ")
  } else {
    return null
  }
}
