import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const pollId = params.id
  const body = await req.json()
  const { thumbnailId } = body

  console.log('Received vote request:', { pollId, thumbnailId, body });

  if (!pollId || !thumbnailId) {
    console.error('Missing data:', { pollId, thumbnailId });
    return NextResponse.json({ error: 'Missing pollId or thumbnailId' }, { status: 400 })
  }

  try {
    // Check if the poll and thumbnail exist
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: { thumbnails: true },
    })

    if (!poll) {
      console.error('Poll not found:', pollId);
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
    }

    const thumbnail = poll.thumbnails.find(t => t.id === thumbnailId)
    if (!thumbnail) {
      console.error('Thumbnail not found:', thumbnailId);
      return NextResponse.json({ error: 'Thumbnail not found' }, { status: 404 })
    }

    // Create the vote
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
      console.error('Updated poll not found:', pollId);
      return NextResponse.json({ error: 'Failed to fetch updated poll' }, { status: 500 })
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

    console.log('Vote recorded successfully:', pollData);
    return NextResponse.json({ message: 'Vote recorded successfully', poll: pollData })
  } catch (error) {
    console.error('Error voting:', error)
    return NextResponse.json({ error: 'Failed to vote', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}