"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function SignIn() {
  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" })
  }

  return (
    <Button onClick={handleSignIn} variant="default">
      Sign in with Google
    </Button>
  )
}