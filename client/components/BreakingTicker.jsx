"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaBolt, FaAngleDoubleRight, FaChevronLeft } from "react-icons/fa";

// Where a breaking headline opens: the linked story (set in Admin → ब्रेकिंग न्यूज़), else a search for the headline.
const hrefOf = (item) => {
  const u = (item.url || "").trim();
  if (u) return u;
  return `/search?q=${encodeURIComponent(item.name.split(" ").slice(0, 4).join(" "))}`;
};

/**
 * Black strip, white text, red "ब्रेकिंग न्यूज़" tab.
 * - the COMPLETE headline is always shown (it wraps on mobile, never cut off);
 * - tapping the headline opens the full story;
 * - rotates every 6s, arrows move between headlines.
 */
export default function BreakingTicker({ items }) {
  const [i, setI] = useState(0);
  const n = items.length;

  useEffect(() => {
    if (n < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n, i]);

  if (!n) return null;
  const item = items[i % n];
  const href = hrefOf(item);
  const external = /^https?:\/\//.test(href);
  const Headline = external ? "a" : Link;

  return (
    <div id="breaking" className="border-y border-red-700/60 bg-black shadow-md">
      <div className="mx-auto flex max-w-7xl items-stretch">
        <div className="flex shrink-0 items-center gap-1.5 bg-red-600 px-2.5 text-[13px] font-extrabold text-white [clip-path:polygon(0_0,100%_0,calc(100%-14px)_100%,0_100%)] sm:gap-2 sm:px-5 sm:pr-9 sm:text-lg">
          <FaBolt className="text-yellow-300" />
          <span className="leading-tight">ब्रेकिंग<br className="sm:hidden" /> न्यूज़</span>
        </div>

        <Headline
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="group min-w-0 flex-1 px-3 py-2.5 sm:py-3"
          aria-label={`पूरी खबर पढ़ें: ${item.name}`}
        >
          <span className="block break-words text-[15px] font-bold leading-snug text-white group-hover:text-yellow-300 sm:text-lg">{item.name}</span>
          <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-wide text-yellow-400 sm:text-xs">पूरी खबर पढ़ें →</span>
        </Headline>

        {n > 1 && (
          <div className="flex shrink-0 flex-col items-center justify-center gap-0.5 border-l border-white/15 px-2 text-white sm:flex-row sm:gap-1 sm:px-3">
            <button aria-label="पिछली खबर" onClick={() => setI((x) => (x - 1 + n) % n)} className="p-1 hover:text-yellow-300"><FaChevronLeft size={13} /></button>
            <span className="text-[11px] font-semibold text-gray-400">{(i % n) + 1}/{n}</span>
            <button aria-label="अगली खबर" onClick={() => setI((x) => (x + 1) % n)} className="p-1 hover:text-yellow-300"><FaAngleDoubleRight size={16} /></button>
          </div>
        )}
      </div>
    </div>
  );
}
