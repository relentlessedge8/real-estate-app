import type React from "react"
import { cn } from "@/lib/utils"

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string
}

export function Divider({ className, color = "bg-yellow-400", ...props }: DividerProps) {
  return <div className={cn("w-full h-1", color, className)} {...props} />
}

