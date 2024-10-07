"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export function Settings() {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }
    setIsDeleting(true)
    try {
      const response = await fetch('/api/user', {
        method: 'DELETE',
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to delete account')
      
      // Sign out the user
      await signOut({ redirect: false })
      
      toast({
        title: "Success",
        description: "Your account has been deleted.",
      })
      router.push('/')
    } catch (error) {
      console.error('Error deleting account:', error)
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
      <Button 
        onClick={handleDeleteAccount}
        variant="destructive"
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete Account"}
      </Button>
    </div>
  )
}