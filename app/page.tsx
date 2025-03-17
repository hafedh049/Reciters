"use client"

import { useState, useEffect } from "react"
import {
  getSections,
  getSurahs,
  getAudioFiles,
  constructAudioUrl,
  type Section,
  type Qari,
  type Surah,
  type AudioFile,
} from "@/lib/api"
import Header from "@/components/header"
import ParticleBackground from "@/components/particle-background"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shuffle, ExternalLink } from "lucide-react"
import ReciterSelector from "@/components/reciter-selector"
import SurahSelector from "@/components/surah-selector"
import AudioPlayer from "@/components/audio-player"
import QuranTextDisplay from "@/components/quran-text-display"
import Link from "next/link"

export default function Home() {
  // State for sections
  const [sections, setSections] = useState<Section[]>([])
  const [selectedSection, setSelectedSection] = useState<number | null>(null)

  // State for reciters
  const [selectedReciter, setSelectedReciter] = useState<Qari | null>(null)

  // State for surahs
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null)

  // State for audio files
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([])
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>("")

  // State for player
  const [shuffleMode, setShuffleMode] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // State for showing Quran text
  const [showQuranText, setShowQuranText] = useState(false)

  // Loading and error states
  const [loading, setLoading] = useState({
    sections: false,
    reciters: false,
    surahs: false,
    audioFiles: false,
  })
  const [error, setError] = useState<string | null>(null)

  // Add this with the other state variables
  const [activeTab, setActiveTab] = useState("reciters")
  const [currentVerse, setCurrentVerse] = useState<number>(0)

  // Fetch sections on mount
  useEffect(() => {
    async function fetchSections() {
      try {
        setLoading((prev) => ({ ...prev, sections: true }))
        const data = await getSections()
        setSections(data)

        // Auto-select first section
        if (data.length > 0) {
          setSelectedSection(data[0].id)
        }
      } catch (err) {
        console.error("Failed to load sections:", err)
        setError("Failed to load sections. Please try again later.")
      } finally {
        setLoading((prev) => ({ ...prev, sections: false }))
      }
    }

    fetchSections()
  }, [])

  // Fetch surahs on mount
  useEffect(() => {
    async function fetchSurahs() {
      try {
        setLoading((prev) => ({ ...prev, surahs: true }))
        const data = await getSurahs()
        setSurahs(data)
      } catch (err) {
        console.error("Failed to load surahs:", err)
        setError("Failed to load surahs. Please try again later.")
      } finally {
        setLoading((prev) => ({ ...prev, surahs: false }))
      }
    }

    fetchSurahs()
  }, [])

  // Fetch audio files when reciter changes
  useEffect(() => {
    async function fetchAudioFiles() {
      if (!selectedReciter) return

      try {
        setLoading((prev) => ({ ...prev, audioFiles: true }))
        const data = await getAudioFiles(selectedReciter.id)
        setAudioFiles(data)
      } catch (err) {
        console.error("Failed to load audio files:", err)
        setError("Failed to load audio files. Please try again later.")
      } finally {
        setLoading((prev) => ({ ...prev, audioFiles: false }))
      }
    }

    fetchAudioFiles()
  }, [selectedReciter])

  // Update audio URL when reciter or surah changes
  useEffect(() => {
    if (selectedReciter && selectedSurah) {
      const url = constructAudioUrl(selectedReciter.relative_path, selectedSurah.id)
      setCurrentAudioUrl(url)
    } else {
      setCurrentAudioUrl("")
    }
  }, [selectedReciter, selectedSurah])

  // Handle section selection
  const handleSectionSelect = (sectionId: number) => {
    setSelectedSection(sectionId)
    setSelectedReciter(null)
    setSelectedSurah(null)
    setCurrentAudioUrl("")
    setShowQuranText(false)
  }

  // Handle reciter selection
  const handleReciterSelect = (reciter: Qari) => {
    setSelectedReciter(reciter)
    // Don't reset selected surah to allow for easy switching between reciters
  }

  // Handle surah selection
  const handleSurahSelect = (surah: Surah) => {
    setSelectedSurah(surah)
    setShowQuranText(false) // Reset text display when changing surah
  }

  // Handle showing Arabic text
  const handleShowArabicText = (surahId: number) => {
    setShowQuranText(true)
  }

  // Handle next surah
  const handleNextSurah = () => {
    if (!selectedSurah || !surahs.length) return

    const currentIndex = surahs.findIndex((s) => s.id === selectedSurah.id)
    if (currentIndex === -1) return

    let nextIndex
    if (shuffleMode) {
      // Random surah excluding current one
      nextIndex = Math.floor(Math.random() * (surahs.length - 1))
      if (nextIndex >= currentIndex) nextIndex++
    } else {
      // Next surah in order
      nextIndex = (currentIndex + 1) % surahs.length
    }

    setSelectedSurah(surahs[nextIndex])
    setShowQuranText(false) // Reset text display when changing surah
  }

  // Handle previous surah
  const handlePreviousSurah = () => {
    if (!selectedSurah || !surahs.length) return

    const currentIndex = surahs.findIndex((s) => s.id === selectedSurah.id)
    if (currentIndex === -1) return

    let prevIndex
    if (shuffleMode) {
      // Random surah excluding current one
      prevIndex = Math.floor(Math.random() * (surahs.length - 1))
      if (prevIndex >= currentIndex) prevIndex++
    } else {
      // Previous surah in order
      prevIndex = (currentIndex - 1 + surahs.length) % surahs.length
    }

    setSelectedSurah(surahs[prevIndex])
    setShowQuranText(false) // Reset text display when changing surah
  }

  // Handle shuffle play
  const handleShufflePlay = () => {
    if (!surahs.length || !selectedReciter) return

    setShuffleMode(true)
    const randomIndex = Math.floor(Math.random() * surahs.length)
    setSelectedSurah(surahs[randomIndex])
    setShowQuranText(false) // Reset text display when changing surah
  }

  // Get audio file for current surah
  const getCurrentAudioFile = () => {
    if (!selectedSurah || !audioFiles.length) return null
    return audioFiles.find((file) => file.surah_id === selectedSurah.id)
  }

  // Get duration for current surah
  const getCurrentDuration = () => {
    const audioFile = getCurrentAudioFile()
    return audioFile?.format?.duration || 0
  }

  // Add this with the other handler functions
  const handleVerseChange = (verseNumber: number) => {
    setCurrentVerse(verseNumber)
  }

  // Add this handler for play state changes
  const handlePlayStateChange = (playing: boolean) => {
    setIsPlaying(playing)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ParticleBackground />
      <Header />

      <main className="flex-1 container py-4 px-2 md:py-8 md:px-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">Quranic Audio Player</h1>

        {/* Sections */}
        <div className="flex flex-wrap gap-2 justify-center mb-4 md:mb-6 overflow-x-auto pb-2">
          {loading.sections ? (
            <div className="text-center py-4">Loading sections...</div>
          ) : (
            sections.map((section) => (
              <Button
                key={section.id}
                variant={selectedSection === section.id ? "default" : "outline"}
                onClick={() => handleSectionSelect(section.id)}
                className="transition-all"
              >
                {section.name}
              </Button>
            ))
          )}
        </div>

        {/* Quran.com Promotion */}
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Read the Quran</CardTitle>
            <CardDescription>Visit Quran.com for reading, translations, and tafsir</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="gap-2">
              <Link href="https://quran.com" target="_blank">
                Visit Quran.com <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Shuffle Play Button */}
        {selectedReciter && (
          <div className="flex justify-center mb-6">
            <Button onClick={handleShufflePlay} variant="secondary" className="gap-2">
              <Shuffle className="h-4 w-4" /> Shuffle Play
            </Button>
          </div>
        )}

        {/* Audio Player */}
        {currentAudioUrl && (
          <div className="w-full max-w-md mx-auto mb-6 md:mb-8 px-2">
            <AudioPlayer
              audioUrl={currentAudioUrl}
              title={selectedSurah ? `Surah ${selectedSurah.name.simple}` : ""}
              reciter={selectedReciter ? selectedReciter.name : ""}
              surahNumber={selectedSurah ? selectedSurah.id : 1}
              onNext={handleNextSurah}
              onPrevious={handlePreviousSurah}
              totalDuration={getCurrentDuration()}
              onVerseChange={handleVerseChange}
              onPlayStateChange={handlePlayStateChange}
            />
          </div>
        )}

        {/* Tabs for Reciters and Surahs */}
        {!showQuranText && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6 md:mb-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="reciters">Reciters</TabsTrigger>
              <TabsTrigger value="surahs">Surahs</TabsTrigger>
            </TabsList>

            <TabsContent value="reciters" className="mt-4">
              <ReciterSelector
                sectionId={selectedSection}
                onReciterSelect={handleReciterSelect}
                switchToSurahsTab={() => setActiveTab("surahs")}
                currentReciterId={selectedReciter?.id}
              />
            </TabsContent>

            <TabsContent value="surahs" className="mt-4">
              <SurahSelector
                onSurahSelect={handleSurahSelect}
                audioFiles={Array.isArray(audioFiles) ? audioFiles : []}
                onShowArabicText={handleShowArabicText}
                currentPlayingSurahId={selectedSurah?.id}
                selectedReciter={selectedReciter} // Pass the selectedReciter
              />
            </TabsContent>
          </Tabs>
        )}

        {/* Quran Text Display */}
        {showQuranText && selectedSurah && (
          <div className="w-full max-w-3xl mx-auto px-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
              <Button variant="outline" onClick={() => setShowQuranText(false)}>
                Back to Selection
              </Button>

              <h2 className="text-lg md:text-xl font-bold text-primary text-center sm:text-right">
                {selectedSurah.name.simple} ({selectedSurah.name.arabic})
              </h2>
            </div>

            <QuranTextDisplay
              surahId={selectedSurah.id}
              surahName={selectedSurah.name.simple}
              currentVerse={currentVerse}
              isPlaying={isPlaying}
              reciter={selectedReciter} // Pass the reciter
            />
          </div>
        )}

        {/* Selection Instructions */}
        {!currentAudioUrl && !loading.audioFiles && !showQuranText && (
          <div className="text-center py-8 text-muted-foreground">
            {selectedReciter ? "Select a surah to play" : "Select a reciter and surah to play"}
          </div>
        )}

        {/* Loading State */}
        {loading.audioFiles && !showQuranText && <div className="text-center py-8">Loading audio files...</div>}

        {/* Error State */}
        {error && !showQuranText && <div className="text-center py-8 text-destructive">{error}</div>}
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <div className="container">
          <p>© {new Date().getFullYear()} Quranic Audio Player. All rights reserved.</p>
          <div className="mt-2">
            <Link href="https://quran.com" target="_blank" className="text-primary hover:underline">
              Visit Quran.com
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

