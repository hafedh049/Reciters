"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, ExternalLink } from "lucide-react"
import { formatDuration } from "@/lib/api"
import Link from "next/link"

interface AudioPlayerProps {
  audioUrl: string
  title: string
  reciter: string
  surahNumber: number
  onNext?: () => void
  onPrevious?: () => void
  totalDuration?: number
  onVerseChange?: (verseNumber: number) => void
  onPlayStateChange?: (isPlaying: boolean) => void
  shuffleMode?: boolean
  onShuffleModeChange?: (isShuffleMode: boolean) => void
}

export default function AudioPlayer({
  audioUrl,
  title,
  reciter,
  surahNumber,
  onNext,
  onPrevious,
  totalDuration,
  onVerseChange,
  onPlayStateChange,
  shuffleMode = false,
  onShuffleModeChange,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(totalDuration || 0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const circleRef = useRef<SVGCircleElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [remainingTime, setRemainingTime] = useState(0)
  const [isAudioReady, setIsAudioReady] = useState(false)
  const playOperationRef = useRef<boolean>(false)

  // Notify parent component about play state changes
  useEffect(() => {
    if (onPlayStateChange) {
      onPlayStateChange(isPlaying)
    }
  }, [isPlaying, onPlayStateChange])

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const setAudioData = () => {
      setDuration(audio.duration)
      setRemainingTime(audio.duration)
      setAudioError(null)
      setIsAudioReady(true)
    }

    const setAudioTime = () => {
      if (audio) {
        setCurrentTime(audio.currentTime)
        setRemainingTime(audio.duration - audio.currentTime)
      }

      // If we have the onVerseChange prop, estimate the current verse
      if (onVerseChange && duration > 0 && audio) {
        // This is a simplified simulation - in a real app, you would use actual verse timestamps
        const averageVerseLength = Math.max(5, duration / 20) // seconds per verse, with a minimum of 5 seconds
        const estimatedVerse = Math.ceil(audio.currentTime / averageVerseLength)

        if (estimatedVerse > 0) {
          onVerseChange(estimatedVerse)
        }
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      if (isRepeat) {
        audio.currentTime = 0
        audio.play().catch((err) => {
          console.error("Play failed:", err)
        })
        setIsPlaying(true)
      } else if (onNext) {
        onNext()
      }
    }

    const handleError = () => {
      setAudioError("Failed to load audio. Please try another selection.")
      setIsPlaying(false)
      setIsAudioReady(false)
    }

    const handleCanPlay = () => {
      setIsAudioReady(true)
    }

    // Events
    audio.addEventListener("loadeddata", setAudioData)
    audio.addEventListener("timeupdate", setAudioTime)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)
    audio.addEventListener("canplay", handleCanPlay)

    // Set initial duration if provided
    if (totalDuration && !audio.duration) {
      setDuration(totalDuration)
      setRemainingTime(totalDuration)
    }

    // Cleanup
    return () => {
      audio.removeEventListener("loadeddata", setAudioData)
      audio.removeEventListener("timeupdate", setAudioTime)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
      audio.removeEventListener("canplay", handleCanPlay)
    }
  }, [audioUrl, isRepeat, onNext, totalDuration, onVerseChange, duration])

  // Auto-play when audio is ready
  useEffect(() => {
    if (isAudioReady && audioRef.current && !playOperationRef.current) {
      playOperationRef.current = true

      // Small delay to ensure we don't interrupt any ongoing operations
      const playTimer = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current
            .play()
            .then(() => {
              setIsPlaying(true)
              playOperationRef.current = false
            })
            .catch((err) => {
              console.error("Auto-play failed:", err)
              setIsPlaying(false)
              playOperationRef.current = false
            })
        }
      }, 100)

      return () => clearTimeout(playTimer)
    }
  }, [isAudioReady])

  // Reset player when audio changes
  useEffect(() => {
    // First pause any current playback to avoid interruption errors
    if (audioRef.current) {
      const audio = audioRef.current

      // Only pause if actually playing to avoid unnecessary operations
      if (!audio.paused) {
        audio.pause()
      }

      // Reset after a small delay to ensure pause completes
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0
        }
        setCurrentTime(0)
        setIsPlaying(false)
        setAudioError(null)
        setIsAudioReady(false)
      }, 50)
    } else {
      // No audio element yet, just reset state
      setCurrentTime(0)
      setIsPlaying(false)
      setAudioError(null)
      setIsAudioReady(false)
    }
  }, [audioUrl])

  // Sync playing state with audio element
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handlePlay = () => {
      if (!playOperationRef.current) {
        setIsPlaying(true)
      }
    }

    const handlePause = () => {
      if (!playOperationRef.current) {
        setIsPlaying(false)
      }
    }

    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)

    return () => {
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio || playOperationRef.current) return

    if (isPlaying) {
      playOperationRef.current = true
      audio.pause()
      setIsPlaying(false)
      playOperationRef.current = false
    } else {
      playOperationRef.current = true
      audio
        .play()
        .then(() => {
          setIsPlaying(true)
          playOperationRef.current = false
        })
        .catch((err) => {
          console.error("Play failed:", err)
          setAudioError("Failed to play audio. Please try again.")
          setIsPlaying(false)
          playOperationRef.current = false
        })
    }
  }

  const handleTimeChange = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = value[0]
    setCurrentTime(value[0])
    setRemainingTime(audio.duration - value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = value[0]
    setVolume(newVolume)
    audio.volume = newVolume

    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = volume
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  const handleNext = () => {
    if (onNext) {
      onNext()
    }
  }

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious()
    }
  }

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat)
  }

  const toggleShuffle = () => {
    if (onShuffleModeChange) {
      onShuffleModeChange(!shuffleMode)
    }
  }

  return (
    <div className="w-full rounded-lg bg-card p-4 md:p-6 shadow-lg border border-border overflow-hidden relative mx-auto">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      {audioError && <div className="mb-4 text-center text-destructive text-sm">{audioError}</div>}

      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold text-primary mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{reciter}</p>
      </div>

      {/* Circular Progress Indicator */}
      <div className="flex justify-center items-center mb-4 md:mb-6 relative">
        <div className="relative w-36 h-36 md:w-48 md:h-48">
          {/* Background Circle */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted opacity-20"
            />
            {/* Progress Circle */}
            <circle
              ref={circleRef}
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - currentTime / (duration || 1))}`}
              className="text-primary transform -rotate-90 origin-center transition-all duration-300"
            />
          </svg>

          {/* Play/Pause Button in Center */}
          <Button
            onClick={togglePlay}
            variant="default"
            size="icon"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-16 w-16 md:h-20 md:w-20 rounded-full bg-primary hover:bg-primary/90 shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            aria-label={isPlaying ? "Pause" : "Play"}
            disabled={!isAudioReady || !!audioError}
          >
            {isPlaying ? (
              <Pause className="h-8 w-8 md:h-10 md:w-10" />
            ) : (
              <Play className="h-8 w-8 md:h-10 md:w-10 ml-1" />
            )}
            <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
          </Button>

          {/* Time Display */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-sm font-medium bg-gradient-to-r from-primary/20 via-background to-primary/20 px-4 py-1.5 rounded-full shadow-lg border border-primary/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-primary/20 hover:shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-primary font-mono">{formatDuration(currentTime)}</span>
              <span className="text-muted-foreground opacity-70">|</span>
              <span className="font-mono">{formatDuration(duration)}</span>
              <span
                className={`h-1.5 w-1.5 rounded-full ${isPlaying ? "bg-primary animate-pulse" : "bg-muted"}`}
              ></span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4 md:space-x-6 mb-4 md:mb-6">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 border-2 transition-transform duration-200 hover:scale-110"
          onClick={handlePrevious}
          disabled={!onPrevious}
        >
          <SkipBack className="h-5 w-5" />
        </Button>

        <Button
          variant={isRepeat ? "secondary" : "outline"}
          size="icon"
          onClick={toggleRepeat}
          className="rounded-full h-10 w-10 border-2 transition-transform duration-200 hover:scale-110"
          title="Repeat"
        >
          <Repeat className="h-5 w-5" />
        </Button>

        <Button
          variant={shuffleMode ? "secondary" : "outline"}
          size="icon"
          onClick={toggleShuffle}
          className="rounded-full h-10 w-10 border-2 transition-transform duration-200 hover:scale-110"
          title="Shuffle"
        >
          <Shuffle className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 border-2 transition-transform duration-200 hover:scale-110"
          onClick={handleNext}
          disabled={!onNext}
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-1 md:space-x-2 bg-background/50 px-2 md:px-4 py-1 md:py-2 rounded-full shadow-inner">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="h-6 w-6 md:h-8 md:w-8 hover:bg-background/80"
          >
            {isMuted ? <VolumeX className="h-3 w-3 md:h-4 md:w-4" /> : <Volume2 className="h-3 w-3 md:h-4 md:w-4" />}
          </Button>
          <div className="w-16 md:w-24">
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="cursor-pointer"
            />
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 ml-4 hover:bg-background/80 transition-transform duration-200 hover:scale-110"
          asChild
          title="Read on Quran.com"
        >
          <Link href={`https://quran.com/${surahNumber}`} target="_blank">
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 z-0"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full -ml-12 -mb-12 z-0"></div>
    </div>
  )
}

