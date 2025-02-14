"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Filter } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export default function AnalysisPage() {
  const [selectedPropertyType, setSelectedPropertyType] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState("")
  const [selectedRadiusIndex, setSelectedRadiusIndex] = useState(3) // Default to 1 mile
  const router = useRouter()

  const radiusOptions = [0.25, 0.5, 0.75, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50]

  const handleSearch = () => {
    if (selectedPropertyType && searchInput.trim()) {
      router.push(
        `/search-results?propertyType=${selectedPropertyType}&location=${searchInput}&radius=${radiusOptions[selectedRadiusIndex]}`,
      )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 bg-background/80 backdrop-blur-md border-b z-50">
        <div className="h-14 px-4 max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-semibold">
              Comps by Me
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <FilterSidebar
                  selectedPropertyType={selectedPropertyType}
                  setSelectedPropertyType={setSelectedPropertyType}
                  searchInput={searchInput}
                  setSearchInput={setSearchInput}
                  selectedRadiusIndex={selectedRadiusIndex}
                  setSelectedRadiusIndex={setSelectedRadiusIndex}
                  handleSearch={handleSearch}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden md:block w-80 border-r h-[calc(100vh-3.5rem)] sticky top-14">
          <FilterSidebar
            selectedPropertyType={selectedPropertyType}
            setSelectedPropertyType={setSelectedPropertyType}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            selectedRadiusIndex={selectedRadiusIndex}
            setSelectedRadiusIndex={setSelectedRadiusIndex}
            handleSearch={handleSearch}
          />
        </aside>

        <main className="flex-1 p-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {["Multi Family", "Retail", "Industrial", "Land"].map((propertyType) => (
                <button
                  key={propertyType}
                  className={`p-6 rounded-xl shadow-sm transition-all duration-300 flex items-center justify-center border ${
                    selectedPropertyType === propertyType
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-white text-gray-800 border-gray-100 hover:shadow-md"
                  }`}
                  onClick={() => setSelectedPropertyType(propertyType)}
                >
                  <span className="text-lg font-medium">{propertyType}</span>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function FilterSidebar({
  selectedPropertyType,
  setSelectedPropertyType,
  searchInput,
  setSearchInput,
  selectedRadiusIndex,
  setSelectedRadiusIndex,
  handleSearch,
}: {
  selectedPropertyType: string | null
  setSelectedPropertyType: (type: string) => void
  searchInput: string
  setSearchInput: (input: string) => void
  selectedRadiusIndex: number
  setSelectedRadiusIndex: (index: number) => void
  handleSearch: () => void
}) {
  const radiusOptions = [0.25, 0.5, 0.75, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50]

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <h3 className="font-semibold">Search Properties</h3>
        <Select defaultValue="address">
          <SelectTrigger>
            <SelectValue placeholder="Search by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="address">Property Address</SelectItem>
            <SelectItem value="zip">ZIP Code</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Enter address or ZIP code..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold">Radius: {radiusOptions[selectedRadiusIndex]} miles</h3>
        <Slider
          min={0}
          max={radiusOptions.length - 1}
          step={1}
          value={[selectedRadiusIndex]}
          onValueChange={(value) => setSelectedRadiusIndex(value[0])}
        />
      </div>
      <Button className="w-full" onClick={handleSearch} disabled={!selectedPropertyType || !searchInput.trim()}>
        Search {selectedPropertyType ? selectedPropertyType : "Properties"}
      </Button>
    </div>
  )
}

