import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const secret = process.env.AUTH_SECRET
  
  if (!secret) {
    console.error("AUTH_SECRET is not set")
    return NextResponse.next()
  }

  try {
    const token = await getToken({ req: request, secret })
    console.log("Middleware token:", token) // Add this line for debugging

    if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
      console.log("Redirecting to /signin") // Add this line for debugging
      return NextResponse.redirect(new URL('/signin', request.url))
    }

    if (token && request.nextUrl.pathname === '/signin') {
      console.log("Redirecting to /dashboard") // Add this line for debugging
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  } catch (error) {
    console.error("Error in middleware:", error)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin"],
}