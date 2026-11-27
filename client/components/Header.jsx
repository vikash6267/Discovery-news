import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import SocialIcons from "./SocialIcons";
import QrCode from "./QrCode";
import Today from "./Today";
import { SITE_NAME, SITE_TAGLINE, SITE_URL, SOCIAL } from "@/lib/site";

const WEBSITE = SOCIAL.find((s) => s.key === "website")?.url || SITE_URL;

/** Red date/time bar → dark logo band with social hub → (red navbar is rendered by the layout). */
export default function Header() {
  return (
    <header>
      {/* 1. red top bar */}
      <div className="bg-red-600">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1">
          <Today />
          <Link href="/live-tv" className="flex items-center gap-1.5 rounded-full bg-red-700 px-3 py-0.5 text-xs font-extrabold tracking-wide text-white ring-1 ring-white/30 hover:bg-black sm:px-4 sm:py-1 sm:text-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> LIVE
          </Link>
        </div>
      </div>

      {/* 2. dark band: logo | follow us | (desktop) QR */}
      <div className="bg-gradient-to-r from-black via-neutral-950 to-red-950">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-3 py-3 sm:px-4 lg:gap-8">
          <Link href="/" aria-label={`${SITE_NAME} होम पेज`} className="shrink-0">
            <Image src={logo} alt={`${SITE_NAME} – ${SITE_TAGLINE}`} priority unoptimized className="h-20 w-auto rounded-xl sm:h-24 lg:h-28" />
          </Link>

          <span className="hidden h-24 w-px bg-gradient-to-b from-transparent via-yellow-400 to-transparent sm:block" />

          <div className="flex flex-1 flex-col items-center gap-2.5">
            <div className="flex w-full items-center justify-center gap-2 sm:gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-yellow-400" />
              <span className="whitespace-nowrap text-base font-extrabold text-white sm:text-xl">Follow Us On</span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-yellow-400" />
            </div>
            <SocialIcons className="justify-center" box="h-9 w-9 sm:h-11 sm:w-11" icon={18} />
            <a href={WEBSITE} target="_blank" rel="noopener noreferrer" className="rounded-full bg-yellow-400 px-5 py-1.5 text-sm font-extrabold text-black shadow-md ring-2 ring-yellow-200/60 hover:bg-yellow-300">
              Follow Us
            </a>
          </div>

          <div className="hidden shrink-0 items-center gap-3 text-white lg:flex">
            <span className="h-24 w-px bg-gradient-to-b from-transparent via-yellow-400 to-transparent" />
            <div className="text-center">
              <QrCode value={SITE_URL} size={92} />
              <p className="mt-1 text-xs font-bold text-yellow-300">स्कैन करें</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
