"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";
import ShareBar from "./ShareBar";

/** Full-screen, tap-through web story. slides: [{ image, fallback, text }] */
export default function StoryViewer({ slides, url, title }) {
  const [i, setI] = useState(0);
  const n = slides.length;

  useEffect(() => {
    const t = setTimeout(() => setI((x) => (x < n - 1 ? x + 1 : x)), 6000);
    return () => clearTimeout(t);
  }, [i, n]);

  const s = slides[i];
  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-black shadow-2xl">
        <img
          src={s.image}
          alt={s.text}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            if (e.currentTarget.src !== s.fallback) e.currentTarget.src = s.fallback;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/40" />

        <div className="absolute inset-x-3 top-3 flex gap-1">
          {slides.map((_, k) => (
            <span key={k} className="h-1 flex-1 overflow-hidden rounded bg-white/30">
              <span className={`block h-full bg-white ${k < i ? "w-full" : k === i ? "w-full origin-left animate-[grow_6s_linear]" : "w-0"}`} />
            </span>
          ))}
        </div>
        <Link href="/web-stories" aria-label="बंद करें" className="absolute right-3 top-7 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white">
          <FaTimes />
        </Link>

        <button aria-label="पिछला" className="absolute inset-y-0 left-0 w-1/3" onClick={() => setI((x) => Math.max(x - 1, 0))} />
        <button aria-label="अगला" className="absolute inset-y-0 right-0 w-1/3" onClick={() => setI((x) => Math.min(x + 1, n - 1))} />

        <p className="pointer-events-none absolute inset-x-0 bottom-0 p-5 text-xl font-extrabold leading-snug text-white">{s.text}</p>
      </div>
      <style>{`@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}`}</style>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-600">{i + 1} / {n}</span>
        <ShareBar url={url} title={title} />
      </div>
    </div>
  );
}
