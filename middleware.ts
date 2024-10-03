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

    if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }
  } catch (error) {
    console.error("Error in middleware:", error)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}