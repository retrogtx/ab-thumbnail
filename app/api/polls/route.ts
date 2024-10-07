import { NextResponse } from 'next/server'
import { auth } from "@/auth"
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await auth();
    console.log('Session:', session);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    console.log('Request body:', body);

    const { title, description, thumbnailUrls } = body;

    if (!title || !description || !thumbnailUrls || thumbnailUrls.length !== 2) {
      console.error('Invalid input data:', { title, description, thumbnailUrls });
      return NextResponse.json({ error: 'Invalid input data', details: { title, description, thumbnailUrlsCount: thumbnailUrls?.length } }, { status: 400 });
    }

    console.log('Creating poll in database...');
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
    });

    console.log('Poll created successfully:', poll);
    return NextResponse.json(poll);
  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json({ error: 'Failed to create poll', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const polls = await prisma.poll.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        thumbnails: {
          select: {
            id: true,
            url: true,
            _count: { select: { votes: true } },
          },
        },
      },
    });

    const formattedPolls = polls.map(poll => ({
      id: poll.id,
      title: poll.title,
      description: poll.description,
      createdAt: poll.createdAt.toISOString(),
      thumbnails: poll.thumbnails.map(thumbnail => ({
        id: thumbnail.id,
        url: thumbnail.url,
        votes: thumbnail._count.votes,
      })),
    }));

    return NextResponse.json(formattedPolls);
  } catch (error) {
    console.error('Error fetching polls:', error);
    return NextResponse.json({ error: 'Failed to fetch polls' }, { status: 500 });
  }
}