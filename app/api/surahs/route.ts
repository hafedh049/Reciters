import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://quranicaudio.com/api/surahs", {
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
    console.error("Error fetching surahs:", error)

    // Return fallback data for first 3 surahs if API fails
    const fallbackData = [
      {
        id: 1,
        page: [1, 1],
        bismillah_pre: false,
        ayat: 7,
        name: {
          complex: "Al-Fātiĥah",
          simple: "Al-Fatihah",
          english: "The Opener",
          arabic: "الفاتحة",
        },
        revelation: {
          place: "makkah",
          order: 5,
        },
      },
      {
        id: 2,
        page: [2, 49],
        bismillah_pre: true,
        ayat: 286,
        name: {
          complex: "Al-Baqarah",
          simple: "Al-Baqarah",
          english: "The Cow",
          arabic: "البقرة",
        },
        revelation: {
          place: "madinah",
          order: 87,
        },
      },
      {
        id: 3,
        page: [50, 76],
        bismillah_pre: true,
        ayat: 200,
        name: {
          complex: "Āli `Imrān",
          simple: "Ali 'Imran",
          english: "Family of Imran",
          arabic: "آل عمران",
        },
        revelation: {
          place: "madinah",
          order: 89,
        },
      },
    ]

    return NextResponse.json(fallbackData)
  }
}

