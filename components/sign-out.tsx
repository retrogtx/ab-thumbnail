'use client'

import { Button } from "@/components/ui/button"
import { handleSignOut } from "@/app/actions/auth"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function SignOutButton() {
    const router = useRouter()
    const { toast } = useToast()
    const [isSigningOut, setIsSigningOut] = useState(false)

    const onSignOut = async () => {
        setIsSigningOut(true)
        try {
            const result = await handleSignOut()
            if (result.success) {
                router.push('/')
            } else {
                throw new Error("Sign out was not successful")
            }
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