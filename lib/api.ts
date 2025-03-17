export interface Section {
  id: number
  name: string
}

export interface Qari {
  id: number
  name: string
  arabic_name: string | null
  relative_path: string
  file_formats: string
  section_id: number
  home: boolean
  description: string | null
  torrent_filename: string | null
  torrent_info_hash: string | null
  torrent_seeders: number | null
  torrent_leechers: number | null
}

export interface SurahName {
  complex: string
  simple: string
  english: string
  arabic: string
}

export interface SurahRevelation {
  place: string
  order: number
}

export interface Surah {
  id: number
  page: number[]
  bismillah_pre: boolean
  ayat: number
  name: SurahName
  revelation: SurahRevelation
}

export interface AudioFormat {
  size: number
  bit_rate: number
  duration: number
  nb_streams: number
  start_time: number
  format_name: string
  nb_programs: number
  probe_score: number
  format_long_name: string
}

export interface AudioMetadata {
  album: string
  genre: string
  title: string
  track: string
  artist: string
}

export interface AudioFile {
  qari_id: number
  surah_id: number
  main_id: number
  recitation_id: number
  filenum: number | null
  file_name: string
  extension: string
  stream_count: number
  download_count: number
  format: AudioFormat
  metadata: AudioMetadata
  qari: Qari
}

// API base URL
const API_BASE_URL = "/api"

// Get all sections
export async function getSections(): Promise<Section[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/sections`)
    if (!response.ok) {
      throw new Error("Failed to fetch sections")
    }
    return response.json()
  } catch (error) {
    console.error("Error fetching sections:", error)
    throw error
  }
}

// Get all reciters (qaris)
export async function getAllQaris(): Promise<Qari[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/qaris`)
    if (!response.ok) {
      throw new Error("Failed to fetch reciters")
    }
    return response.json()
  } catch (error) {
    console.error("Error fetching all reciters:", error)
    throw error
  }
}

// Get reciters by section
export async function getQarisBySection(sectionId: number): Promise<Qari[]> {
  try {
    const allQaris = await getAllQaris()
    return allQaris.filter((qari) => qari.section_id === sectionId)
  } catch (error) {
    console.error(`Error fetching reciters for section ${sectionId}:`, error)
    throw error
  }
}

// Get a specific reciter
export async function getQari(qariId: number): Promise<Qari> {
  try {
    const response = await fetch(`${API_BASE_URL}/qaris/${qariId}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch reciter with ID ${qariId}`)
    }
    return response.json()
  } catch (error) {
    console.error(`Error fetching reciter ${qariId}:`, error)
    throw error
  }
}

// Get all surahs
export async function getSurahs(): Promise<Surah[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/surahs`)
    if (!response.ok) {
      throw new Error("Failed to fetch surahs")
    }
    return response.json()
  } catch (error) {
    console.error("Error fetching surahs:", error)
    throw error
  }
}

// Get a specific surah
export async function getSurah(surahId: number): Promise<Surah> {
  try {
    const response = await fetch(`${API_BASE_URL}/surahs/${surahId}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch surah with ID ${surahId}`)
    }
    return response.json()
  } catch (error) {
    console.error(`Error fetching surah ${surahId}:`, error)
    throw error
  }
}

// Get audio files for a specific reciter
export async function getAudioFiles(qariId: number): Promise<AudioFile[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/audio_files/${qariId}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch audio files for reciter ${qariId}`)
    }
    const data = await response.json()
    // Ensure we return an array
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error(`Error fetching audio files for reciter ${qariId}:`, error)
    return [] // Return empty array on error
  }
}

// Construct audio URL
export function constructAudioUrl(relativePath: string, surahId: number): string {
  const zeroPaddedSurahId = String(surahId).padStart(3, "0")
  return `https://download.quranicaudio.com/quran/${relativePath}${zeroPaddedSurahId}.mp3`
}

// Helper function to format duration
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

