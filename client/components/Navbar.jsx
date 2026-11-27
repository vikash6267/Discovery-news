"use client";
import { useState } from "react";
import Link from "next/link";
import { FaHome, FaSearch, FaBars, FaTimes, FaChevronDown } from "react-icons/fa";

const MAX_VISIBLE = 6;

/** Red navigation bar. items: [{ label, href }] – built on the server from the real categories. */
export default function Navbar({ items }) {
  const [open, setOpen] = useState(false);
  const visible = items.slice(0, MAX_VISIBLE);
  const more = items.slice(MAX_VISIBLE);
  const link = "whitespace-nowrap px-3 py-2.5 text-[15px] font-bold text-white transition-colors hover:text-yellow-300 sm:text-base";

  return (
    <nav className="sticky top-0 z-50 bg-red-600 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-4">
        <div className="flex min-w-0 flex-1 items-center">
          <Link href="/" className="flex shrink-0 items-center gap-1.5 py-2 pr-3 text-white" aria-label="होम">
            <FaHome size={26} />
            <span className="text-lg font-extrabold text-yellow-300">होम</span>
          </Link>

          {/* mobile: swipeable row; desktop: first items + "और" menu */}
          <div className="no-scrollbar flex min-w-0 flex-1 items-center divide-x divide-white/40 overflow-x-auto lg:overflow-visible">
            {items.map((i, idx) => (
              <Link key={i.href} href={i.href} className={`${link} ${idx >= MAX_VISIBLE ? "lg:hidden" : ""}`}>
                {i.label}
              </Link>
            ))}
            {more.length > 0 && (
              <div className="group relative hidden lg:block">
                <button className={`${link} flex items-center gap-1`}>
                  और <FaChevronDown size={10} />
                </button>
                <div className="absolute left-0 top-full hidden max-h-[70vh] w-56 overflow-y-auto bg-red-700 py-2 shadow-xl group-hover:block">
                  {more.map((i) => (
                    <Link key={i.href} href={i.href} className="block px-4 py-2 text-sm font-semibold text-white hover:bg-black">
                      {i.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 pl-2">
          <Link href="/search" aria-label="खोजें" className="hidden rounded-full p-2.5 text-white hover:bg-white/15 lg:block">
            <FaSearch size={18} />
          </Link>
          <button className="p-2.5 text-white lg:hidden" onClick={() => setOpen(!open)} aria-label="मेन्यू">
            {open ? <FaTimes size={26} /> : <FaBars size={28} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/20 bg-red-700 lg:hidden">
          <Link href="/search" onClick={() => setOpen(false)} className="flex items-center gap-2 border-b border-white/10 px-5 py-3 font-semibold text-white"><FaSearch /> खोजें</Link>
          {items.map((i) => (
            <Link key={i.href} href={i.href} onClick={() => setOpen(false)} className="block border-b border-white/10 px-5 py-3 font-semibold text-white">
              {i.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
