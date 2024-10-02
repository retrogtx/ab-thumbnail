'use client'

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { signOut } from "next-auth/react"

export function SignOutButton() {
    const { toast } = useToast()
    const [isSigningOut, setIsSigningOut] = useState(false)

    const onSignOut = async () => {
        setIsSigningOut(true)
        try {
            await signOut({ callbackUrl: '/' })
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