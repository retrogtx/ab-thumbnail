import { SignIn } from "@/components/sign-in"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function SignInPage() {
  const session = await auth()
  
  console.log("SignInPage session:", session) // Add this line for debugging

  if (session) {
    console.log("Redirecting to /dashboard") // Add this line for debugging
    redirect("/dashboard")
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn />
    </div>
  )
}