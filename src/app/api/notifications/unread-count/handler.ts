import { NextResponse } from 'next/server';
import type { ApiContext } from '@/lib/api-handler';
import { getErrorSummary, isTransientConnectionError } from '@/lib/connection-errors';
import { logger } from '@/lib/logger';
import { NotificationService } from '@/services/notification.service';

export async function handleUnreadCountRequest(_request: Request, { session }: ApiContext) {
  if (!session) {
    return NextResponse.json({ count: 0 });
  }

  try {
    const count = await NotificationService.getUnreadCount(session.id);
    return NextResponse.json({ count });
  } catch (error) {
    if (!isTransientConnectionError(error)) {
      throw error;
    }

    logger.warn('Notification unread count temporarily unavailable', getErrorSummary(error));

    return NextResponse.json({ count: 0 });
  }
}
