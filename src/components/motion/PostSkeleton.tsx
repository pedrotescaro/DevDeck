export function PostSkeleton() {
  return (
    <div className="rounded-xl border border-dd-border bg-dd-surface p-5 space-y-4">
      <div className="flex gap-3">
        <div className="dd-skeleton w-8 h-8 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="dd-skeleton h-3 w-24" />
          <div className="dd-skeleton h-3 w-16" />
        </div>
      </div>
      <div className="dd-skeleton h-4 w-full" />
      <div className="dd-skeleton h-4 w-3/4" />
      <div className="dd-skeleton h-20 w-full rounded-lg" />
    </div>
  );
}

export function PostSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
}
