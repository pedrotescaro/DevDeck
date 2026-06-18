import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth';
import { ReactionService } from '@/services/reaction.service';

export const POST = apiHandler(async (req, { params }) => {
  const user = await requireAuth();
  const { id: postId } = await params;

  const body = await req.json();
  const { type } = body; // 'FIRE' | 'HEART' | 'LAUGH' | 'CLAP' | 'BULB' | null

  const reaction = await ReactionService.toggleReaction(user.id, postId, type);

  return NextResponse.json({ success: true, reaction });
});
