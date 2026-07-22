import { PostSkeletonList } from '@/components/motion/PostSkeleton';
import { Sidebar } from '@/components/Sidebar';

export default function FeedLoading() {
  return (
    <div className="dd-platform-shell" aria-busy="true">
      <Sidebar user={null} />

      <div className="flex min-w-0 flex-1 xl:max-w-[950px]">
        <main className="min-h-screen w-full max-w-[600px] border-r border-dd-border/80 pb-20">
          <div className="flex h-11 items-center border-b border-dd-border/60 px-8">
            <div className="dd-skeleton mx-auto h-3 w-20 rounded-full" />
            <div className="dd-skeleton mx-auto h-3 w-20 rounded-full" />
          </div>
          <div className="border-b border-dd-border/60 p-4 sm:p-5">
            <div className="flex gap-3">
              <div className="dd-skeleton h-10 w-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-3">
                <div className="dd-skeleton h-4 w-3/4 rounded-full" />
                <div className="dd-skeleton h-4 w-1/2 rounded-full" />
                <div className="flex justify-end pt-2">
                  <div className="dd-skeleton h-8 w-24 rounded-full" />
                </div>
              </div>
            </div>
          </div>
          <PostSkeletonList count={4} variant="feed" label="Carregando o feed" />
        </main>

        <aside className="sticky top-0 hidden h-screen w-[350px] shrink-0 space-y-6 p-5 xl:block">
          <div className="dd-skeleton h-11 w-full rounded-full" />
          <div className="dd-skeleton h-48 w-full rounded-2xl" />
          <div className="dd-skeleton h-56 w-full rounded-2xl" />
        </aside>
      </div>
    </div>
  );
}
