"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getSurahs, type Surah, formatDuration, type Qari } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SurahSelectorProps {
  onSurahSelect: (surah: Surah) => void
  audioFiles?: any[] // Optional audio files to show duration
  onShowArabicText?: (surahId: number) => void
  currentPlayingSurahId?: number
  selectedReciter?: Qari | null // Add this new prop
}

export default function SurahSelector({
  onSurahSelect,
  audioFiles = [],
  onShowArabicText,
  currentPlayingSurahId,
  selectedReciter,
}: SurahSelectorProps) {
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchSurahs() {
      try {
        setLoading(true)
        const data = await getSurahs()
        setSurahs(data)
        setFilteredSurahs(data)
      } catch (err) {
        setError("Failed to load surahs")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSurahs()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSurahs(surahs)
    } else {
      const filtered = surahs.filter(
        (surah) =>
          surah.name.simple.toLowerCase().includes(searchQuery.toLowerCase()) ||
          surah.name.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
          surah.name.arabic.includes(searchQuery) ||
          surah.id.toString().includes(searchQuery),
      )
      setFilteredSurahs(filtered)
    }
  }, [searchQuery, surahs])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Find duration for a surah if available
  const getDuration = (surahId: number) => {
    if (!Array.isArray(audioFiles)) return null

    const audioFile = audioFiles.find((file) => file.surah_id === surahId)
    if (audioFile && audioFile.format && audioFile.format.duration) {
      return formatDuration(audioFile.format.duration)
    }
    return null
  }

  const handleSurahClick = (surah: Surah) => {
    onSurahSelect(surah)
    if (onShowArabicText) {
      onShowArabicText(surah.id)
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading surahs...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-destructive">{error}</div>
  }

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search surahs..." value={searchQuery} onChange={handleSearch} className="pl-10" />
      </div>

      {selectedReciter && (
        <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {selectedReciter.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-medium text-primary">{selectedReciter.name}</h3>
              {selectedReciter.arabic_name && (
                <p className="text-xs text-muted-foreground">{selectedReciter.arabic_name}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {filteredSurahs.length === 0 ? (
          <div className="col-span-full text-center py-4">No surahs found</div>
        ) : (
          filteredSurahs.map((surah) => {
            const duration = getDuration(surah.id)

            return (
              <Card
                key={surah.id}
                className={`cursor-pointer transition-all ${
                  currentPlayingSurahId === surah.id ? "bg-primary/20 border-primary" : "hover:bg-primary/10"
                }`}
                onClick={() => handleSurahClick(surah)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        currentPlayingSurahId === surah.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/20 text-sm font-medium"
                      }`}
                    >
                      {surah.id}
                    </div>
                    {duration && (
                      <Badge variant="outline" className="text-xs">
                        {duration}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{surah.name.simple}</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">{surah.name.english}</p>
                      <p className="text-sm font-arabic">{surah.name.arabic}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {surah.ayat} verses • {surah.revelation.place}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

