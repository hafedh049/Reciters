import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const qariId = params.id
    const response = await fetch(`https://quranicaudio.com/api/qaris/${qariId}`, {
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
    console.error(`Error fetching qari ${params.id}:`, error)

    // Return fallback data if API fails
    const fallbackData = {
      id: Number.parseInt(params.id),
      name: "Abdullah Basfar",
      arabic_name: "عبد الله بصفر",
      relative_path: "abdullaah_basfar/",
      file_formats: "mp3",
      section_id: 1,
      home: true,
      description: null,
      torrent_filename: null,
      torrent_info_hash: null,
      torrent_seeders: null,
      torrent_leechers: null,
    }

    return NextResponse.json(fallbackData)
  }
}

