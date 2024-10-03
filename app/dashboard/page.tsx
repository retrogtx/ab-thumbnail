"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { SignOutButton } from "@/components/sign-out"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
import { CreatePollForm } from "@/components/create-poll-form"

export default function DashboardPage() {
  const [showCreatePollForm, setShowCreatePollForm] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/signin")
    }
  }, [status])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {session?.user?.name}!</h1>
      {showCreatePollForm ? (
        <CreatePollForm onCancel={() => setShowCreatePollForm(false)} />
      ) : (
        <Button 
          onClick={() => setShowCreatePollForm(true)}
          className="mt-4"
        >
          Create a new poll
        </Button>
      )}
      <div className="absolute top-4 right-4">
        <SignOutButton />
      </div>
    </div>
  )
}