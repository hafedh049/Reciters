"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface QuranVerse {
  number: number | null
  text: string
  translation?: string
}

// Define the Qari interface
interface Qari {
  id: number
  name: string
  style: string
}

// Update the interface to include reciter information
interface QuranTextDisplayProps {
  surahId: number
  surahName: string
  currentVerse?: number
  isPlaying?: boolean
  reciter?: Qari | null // Add this new prop
}

// Function to convert Western digits to Arabic digits with safety checks
function toArabicDigits(num: number | undefined | null): string {
  if (num === undefined || num === null) {
    return ""
  }

  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"]
  return num
    .toString()
    .split("")
    .map((digit) => {
      const index = Number.parseInt(digit)
      return !isNaN(index) && index >= 0 && index <= 9 ? arabicDigits[index] : digit
    })
    .join("")
}

// Update the component to accept the reciter prop
export default function QuranTextDisplay({
  surahId,
  surahName,
  currentVerse,
  isPlaying = false,
  reciter = null,
}: QuranTextDisplayProps) {
  const [verses, setVerses] = useState<QuranVerse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchQuranText() {
      if (!surahId) return

      setLoading(true)
      setError(null)

      try {
        // Using the Quran.com API to fetch the Arabic text
        const response = await fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${surahId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch Quran text: ${response.status}`)
        }

        const data = await response.json()

        if (data && data.verses) {
          const formattedVerses = data.verses.map((verse: any, index: number) => ({
            number: verse.verse_number || index + 1, // Use index+1 as fallback if verse_number is missing
            text: verse.text_uthmani,
          }))

          setVerses(formattedVerses)
        } else {
          throw new Error("Invalid response format")
        }
      } catch (err) {
        console.error("Error fetching Quran text:", err)
        setError("Failed to load Quran text. Please try again later.")

        // Fallback data for testing
        setVerses([
          { number: 1, text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" },
          { number: 2, text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ" },
          { number: 3, text: "الرَّحْمَٰنِ الرَّحِيمِ" },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchQuranText()
  }, [surahId])

  useEffect(() => {
    if (currentVerse) {
      const verseElement = document.getElementById(`verse-${currentVerse}`)
      if (verseElement) {
        verseElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [currentVerse])

  if (loading) {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle className="text-center">Loading Surah {surahName}...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-6 flex-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle className="text-center text-destructive">Error Loading Surah</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">{error}</p>
        </CardContent>
      </Card>
    )
  }

  // Update the Card component to include reciter information
  return (
    <Card
      className={cn(
        "w-full mt-6 transition-all duration-500",
        isPlaying ? "border-primary/50 bg-primary/5 shadow-[0_0_15px_rgba(0,255,255,0.1)]" : "",
      )}
    >
      <CardHeader>
        <CardTitle className="text-center text-lg md:text-xl">Surah {surahName}</CardTitle>
        {/* Add this section to display the reciter information */}
        {reciter && (
          <div className="flex justify-center mt-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-sm">
              <span className="font-medium text-primary">Reciter:</span>
              <span>{reciter.name}</span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-2 md:pt-4">
        <div className="text-right rtl:text-right leading-loose text-base md:text-xl" dir="rtl">
          {verses.map((verse, index) => (
            <span key={verse.number || index} className="inline-block">
              <span
                id={`verse-${verse.number}`}
                className={`font-arabic transition-colors duration-300 ${
                  currentVerse && verse.number && verse.number <= currentVerse
                    ? "text-primary font-bold"
                    : "text-foreground"
                }`}
              >
                {verse.text}
              </span>
              <span className="inline-block mx-1 md:mx-2 text-amber-500 relative text-lg md:text-xl">
                <span className="drop-shadow-[0_0_3px_rgba(255,255,255,0.5)] relative">
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-amber-600">
                    {toArabicDigits(verse.number)}
                  </span>
                  ۝
                </span>
              </span>
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

