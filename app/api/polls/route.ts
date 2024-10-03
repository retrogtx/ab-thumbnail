import { NextResponse } from 'next/server'
import { auth } from "@/auth"
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await auth()

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, description, thumbnailUrls } = await req.json()

  try {
    const poll = await prisma.poll.create({
      data: {
        title,
        description,
        userId: session.user.id,
        thumbnails: {
          create: thumbnailUrls.map((url: string) => ({ url })),
        },
      },
      include: {
        thumbnails: true,
      },
    })

    return NextResponse.json(poll)
  } catch (error) {
    console.error('Error creating poll:', error)
    return NextResponse.json({ error: 'Failed to create poll' }, { status: 500 })
  }
}