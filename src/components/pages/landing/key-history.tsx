'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tag, Trash2, Check } from "lucide-react"
import { getRecentKeys, deleteKey, setKeyTag, getKeyTag } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export function KeyHistory() {
  const router = useRouter()
  const [recentKeys, setRecentKeys] = useState<string[]>([])
  const [editingTag, setEditingTag] = useState<string | null>(null)
  const [tagValue, setTagValue] = useState("")

  useEffect(() => {
    setRecentKeys(getRecentKeys())
  }, [])

  const handleDelete = (e: React.MouseEvent, key: string) => {
    e.stopPropagation() 
    deleteKey(key)
    setRecentKeys(getRecentKeys())
  }

  const handleTag = (e: React.MouseEvent, key: string) => {
    e.stopPropagation()
    setEditingTag(key)
    setTagValue(getKeyTag(key) || "")  // Initialize with existing tag
  }

  const handleTagSubmit = (key: string, tag: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setKeyTag(key, tag)
    setRecentKeys(getRecentKeys())
    setEditingTag(null)  // Close the input field
  }
  
  return (
    <>
    {/* Recent Keys List */}
    <div className="row-span-3 flex flex-col overflow-hidden h-full max-w-2xl mx-auto w-full">
      {Object.keys(recentKeys).length > 0 && (
        <div className="flex flex-col gap-2 w-full h-full">
          <div className="text-sm text-muted-foreground font-medium">Recent Keys</div>
          <div className="bg-[#131313] rounded-lg overflow-hidden p-2 backdrop-blur-sm h-[25rem]">
            <div className="flex flex-col overflow-y-auto h-full hover:[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
              {Object.keys(recentKeys).map((key: string, index: number) => (
                <div
                  key={index}
                  className="group flex items-center justify-between text-left px-4 py-4 text-sm text-muted-foreground hover:text-white font-medium truncate transition-all duration-200 border-b border-[#27272a] last:border-0 mx-2"
                >
                  <div className="flex flex-col truncate flex-1">
                    {editingTag === key ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          value={tagValue}
                          onChange={(e) => setTagValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleTagSubmit(key, tagValue)
                            } else if (e.key === 'Escape') {
                              setEditingTag(null)
                            }
                          }}
                          className="h-8 bg-[#27272a] border-none text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                          placeholder="Enter tag..."
                          autoFocus
                        />
                        <button
                          onClick={(e) => handleTagSubmit(key, tagValue, e)}
                          className="p-1.5 text-[#474747] hover:text-[#5b40ea]/40 hover:bg-[#5b40ea]/5 rounded-full transition-colors flex-shrink-0"
                          title="Save tag"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => router.push(`/?id=${key}`)}
                          className="truncate text-left"
                        >
                          {key}<span className="text-xs text-[#5e5e5e]/60 mt-1 ml-3">
                            {getKeyTag(key)}
                          </span>
                        </button>
                        {/* {getKeyTag(key) && (
                          <span className="text-xs text-[#5b40ea]/60 mt-1">
                            {getKeyTag(key)}
                          </span>
                        )} */}
                      </>
                    )}
                  </div>
                  {editingTag !== key && (
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0">
                      <button
                        onClick={(e) => handleTag(e, key)}
                        className="p-1.5 text-[#474747] hover:text-[#5b40ea]/40 hover:bg-[#5b40ea]/5 rounded-full transition-colors"
                        title="Tag this key"
                      >
                        <Tag className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, key)}
                        className="p-1.5 text-[#474747] hover:text-[#5b40ea]/40 hover:bg-[#5b40ea]/5 rounded-full transition-colors"
                        title="Remove from history"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  )
}