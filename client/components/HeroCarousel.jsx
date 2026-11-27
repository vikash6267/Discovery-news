"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaStar, FaArrowRight } from "react-icons/fa";

/** Big "टॉप स्टोरी" slider: photo, two-colour headline, place | date and a "पढ़ें पूरी खबर" button. */
export default function HeroCarousel({ slides }) {
  const [i, setI] = useState(0);
  const n = slides.length;

  useEffect(() => {
    if (n < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n, i]);

  if (!n) return null;
  const s = slides[i];
  const words = s.title.split(" ");
  const cut = Math.max(Math.ceil(words.length / 2), 1);
  const first = words.slice(0, cut).join(" ");
  const second = words.slice(cut).join(" ");

  return (
    <div>
      <div className="group relative overflow-hidden rounded-2xl bg-neutral-900 shadow-lg">
        <Link href={`/${s.slug}`} aria-label={s.title}>
          <img
            key={s._id}
            src={s.img}
            alt={s.title}
            fetchPriority="high"
            className="h-56 w-full object-cover sm:h-[28rem] lg:h-[32rem]"
            onError={(e) => {
              if (e.currentTarget.src !== s.fallback) e.currentTarget.src = s.fallback;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10" />
        </Link>

        <span className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-lg bg-red-600 px-2.5 py-1 text-xs font-extrabold text-white shadow sm:left-5 sm:top-5 sm:px-3 sm:py-1.5 sm:text-sm">
          <FaStar className="text-yellow-300" /> टॉप स्टोरी
        </span>

        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-7">
          <Link href={`/${s.slug}`}>
            <h2 className="text-lg font-extrabold leading-snug text-white drop-shadow sm:text-4xl sm:leading-tight lg:text-5xl">
              {first} {second && <span className="text-yellow-400">{second}</span>}
            </h2>
          </Link>
          <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 sm:mt-3 sm:gap-3">
            <p className="text-xs font-semibold text-white sm:text-base">
              {s.location && <>{s.location} <span className="mx-1.5 text-white/60">|</span></>}
              {s.date}
            </p>
            <Link href={`/${s.slug}`} className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-extrabold text-white shadow hover:bg-red-700 sm:gap-2 sm:px-4 sm:py-2 sm:text-base">
              पढ़ें पूरी खबर <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>

      {n > 1 && (
        <div className="mt-2 flex justify-center gap-2 sm:mt-3">
          {slides.map((_, k) => (
            <button key={k} aria-label={`स्लाइड ${k + 1}`} onClick={() => setI(k)} className={`h-2.5 rounded-full transition-all ${k === i ? "w-6 bg-red-600" : "w-2.5 bg-gray-300 hover:bg-gray-400"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
