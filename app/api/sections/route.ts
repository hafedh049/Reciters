import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://quranicaudio.com/api/sections", {
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
    console.error("Error fetching sections:", error)

    // Return fallback data if API fails
    const fallbackData = [
      { id: 1, name: "Recitations" },
      { id: 2, name: "Recitations from Haramain Taraweeh" },
      { id: 3, name: "Non-Hafs Recitations" },
      { id: 4, name: "Recitations with Translations" },
    ]

    return NextResponse.json(fallbackData)
  }
}

