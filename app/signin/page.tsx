import { SignIn } from "@/components/sign-in"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function SignInPage() {
  const session = await auth()
  
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn />
    </div>
  )
}