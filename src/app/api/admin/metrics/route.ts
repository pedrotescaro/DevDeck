import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { requireAdmin } from '@/lib/auth';
import { AdminService } from '@/services/admin.service';

export const GET = apiHandler(async () => {
  await requireAdmin();
  const metrics = await AdminService.getDashboardMetrics();
  return NextResponse.json(metrics);
});
