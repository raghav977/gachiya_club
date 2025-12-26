/**
 * Skeleton placeholder component with shimmer animation.
 * Variants: 'card' | 'row' | 'text' (default)
 */
export default function Skeleton({ variant = "text", className = "", count = 1 }) {
  const shimmer =
    "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

  // Card variant — image placeholder + title + subtitle
  if (variant === "card") {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 space-y-4"
          >
            {/* Image placeholder */}
            <div
              className={`w-full h-44 rounded-xl bg-gray-200 ${shimmer}`}
            />
            {/* Title */}
            <div className={`h-5 w-3/4 rounded-md bg-gray-200 ${shimmer}`} />
            {/* Subtitle */}
            <div className={`h-4 w-1/2 rounded-md bg-gray-200 ${shimmer}`} />
            {/* Button placeholder */}
            <div className={`h-9 w-28 rounded-full bg-gray-200 ${shimmer}`} />
          </div>
        ))}
      </div>
    );
  }

  // Row variant — avatar + two text lines + action
  if (variant === "row") {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-100"
          >
            {/* Avatar */}
            <div className={`w-12 h-12 rounded-full bg-gray-200 ${shimmer}`} />
            {/* Text lines */}
            <div className="flex-1 space-y-2">
              <div className={`h-4 w-2/5 rounded bg-gray-200 ${shimmer}`} />
              <div className={`h-3 w-1/4 rounded bg-gray-200 ${shimmer}`} />
            </div>
            {/* Action button */}
            <div className={`h-8 w-20 rounded-lg bg-gray-200 ${shimmer}`} />
          </div>
        ))}
      </div>
    );
  }

  // Default text line variant
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`h-4 w-full rounded bg-gray-200 ${shimmer}`} />
      ))}
    </div>
  );
}
