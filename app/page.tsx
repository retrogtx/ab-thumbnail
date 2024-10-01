import { SignIn } from "@/components/sign-in";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      Welcome to A/B testing!
      <SignIn/>
    </div>
  )
}