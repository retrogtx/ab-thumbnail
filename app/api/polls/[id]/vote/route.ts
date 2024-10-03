import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const pollId = params.id
  const { thumbnailId } = await req.json()

  try {
    await prisma.vote.create({
      data: {
        poll: { connect: { id: pollId } },
        thumbnail: { connect: { id: thumbnailId } },
      },
    })

    // Fetch updated poll data
    const updatedPoll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        thumbnails: {
          select: {
            id: true,
            url: true,
            _count: { select: { votes: true } },
          },
        },
      },
    })

    if (!updatedPoll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
    }

    const totalVotes = updatedPoll.thumbnails.reduce((sum, thumbnail) => sum + thumbnail._count.votes, 0)

    const pollData = {
      ...updatedPoll,
      thumbnails: updatedPoll.thumbnails.map(thumbnail => ({
        id: thumbnail.id,
        url: thumbnail.url,
        votes: thumbnail._count.votes,
        percentage: totalVotes > 0 ? (thumbnail._count.votes / totalVotes) * 100 : 0,
      })),
      totalVotes,
    }

    return NextResponse.json({ message: 'Vote recorded successfully', poll: pollData })
  } catch (error) {
    console.error('Error voting:', error)
    return NextResponse.json({ error: 'Failed to vote' }, { status: 500 })
  }
}