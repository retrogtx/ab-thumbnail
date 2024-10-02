'use server'

import { signOut } from "@/auth"

export async function handleSignOut() {
  await signOut({ redirect: false })
  return { success: true }
}