"use client"

import Image from 'next/image'
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function SignIn({ className }: { className?: string }) {
  const router = useRouter()

  const handleSignIn = async () => {
    try {
      const result = await signIn("google", { callbackUrl: "/dashboard", redirect: false })
      if (result?.error) {
        console.error("Sign in error:", result.error)
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch (error) {
      console.error("Sign in error:", error)
    }
  }

  return (
    <Button onClick={handleSignIn} variant="default" className={`flex items-center ${className}`}>
      <Image
        src="/google.png"
        alt="Google logo"
        width={18}
        height={18}
        className="mr-2"
      />
      Sign in with Google
    </Button>
  )
}