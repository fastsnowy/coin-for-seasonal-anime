"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Season = "spring" | "summer" | "autumn" | "winter"

type SeasonInfo = {
  type: "current" | "next" | "past"
  year: number
  season: Season
}

interface SeasonSelectorProps {
  onSeasonChange: (season: SeasonInfo) => void
}

export default function SeasonSelector({ onSeasonChange }: SeasonSelectorProps) {
  const [selectedTab, setSelectedTab] = useState<"current" | "next" | "past">("current")
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear.toString())
  const [selectedSeason, setSelectedSeason] = useState<Season>("spring")
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i)

  const seasons = [
    { id: "spring", name: "春" },
    { id: "summer", name: "夏" },
    { id: "autumn", name: "秋" },
    { id: "winter", name: "冬" },
  ]

  // Update parent component when tab changes
  useEffect(() => {
    if (selectedTab === "current") {
      onSeasonChange({
        type: "current",
        year: currentYear,
        season: getCurrentSeason().id as Season,
      })
    } else if (selectedTab === "next") {
      const nextSeason = getNextSeason()
      onSeasonChange({
        type: "next",
        year: nextSeason.year,
        season: nextSeason.id as Season,
      })
    }
  }, [selectedTab, currentYear, onSeasonChange])

  // Handle past season selection
  const handlePastSeasonSelect = () => {
    onSeasonChange({
      type: "past",
      year: Number.parseInt(selectedYear),
      season: selectedSeason,
    })
  }

  return (
    <div className="mb-8 bg-card rounded-lg p-4 shadow-sm">
      <Tabs
        defaultValue="current"
        onValueChange={(value) => setSelectedTab(value as "current" | "next" | "past")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">今期</TabsTrigger>
          <TabsTrigger value="next">来期</TabsTrigger>
          <TabsTrigger value="past">過去</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="pt-4">
          <p className="text-center text-muted-foreground">
            {getCurrentSeason().name} {currentYear}
          </p>
        </TabsContent>

        <TabsContent value="next" className="pt-4">
          <p className="text-center text-muted-foreground">
            {getNextSeason().name} {getNextSeason().year}
          </p>
        </TabsContent>

        <TabsContent value="past" className="pt-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="w-full sm:w-1/3">
              <Select defaultValue={currentYear.toString()} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="年を選択" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-1/3">
              <Select defaultValue="spring" onValueChange={(value) => setSelectedSeason(value as Season)}>
                <SelectTrigger>
                  <SelectValue placeholder="季節を選択" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map((season) => (
                    <SelectItem key={season.id} value={season.id}>
                      {season.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full sm:w-auto" onClick={handlePastSeasonSelect}>
              表示
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function getCurrentSeason() {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 5) return { id: "spring", name: "春" }
  if (month >= 6 && month <= 8) return { id: "summer", name: "夏" }
  if (month >= 9 && month <= 11) return { id: "autumn", name: "秋" }
  return { id: "winter", name: "冬" }
}

function getNextSeason() {
  const current = getCurrentSeason()
  const currentYear = new Date().getFullYear()

  switch (current.id) {
    case "spring":
      return { id: "summer", name: "夏", year: currentYear }
    case "summer":
      return { id: "autumn", name: "秋", year: currentYear }
    case "autumn":
      return { id: "winter", name: "冬", year: currentYear }
    case "winter":
      return { id: "spring", name: "春", year: currentYear + 1 }
    default:
      return { id: "spring", name: "春", year: currentYear }
  }
}

