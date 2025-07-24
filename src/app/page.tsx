import { PkSearch } from "@/components/pk-search"

export default function DomainDigger() {
  return (
    <main className="flex flex-col items-center justify-center px-4" style={{ minHeight: 'calc(100vh - 200px)' }}>
      <h1 className="text-4xl font-bold mb-1 text-center">Resolvable sovereign keys, now</h1>
      <div className="flex flex-col space-y-4 text-base mb-10">
        <p className="text-muted-foreground text-center">
          Add your pubky and share with your friends so they can fetch and watch your records
        </p>
      </div>

      <PkSearch />
    </main>
  )
}
