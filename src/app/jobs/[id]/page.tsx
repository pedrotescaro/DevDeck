import { notFound, redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { JobService } from '@/services/job.service';
import { JobDetailContent } from './JobDetailContent';

interface JobPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: JobPageProps) {
  const { id: jobId } = await params;
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  const job = await JobService.getJobById(jobId, user.id);
  if (!job) {
    notFound();
  }

  return <JobDetailContent user={user} job={job} />;
}
