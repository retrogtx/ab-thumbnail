import { NextResponse } from 'next/server'
import { auth } from "@/auth"
import prisma from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function DELETE() {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch all polls for the user
    const userPolls = await prisma.poll.findMany({
      where: { userId },
      include: { thumbnails: true },
    });

    // Delete all polls and related data
    for (const poll of userPolls) {
      // Delete thumbnail images from Supabase storage
      for (const thumbnail of poll.thumbnails) {
        const filePath = thumbnail.url.split('/').pop();
        if (filePath) {
          await supabaseAdmin.storage.from('thumbnails').remove([filePath]);
        }
      }

      // Delete the poll from the database
      await prisma.poll.delete({ where: { id: poll.id } });
    }

    // Delete the user account
    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}