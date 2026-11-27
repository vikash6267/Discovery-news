"use client";

/** <img> that swaps to a fallback photo if the original fails to load. */
export default function Img({ src, fallback, alt = "", className = "", priority = false }) {
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={className}
      onError={(e) => {
        if (fallback && e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
      }}
    />
  );
}
