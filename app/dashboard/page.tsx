import { auth } from "@/auth"
import { SignOutButton } from "@/components/sign-out"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/")
  }

  return (
    <div>
      <h1>Welcome to your dashboard, {session.user?.name}!</h1>
      {/* Add your dashboard content here */}
      <SignOutButton />
    </div>
  )
}