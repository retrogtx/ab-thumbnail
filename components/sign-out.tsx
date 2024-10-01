'use client'

import { Button } from "@/components/ui/button"
import { handleSignOut } from "@/app/actions/auth"

export function SignOutButton() {
    return (
        <form action={handleSignOut}>
            <Button type="submit" variant="outline">
                Sign out
            </Button>
        </form>
    )
}