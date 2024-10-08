"use client"

import { DashboardPageComponent } from "@/components/dashboard-page"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { status } = useSession()

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/signin")
    }
  }, [status])

  if (status === "loading") {
    return null // Or a loading spinner if you prefer
  }

  return <DashboardPageComponent />
}