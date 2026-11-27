"use client";
import toast from "react-hot-toast";
import { FaFacebookF, FaWhatsapp, FaTelegramPlane, FaInstagram, FaLink } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SOCIAL } from "@/lib/site";

const link = (k) => SOCIAL.find((x) => x.key === k)?.url || "";

// WhatsApp / Telegram message: bold headline (*...*), the story link, then our follow links.
export const shareMessage = (title, url) =>
  `*${title}*
${url}

*हमारी खबरों की सबसे पहले अपडेट्स के लिए हमें फॉलो करें*

` +
  `*इंस्टाग्राम :* ${link("instagram")}
*X लिंक:* ${link("x")}
*Youtube :* ${link("youtube")}
*Facebook :* ${link("facebook")}`;

/**
 * Share buttons for articles, polls and web stories.
 * Instagram has no web "share URL", so it opens the phone's share sheet (pick Instagram) or copies the link.
 */
export default function ShareBar({ url, title, image, className = "" }) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title || "");
  const btn = "grid h-9 w-9 place-items-center rounded-full text-white transition-transform hover:scale-110";

  const message = shareMessage(title || "", url);

  const copy = async (msg = "लिंक कॉपी हो गया") => {
    try {
      await navigator.clipboard.writeText(message);
      toast.success(msg);
    } catch {
      toast.error("लिंक कॉपी नहीं हो पाया");
    }
  };

  // Instagram has no "share this link" URL (unlike Facebook / X). The closest thing to direct sharing:
  //  1) hand the story PHOTO to the phone's share sheet -> choose Instagram (Story / Post / Message),
  //  2) the caption (headline + link) is copied, so it can be pasted in Instagram.
  const instagram = async () => {
    const caption = message;
    try { await navigator.clipboard.writeText(caption); } catch {}

    if (image && navigator.canShare) {
      try {
        const blob = await (await fetch(image)).blob();
        const file = new File([blob], "mpupdate.jpg", { type: blob.type || "image/jpeg" });
        if (navigator.canShare({ files: [file] })) {
          toast.success("कैप्शन कॉपी हो गया – Instagram में पेस्ट करें", { duration: 4000 });
          await navigator.share({ files: [file], title, text: caption });
          return;
        }
      } catch (e) {
        if (e && e.name === "AbortError") return; // user closed the share sheet
      }
    }
    if (navigator.share) {
      try { await navigator.share({ title, text: message }); } catch {}
      return;
    }
    toast.success("लिंक कॉपी हो गया – Instagram खुल रहा है, वहाँ पेस्ट करें", { duration: 4000 });
    window.open("https://www.instagram.com/", "_blank", "noopener");
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <a aria-label="WhatsApp पर शेयर करें" href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" className={`${btn} bg-green-600`}><FaWhatsapp /></a>
      <a aria-label="Facebook पर शेयर करें" href={`https://www.facebook.com/sharer/sharer.php?u=${u}`} target="_blank" rel="noopener noreferrer" className={`${btn} bg-blue-700`}><FaFacebookF /></a>
      <a aria-label="X पर शेयर करें" href={`https://x.com/intent/post?text=${t}&url=${u}`} target="_blank" rel="noopener noreferrer" className={`${btn} bg-black`}><FaXTwitter /></a>
      <button aria-label="Instagram पर शेयर करें" onClick={instagram} className={`${btn} bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600`}><FaInstagram /></button>
      <a aria-label="Telegram पर शेयर करें" href={`https://t.me/share/url?url=${u}&text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" className={`${btn} bg-sky-500`}><FaTelegramPlane /></a>
      <button aria-label="लिंक कॉपी करें" onClick={() => copy()} className={`${btn} bg-gray-600`}><FaLink /></button>
    </div>
  );
}
