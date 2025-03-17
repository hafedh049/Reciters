import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const qariId = params.id
    const response = await fetch(`https://quranicaudio.com/api/audio_files/${qariId}`, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    // Ensure data is an array
    const responseData = Array.isArray(data) ? data : []
    return NextResponse.json(responseData)
  } catch (error) {
    console.error(`Error fetching audio files for qari ${params.id}:`, error)

    // Return fallback data if API fails
    const qariId = Number.parseInt(params.id)

    // Generate fallback data for all 114 surahs
    const fallbackData = Array.from({ length: 114 }, (_, i) => ({
      qari_id: qariId,
      surah_id: i + 1,
      main_id: i + 1000,
      recitation_id: 5,
      filenum: null,
      file_name: `${String(i + 1).padStart(3, "0")}.mp3`,
      extension: "mp3",
      stream_count: 100,
      download_count: 200,
      format: {
        size: 15659136,
        bit_rate: 128083,
        duration: 300 + i * 10, // Different duration for each surah
        nb_streams: 2,
        start_time: 0,
        format_name: "mp3",
        nb_programs: 0,
        probe_score: 51,
        format_long_name: "MP2/3 (MPEG audio layer 2/3)",
      },
      metadata: {
        album: "Quran",
        genre: "Quran",
        title: `Surah ${i + 1}`,
        track: `${i + 1}/114`,
        artist: "Fallback Reciter",
      },
      qari: {
        id: qariId,
        name: "Fallback Reciter",
        arabic_name: "القارئ الاحتياطي",
        relative_path: "abdullaah_basfar/",
        file_formats: "mp3",
        section_id: 1,
        home: true,
        description: null,
        torrent_filename: null,
        torrent_info_hash: null,
        torrent_seeders: null,
        torrent_leechers: null,
      },
    }))

    return NextResponse.json(fallbackData)
  }
}

