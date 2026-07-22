import { Sidebar } from '@/components/Sidebar';

export default function PlatformLoading() {
  return (
    <div className="dd-platform-shell" aria-busy="true" aria-label="Carregando pagina">
      <Sidebar user={null} />

      <div className="flex min-w-0 flex-1 xl:max-w-[950px]">
        <main className="min-h-screen w-full max-w-[600px] border-r border-dd-border/80">
          <div className="flex h-14 items-center border-b border-dd-border/60 px-5">
            <div className="dd-skeleton h-4 w-32 rounded-full" />
          </div>

          <div className="space-y-5 p-5">
            <div className="dd-skeleton h-11 w-full rounded-full" />
            <div className="grid grid-cols-2 gap-3">
              <div className="dd-skeleton h-24 rounded-2xl" />
              <div className="dd-skeleton h-24 rounded-2xl" />
            </div>

            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-2xl border border-dd-border/60 bg-dd-bg p-4">
                <div className="flex items-center gap-3">
                  <div className="dd-skeleton h-10 w-10 shrink-0 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="dd-skeleton h-3 w-1/3 rounded-full" />
                    <div className="dd-skeleton h-2.5 w-1/4 rounded-full" />
                  </div>
                </div>
                <div className="mt-4 space-y-2.5">
                  <div className="dd-skeleton h-3 w-full rounded-full" />
                  <div className="dd-skeleton h-3 w-4/5 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </main>

        <aside className="sticky top-0 hidden h-screen w-[350px] shrink-0 space-y-5 p-5 xl:block">
          <div className="dd-skeleton h-11 w-full rounded-full" />
          <div className="dd-skeleton h-52 w-full rounded-2xl" />
          <div className="dd-skeleton h-64 w-full rounded-2xl" />
        </aside>
      </div>
    </div>
  );
}
