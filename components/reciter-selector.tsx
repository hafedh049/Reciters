"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getQarisBySection, type Qari } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ReciterSelectorProps {
  sectionId: number | null
  onReciterSelect: (reciter: Qari) => void
  switchToSurahsTab?: () => void
  currentReciterId?: number
}

export default function ReciterSelector({
  sectionId,
  onReciterSelect,
  switchToSurahsTab,
  currentReciterId,
}: ReciterSelectorProps) {
  const [reciters, setReciters] = useState<Qari[]>([])
  const [filteredReciters, setFilteredReciters] = useState<Qari[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchReciters() {
      if (!sectionId) return

      try {
        setLoading(true)
        setError(null)
        const data = await getQarisBySection(sectionId)
        setReciters(data)
        setFilteredReciters(data)
      } catch (err) {
        setError("Failed to load reciters")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchReciters()
  }, [sectionId])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredReciters(reciters)
    } else {
      const filtered = reciters.filter(
        (reciter) =>
          reciter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (reciter.arabic_name && reciter.arabic_name.includes(searchQuery)),
      )
      setFilteredReciters(filtered)
    }
  }, [searchQuery, reciters])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  if (loading) {
    return <div className="text-center py-4">Loading reciters...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-destructive">{error}</div>
  }

  if (!sectionId) {
    return <div className="text-center py-4">Please select a section first</div>
  }

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search reciters..." value={searchQuery} onChange={handleSearch} className="pl-10" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {filteredReciters.length === 0 ? (
          <div className="col-span-full text-center py-4">No reciters found</div>
        ) : (
          filteredReciters.map((reciter) => (
            <Card
              key={reciter.id}
              className={`cursor-pointer transition-all ${
                currentReciterId === reciter.id ? "bg-primary/20 border-primary" : "hover:bg-primary/10"
              }`}
              onClick={() => {
                onReciterSelect(reciter)
                if (switchToSurahsTab) {
                  switchToSurahsTab()
                }
              }}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <Avatar
                  className={`h-10 w-10 ${
                    currentReciterId === reciter.id ? "bg-primary text-primary-foreground" : "bg-primary/20"
                  }`}
                >
                  <AvatarFallback>{reciter.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{reciter.name}</h3>
                  {reciter.arabic_name && <p className="text-xs text-muted-foreground">{reciter.arabic_name}</p>}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

