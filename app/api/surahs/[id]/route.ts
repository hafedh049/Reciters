import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const surahId = params.id
    const response = await fetch(`https://quranicaudio.com/api/surahs/${surahId}`, {
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
    console.error(`Error fetching surah ${params.id}:`, error)

    // Return fallback data if API fails
    const surahId = Number.parseInt(params.id)
    const fallbackData = {
      id: surahId,
      page: [50, 76],
      bismillah_pre: true,
      ayat: 200,
      name: {
        complex: "Surah " + surahId,
        simple: "Surah " + surahId,
        english: "Surah " + surahId,
        arabic: "سورة " + surahId,
      },
      revelation: {
        place: "makkah",
        order: 89,
      },
    }

    return NextResponse.json(fallbackData)
  }
}

