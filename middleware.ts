import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "./auth"

export async function middleware(request: NextRequest) {
  const session = await auth()
  console.log("Middleware - Session:", session)
  console.log("Middleware - Current path:", request.nextUrl.pathname)

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}