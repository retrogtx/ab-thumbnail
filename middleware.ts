import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "./auth"

export async function middleware(request: NextRequest) {
  const session = await auth()
  console.log("Middleware - Session:", session)
  console.log("Middleware - Current path:", request.nextUrl.pathname)

  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    console.log("Middleware - No session, redirecting to signin")
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  if (session && request.nextUrl.pathname === '/signin') {
    console.log("Middleware - Session exists, redirecting to dashboard")
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  console.log("Middleware - Allowing access")
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin"],
}