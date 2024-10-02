import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "./auth"

export async function middleware(request: NextRequest) {
  const session = await auth()
  console.log("Middleware - Session:", JSON.stringify(session, null, 2))
  console.log("Middleware - URL:", request.url)

  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    console.log("Middleware - Redirecting to signin")
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  console.log("Middleware - Allowing access")
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}