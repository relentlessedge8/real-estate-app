"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface ToastProps {
  children: React.ReactNode
  variant: "success" | "error"
  onClose: () => void
}

export function Toast({ children, variant, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!isVisible) return null

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-md text-white ${
        variant === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {children}
    </div>
  )
}

