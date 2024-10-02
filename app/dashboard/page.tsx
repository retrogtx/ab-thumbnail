import { auth } from "@/auth"
import { SignOutButton } from "@/components/sign-out"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  // Remove or comment out this line
  // console.log("Dashboard - Session:", session)

  if (!session) {
    redirect("/signin")
  }

  return (
    <div>
      <h1>Welcome to your dashboard, {session.user?.name}!</h1>
      <SignOutButton />
    </div>
  )
}