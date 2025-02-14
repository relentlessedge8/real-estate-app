import { Suspense } from "react"
import SearchResultsContent from "./search-results-content"

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <SearchResultsContent />
    </Suspense>
  )
}

