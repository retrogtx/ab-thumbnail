'use client'

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { handleSignOut } from "@/app/actions/auth"
import { signOut } from "next-auth/react"

export function SignOutButton() {
    const { toast } = useToast()
    const router = useRouter()
    const [isSigningOut, setIsSigningOut] = useState(false)

    const onSignOut = async () => {
        setIsSigningOut(true)
        try {
            // Call the server action to sign out
            await handleSignOut()
            
            // Also sign out on the client side
            await signOut({ redirect: false })

            // Clear any local storage or cookies
            localStorage.clear()
            sessionStorage.clear()
            document.cookie.split(";").forEach((c) => {
                document.cookie = c
                    .replace(/^ +/, "")
                    .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
            })

            // Redirect to the home page
            router.push('/')
            router.refresh()
        } catch (error) {
            console.error("Error during sign out:", error)
            toast({
                title: "Error",
                description: "Failed to sign out. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSigningOut(false)
        }
    }

    return (
        <Button onClick={onSignOut} variant="outline" disabled={isSigningOut}>
            {isSigningOut ? "Signing out..." : "Sign out"}
        </Button>
    )
}