import { NextResponse } from 'next/server'
import { auth } from "@/auth"
import prisma from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pollId = params.id;

    // Fetch the poll to get the thumbnail URLs
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: { thumbnails: true },
    });

    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    if (poll.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the poll and related data from the database
    await prisma.poll.delete({
      where: { id: pollId },
    });

    // Delete the thumbnail images from Supabase storage
    for (const thumbnail of poll.thumbnails) {
      const filePath = thumbnail.url.split('/').pop();
      if (filePath) {
        await supabaseAdmin.storage.from('thumbnails').remove([filePath]);
      }
    }

    return NextResponse.json({ message: 'Poll deleted successfully' });
  } catch (error) {
    console.error('Error deleting poll:', error);
    return NextResponse.json({ error: 'Failed to delete poll' }, { status: 500 });
  }
}