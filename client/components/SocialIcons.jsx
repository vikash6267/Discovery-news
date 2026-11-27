import { FaInstagram, FaFacebookF, FaYoutube, FaGlobe } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SOCIAL } from "@/lib/site";

export const ICONS = { instagram: FaInstagram, facebook: FaFacebookF, youtube: FaYoutube, x: FaXTwitter, website: FaGlobe };

/** Round official-account buttons (Instagram, Facebook, YouTube, X, Website). */
export default function SocialIcons({ box = "h-10 w-10", icon = 18, className = "" }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {SOCIAL.map((s) => {
        const Icon = ICONS[s.key];
        return (
          <a
            key={s.key}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            title={s.label}
            className={`${box} ${s.color} grid place-items-center rounded-full text-white shadow-md ring-2 ring-white/70 transition-transform hover:scale-110`}
          >
            <Icon size={icon} />
          </a>
        );
      })}
    </div>
  );
}
