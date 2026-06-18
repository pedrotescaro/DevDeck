import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { NotificationService } from '@/services/notification.service';

export const GET = apiHandler(async (req, { session }) => {
  if (!session) {
    return NextResponse.json({ count: 0 });
  }

  const count = await NotificationService.getUnreadCount(session.id);

  return NextResponse.json({ count });
});
