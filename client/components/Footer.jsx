import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import QrCode from "./QrCode";
import { ICONS } from "./SocialIcons";
import { SOCIAL, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-12 border-t-4 border-red-600 bg-black text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Link href="/" aria-label="होम">
            <Image src={logo} alt={SITE_NAME} unoptimized className="h-24 w-auto" />
          </Link>
          <p className="mt-2 font-semibold text-yellow-400">{SITE_TAGLINE}</p>
          <nav className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link href="/" className="hover:text-white">होम</Link>
            <Link href="/web-stories" className="hover:text-white">वेब स्टोरीज़</Link>
            <Link href="/video" className="hover:text-white">वीडियो</Link>
            <Link href="/live-tv" className="hover:text-white">Live TV</Link>
            <Link href="/search" className="hover:text-white">खोजें</Link>
            <Link href="/contact" className="hover:text-white">संपर्क / विज्ञापन</Link>
          </nav>
        </div>

        {/* social hub: every official account with its own QR code */}
        <div>
          <h2 className="mb-4 text-lg font-extrabold text-white">सोशल हब – हमसे जुड़ें</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {SOCIAL.map((s) => {
              const Icon = ICONS[s.key];
              return (
                <div key={s.key} className="flex flex-col items-center gap-2">
                  <QrCode value={s.url} size={92} />
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-bold text-white hover:text-yellow-400">
                    <Icon /> {s.label}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="bg-neutral-950 py-3 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {SITE_NAME} · mpupdate.com — सर्वाधिकार सुरक्षित
      </div>
    </footer>
  );
}
