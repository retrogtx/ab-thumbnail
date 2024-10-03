import { NextResponse } from 'next/server'
import prisma from "@/lib/prisma"

export async function GET() {
  await prisma.session.deleteMany({})
  return NextResponse.json({ message: "All sessions cleared" })
}