import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://quranicaudio.com/api/qaris", {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching qaris:", error)

    // Return fallback data if API fails
    const fallbackData = [
      {
        id: 1,
        name: "Abdullah Awad al-Juhani",
        arabic_name: "عبدالله عواد الجهني",
        relative_path: "abdullaah_3awwaad_al-juhaynee/",
        file_formats: "mp3",
        section_id: 1,
        home: true,
        description: null,
        torrent_filename: "[Quran] Abdullah Awad al-Juhani [127Kbps - 128Kbps].torrent",
        torrent_info_hash: "b3f798af9d7c913a7ffa9c278a0299d5d4ef6780",
        torrent_seeders: 2,
        torrent_leechers: 2,
      },
      {
        id: 2,
        name: "AbdulMuhsin al-Qasim",
        arabic_name: "عبدالمحسن القاسم",
        relative_path: "abdul_muhsin_al_qasim/",
        file_formats: "mp3",
        section_id: 1,
        home: true,
        description: null,
        torrent_filename: null,
        torrent_info_hash: null,
        torrent_seeders: null,
        torrent_leechers: null,
      },
    ]

    return NextResponse.json(fallbackData)
  }
}

