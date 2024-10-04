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
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
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