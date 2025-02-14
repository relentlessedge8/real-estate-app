"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { collection, query, where, getDocs, Timestamp, type QuerySnapshot, type DocumentData } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Toast } from "@/components/ui/toast"
import { Divider } from "@/components/ui/divider"

type Property = {
  id: string
  address: string
  saleDate: Date
  actualCapRate: number
  pricePerUnit: number
  numberOfUnits: number
  yearBuilt: number
  propertyType: string
  totalSquareFeet: number
}

export default function SearchResultsContent() {
  const [properties, setProperties] = useState<Property[]>([])
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const fetchProperties = async () => {
      setLoading(true)
      setError(null)

      try {
        const propertyType = searchParams.get("propertyType")
        const location = searchParams.get("location")

        console.log("Search parameters:", { propertyType, location })

        if (!propertyType || !location) {
          throw new Error("Missing required search parameters")
        }

        // First, verify the collection exists
        const propertiesRef = collection(db, "properties")
        if (!propertiesRef) {
          throw new Error("Properties collection reference is invalid")
        }

        console.log("Attempting to query Firestore...")

        // Create and log the query
        const q = query(propertiesRef, where("propertyType", "==", propertyType))
        console.log("Query created:", q)

        // Execute query with error handling
        let querySnapshot: QuerySnapshot<DocumentData>
        try {
          querySnapshot = await getDocs(q)
          console.log("Query executed successfully")
        } catch (queryError: any) {
          console.error("Query execution failed:", queryError)
          throw new Error(`Query failed: ${queryError.message || "Unknown error"}`)
        }

        if (querySnapshot.empty) {
          console.log("Query returned no results")
          if (isMounted) {
            setProperties([])
            setToast({
              message: "No properties found matching your criteria",
              variant: "error",
            })
          }
          return
        }

        console.log(`Query returned ${querySnapshot.size} documents`)

        const fetchedProperties: Property[] = []
        querySnapshot.forEach((doc) => {
          try {
            const data = doc.data()
            console.log("Processing document:", doc.id, data)

            // Validate required fields
            if (!data.propertyType || !data.address) {
              console.warn(`Document ${doc.id} is missing required fields`)
              return
            }

            fetchedProperties.push({
              id: doc.id,
              address: data.address,
              saleDate: data.saleDate instanceof Timestamp ? data.saleDate.toDate() : new Date(),
              actualCapRate: Number(data.actualCapRate) || 0,
              pricePerUnit: Number(data.pricePerUnit) || 0,
              numberOfUnits: Number(data.numberOfUnits) || 0,
              yearBuilt: Number(data.yearBuilt) || 0,
              propertyType: data.propertyType,
              totalSquareFeet: Number(data.totalSquareFeet) || 0,
            })
          } catch (docError) {
            console.error("Error processing document:", doc.id, docError)
          }
        })

        console.log(`Processed ${fetchedProperties.length} valid properties`)

        if (isMounted) {
          setProperties(fetchedProperties)
          if (fetchedProperties.length > 0) {
            setToast({
              message: `Found ${fetchedProperties.length} properties`,
              variant: "success",
            })
          }
        }
      } catch (err: any) {
        console.error("Error in fetchProperties:", err)

        // Detailed error logging
        if (err.code) {
          console.error("Firebase error code:", err.code)
        }
        if (err.message) {
          console.error("Error message:", err.message)
        }
        if (err.stack) {
          console.error("Error stack:", err.stack)
        }

        let errorMessage = "Failed to fetch properties. Please try again later."

        if (err.code === "permission-denied") {
          errorMessage = "Access denied. Please check your permissions."
        } else if (err.code === "not-found") {
          errorMessage = "The requested data could not be found."
        } else if (err.message) {
          errorMessage = err.message
        }

        if (isMounted) {
          setError(errorMessage)
          setToast({
            message: errorMessage,
            variant: "error",
          })
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchProperties()

    return () => {
      isMounted = false
    }
  }, [searchParams])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Search Results</h1>
        </div>
        <div className="text-red-500 p-4 rounded-lg border border-red-200 bg-red-50">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Search Results</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{properties.length} properties found</span>
          </div>
        </div>

        <Divider />

        {properties.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Sale Date</TableHead>
                  <TableHead>Cap Rate</TableHead>
                  <TableHead>Price Per Unit</TableHead>
                  <TableHead>Number of Units</TableHead>
                  <TableHead>Year Built</TableHead>
                  <TableHead>Property Type</TableHead>
                  <TableHead>Total Square Feet</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProperties.has(property.id)}
                        onCheckedChange={() => {
                          setSelectedProperties((prev) => {
                            const newSet = new Set(prev)
                            if (newSet.has(property.id)) {
                              newSet.delete(property.id)
                            } else {
                              newSet.add(property.id)
                            }
                            return newSet
                          })
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Link href={`/property/${property.id}`} className="text-blue-600 hover:underline">
                        {property.address}
                      </Link>
                    </TableCell>
                    <TableCell>{format(property.saleDate, "PP")}</TableCell>
                    <TableCell>{property.actualCapRate.toFixed(2)}%</TableCell>
                    <TableCell>${property.pricePerUnit.toLocaleString()}</TableCell>
                    <TableCell>{property.numberOfUnits}</TableCell>
                    <TableCell>{property.yearBuilt}</TableCell>
                    <TableCell>{property.propertyType}</TableCell>
                    <TableCell>{property.totalSquareFeet.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No properties found matching your search criteria
          </div>
        )}
      </div>

      {selectedProperties.size > 0 && (
        <div className="mt-4 flex justify-end">
          <Button>Run Report ({selectedProperties.size} selected)</Button>
        </div>
      )}

      {toast && (
        <Toast variant={toast.variant} onClose={() => setToast(null)}>
          {toast.message}
        </Toast>
      )}
    </div>
  )
}

