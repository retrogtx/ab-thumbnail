import { auth } from "@/auth"
import { SignOutButton } from "@/components/sign-out"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  let session;
  try {
    session = await auth()
    console.log("Dashboard - Session:", session)
  } catch (error) {
    console.error("Error fetching session:", error)
    return <div>Error loading dashboard. Please try again.</div>
  }

  if (!session) {
    console.log("Dashboard - No session, redirecting to signin")
    redirect("/signin")
  }

  return (
    <div>
      <h1>Welcome to your dashboard, {session.user?.name}!</h1>
      {/* Add your dashboard content here */}
      <SignOutButton />
    </div>
  )
}