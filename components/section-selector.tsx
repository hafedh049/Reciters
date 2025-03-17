"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { getSections, type Section } from "@/lib/api"

interface SectionSelectorProps {
  onSectionSelect: (sectionId: number) => void
}

export default function SectionSelector({ onSectionSelect }: SectionSelectorProps) {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSection, setSelectedSection] = useState<number | null>(null)

  useEffect(() => {
    async function fetchSections() {
      try {
        setLoading(true)
        setError(null)
        const data = await getSections()
        setSections(data)

        // Auto-select first section
        if (data.length > 0) {
          setSelectedSection(data[0].id)
          onSectionSelect(data[0].id)
        }
      } catch (err) {
        console.error("Failed to load sections:", err)
        setError("Failed to load sections. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchSections()
  }, [onSectionSelect])

  const handleSectionClick = (sectionId: number) => {
    setSelectedSection(sectionId)
    onSectionSelect(sectionId)
  }

  if (loading) {
    return <div className="text-center py-4">Loading sections...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-destructive">{error}</div>
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      {sections.map((section) => (
        <Button
          key={section.id}
          variant={selectedSection === section.id ? "default" : "outline"}
          onClick={() => handleSectionClick(section.id)}
          className="transition-all"
        >
          {section.name}
        </Button>
      ))}
    </div>
  )
}

