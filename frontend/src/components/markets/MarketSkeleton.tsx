export function MarketSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-20 animate-pulse rounded-[2rem] bg-slate-100" />
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="h-28 animate-pulse rounded-[2rem] bg-slate-100" />
      ))}
    </div>
  );
}
