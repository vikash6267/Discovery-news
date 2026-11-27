"use client";
import { useEffect, useState } from "react";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";

/** Live date + clock for the red top bar (rendered in the visitor's own time zone). */
export default function Today() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const date = now ? now.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).replace(/,/g, "") : "";
  const time = now ? now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "";

  return (
    <div className="flex items-center gap-3 text-xs font-semibold text-white sm:text-base" suppressHydrationWarning>
      <span className="flex items-center gap-2"><FaRegCalendarAlt />{date}</span>
      <span className="h-4 w-px bg-white/60" />
      <span className="flex items-center gap-2"><FaRegClock />{time}</span>
    </div>
  );
}
