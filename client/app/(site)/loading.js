// Shown instantly while the next page is being prepared (so navigation never looks frozen).
export default function Loading() {
  return (
    <div className="grid animate-pulse gap-8 lg:grid-cols-[1fr_340px]" aria-busy="true" aria-label="लोड हो रहा है">
      <div className="space-y-5">
        <div className="h-72 rounded-2xl bg-gray-200 sm:h-[26rem]" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-40 rounded-xl bg-gray-200" />)}
        </div>
        <div className="h-6 w-1/3 rounded bg-gray-200" />
        <div className="h-40 rounded-xl bg-gray-200" />
      </div>
      <div className="hidden space-y-4 lg:block">
        <div className="h-96 rounded-xl bg-gray-200" />
        <div className="h-60 rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}
