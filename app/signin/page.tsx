import Image from "next/image"
import { SignIn } from "@/components/sign-in"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function SignInPage() {
  const session = await auth()
  
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="w-full h-screen bg-background bg-black lg:grid lg:grid-cols-2 overflow-hidden">
      <div className="flex items-center justify-center">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-white">Login</h1>
          </div>
          <SignIn className="bg-white text-black hover:bg-gray-200" />
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        <Image
          src="/image.png"
          alt="Image"
          layout="fill"
          objectFit="cover"
          className="dark:brightness-[0.2] dark:grayscale"
          priority
        />
      </div>
    </div>
  )
}