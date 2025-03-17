import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const sectionId = params.id
    const response = await fetch(`https://quranicaudio.com/api/section/${sectionId}/reciters`, {
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
    console.error(`Error fetching reciters for section ${params.id}:`, error)

    // Return fallback data if API fails
    const fallbackData = [
      { id: 1, name: "Abdullah Basfar" },
      { id: 2, name: "Abdur-Rahman as-Sudais" },
      { id: 3, name: "Abu Bakr al-Shatri" },
      { id: 4, name: "Mishari Rashid al-`Afasy" },
      { id: 5, name: "Hani ar-Rifai" },
    ]

    return NextResponse.json(fallbackData)
  }
}

