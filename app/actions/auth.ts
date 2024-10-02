'use server'

import { signOut } from "@/auth"

export async function handleSignOut() {
  try {
    await signOut()
    return { success: true }
  } catch (error) {
    console.error("Error during sign out:", error)
    return { success: false }
  }
}