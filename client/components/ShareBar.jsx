"use client";
import toast from "react-hot-toast";
import { FaFacebookF, FaWhatsapp, FaTelegramPlane, FaInstagram, FaLink } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

/**
 * Share buttons for articles, polls and web stories.
 * Instagram has no web "share URL", so it opens the phone's share sheet (pick Instagram) or copies the link.
 */
export default function ShareBar({ url, title, className = "" }) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title || "");
  const btn = "grid h-9 w-9 place-items-center rounded-full text-white transition-transform hover:scale-110";

  const copy = async (msg = "लिंक कॉपी हो गया") => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(msg);
    } catch {
      toast.error("लिंक कॉपी नहीं हो पाया");
    }
  };

  const instagram = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        return;
      }
    }
    copy("लिंक कॉपी हो गया – Instagram में पेस्ट करें");
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <a aria-label="WhatsApp पर शेयर करें" href={`https://wa.me/?text=${t}%0A${u}`} target="_blank" rel="noopener noreferrer" className={`${btn} bg-green-600`}><FaWhatsapp /></a>
      <a aria-label="Facebook पर शेयर करें" href={`https://www.facebook.com/sharer/sharer.php?u=${u}`} target="_blank" rel="noopener noreferrer" className={`${btn} bg-blue-700`}><FaFacebookF /></a>
      <a aria-label="X पर शेयर करें" href={`https://x.com/intent/post?text=${t}&url=${u}`} target="_blank" rel="noopener noreferrer" className={`${btn} bg-black`}><FaXTwitter /></a>
      <button aria-label="Instagram पर शेयर करें" onClick={instagram} className={`${btn} bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600`}><FaInstagram /></button>
      <a aria-label="Telegram पर शेयर करें" href={`https://t.me/share/url?url=${u}&text=${t}`} target="_blank" rel="noopener noreferrer" className={`${btn} bg-sky-500`}><FaTelegramPlane /></a>
      <button aria-label="लिंक कॉपी करें" onClick={() => copy()} className={`${btn} bg-gray-600`}><FaLink /></button>
    </div>
  );
}
