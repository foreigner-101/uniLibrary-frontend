export default function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card skeleton-card" aria-hidden="true">
          <div className="skeleton-line skeleton-line-title" />
          <div className="skeleton-line skeleton-line-sub" />
        </div>
      ))}
    </div>
  );
}
