import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const poll = await prisma.poll.findUnique({
      where: { id },
      include: {
        thumbnails: {
          select: {
            id: true,
            url: true,
            _count: {
              select: { votes: true },
            },
          },
        },
      },
    })

    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
    }

    const totalVotes = poll.thumbnails.reduce((sum, thumbnail) => sum + thumbnail._count.votes, 0)

    const pollData = {
      ...poll,
      thumbnails: poll.thumbnails.map(thumbnail => ({
        id: thumbnail.id,
        url: thumbnail.url,
        votes: thumbnail._count.votes,
        percentage: totalVotes > 0 ? (thumbnail._count.votes / totalVotes) * 100 : 0,
      })),
      totalVotes,
    }

    return NextResponse.json(pollData)
  } catch (error) {
    console.error('Error fetching poll:', error)
    return NextResponse.json({ error: 'Failed to fetch poll' }, { status: 500 })
  }
}