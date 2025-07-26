import { HelpCircle } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export function Header() {
    return (
        <>
            <h1 className="text-4xl font-bold text-white mb-2">Resolvable sovereign keys, now</h1>
            <div className="flex items-center justify-center gap-2 mb-8">
                <p className="text-lg text-muted-foreground">Find and manage PKDNS records for any pubky</p>
                <HoverCard openDelay={0}>
                    <HoverCardTrigger asChild>
                        <HelpCircle className="h-5 w-5 text-muted-foreground hover:text-white transition-colors cursor-help" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 bg-[#131313] border-[#27272a]">
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-white">What's a pubky?</h4>
                            <p className="text-sm text-muted-foreground">
                                A pubky is a public identifier in the Pubky ecosystem. It's a unique and platform-independent cryptographic key used to sign, authorize, and interact. No usernames, accounts, or permissions needed.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                You can attach records to a pubky using the mainline DHT. This enables PKDNS, a decentralized, global, permissionless DNS system based on keys.
                            </p>
                        </div>
                    </HoverCardContent>
                </HoverCard>
            </div>
        </>
    )
}