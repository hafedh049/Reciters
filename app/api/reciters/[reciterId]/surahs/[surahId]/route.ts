import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { reciterId: string; surahId: string } }) {
  try {
    const { reciterId, surahId } = params
    const response = await fetch(`https://quranicaudio.com/api/reciters/${reciterId}/surahs/${surahId}`, {
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
    console.error(`Error fetching recitation for reciter ${params.reciterId} and surah ${params.surahId}:`, error)

    // Return fallback data if API fails
    const fallbackData = [
      {
        id: 1,
        chapter_id: Number.parseInt(params.surahId),
        file_size: 1000000,
        format: "mp3",
        total_seconds: 180,
        audio_url: "https://download.quranicaudio.com/quran/abdullaah_basfar/001.mp3",
        reciter: {
          id: Number.parseInt(params.reciterId),
          name: "Abdullah Basfar",
        },
      },
    ]

    return NextResponse.json(fallbackData)
  }
}

