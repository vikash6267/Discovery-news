"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaSearch, FaEllipsisV, FaTimes } from "react-icons/fa";

/**
 * Red navigation bar (like Dainik Bhaskar):
 *   main  – the horizontal, swipeable row: होम · देश · 10 संभाग
 *   more  – the ⋮ menu: MP overview, politics, crime, sports ... video, live
 */
export default function Navbar({ main = [], more = [] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const rowRef = useRef(null);

  useEffect(() => setOpen(false), [pathname]);

  // keep the active item visible in the swipeable row
  useEffect(() => {
    const el = rowRef.current?.querySelector("[data-active='true']");
    if (el) el.scrollIntoView({ inline: "center", block: "nearest" });
  }, [pathname]);

  const active = (href) => pathname === href || pathname.startsWith(`${href}/`);
  const item = "relative whitespace-nowrap px-3 py-2.5 text-[15px] font-bold text-white transition-colors hover:text-yellow-300 sm:text-base";

  return (
    <nav className="sticky top-0 z-50 bg-red-600 shadow-lg">
      <div className="relative mx-auto flex max-w-7xl items-center px-3 sm:px-4">
        <Link href="/" className="flex shrink-0 items-center gap-1.5 py-2 pr-3 text-white" aria-label="होम" data-active={pathname === "/"}>
          <FaHome size={26} />
          <span className="text-lg font-extrabold text-yellow-300">होम</span>
        </Link>

        <div ref={rowRef} className="no-scrollbar flex min-w-0 flex-1 items-center divide-x divide-white/40 overflow-x-auto">
          {main.map((i) => (
            <Link key={i.href} href={i.href} data-active={active(i.href)} className={`${item} ${active(i.href) ? "text-yellow-300 after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:rounded-t after:bg-yellow-300" : ""}`}>
              {i.label}
            </Link>
          ))}
        </div>

        <button className="shrink-0 p-2.5 pl-3 text-white" onClick={() => setOpen(!open)} aria-label="और मेन्यू" aria-expanded={open}>
          {open ? <FaTimes size={22} /> : <FaEllipsisV size={22} />}
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute right-2 top-full z-50 mt-1 max-h-[75vh] w-64 overflow-y-auto rounded-xl bg-red-700 py-2 shadow-2xl ring-1 ring-black/20 sm:right-4">
              <Link href="/search" className="flex items-center gap-2 border-b border-white/15 px-4 py-3 font-semibold text-white hover:bg-black/20"><FaSearch size={14} /> खोजें</Link>
              {more.map((i) => (
                <Link key={i.href} href={i.href} className={`block border-b border-white/10 px-4 py-3 font-semibold hover:bg-black/20 ${active(i.href) ? "text-yellow-300" : "text-white"}`}>
                  {i.label}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
