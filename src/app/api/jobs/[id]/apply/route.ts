import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth';
import { JobService } from '@/services/job.service';

export const POST = apiHandler(async (_req, { params }) => {
  const user = await requireAuth();
  const { id: jobId } = await params;

  const application = await JobService.applyForJob(user.id, jobId);

  return NextResponse.json({
    success: true,
    message: 'Inscrição realizada com sucesso! Seu portfólio da plataforma foi vinculado.',
    application,
  });
});
