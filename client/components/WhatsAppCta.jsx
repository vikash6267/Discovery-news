import Link from "next/link";
import { FaWhatsapp, FaArrowRight } from "react-icons/fa";
import { WHATSAPP_NUMBER } from "@/lib/site";

/** Green call-to-action: readers send a story / local problem. Uses wa.me when a number is configured. */
export default function WhatsAppCta() {
  const href = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("नमस्कार MP Update, मेरी खबर/सूचना: ")}`
    : "/contact";
  const external = Boolean(WHATSAPP_NUMBER);
  const Tag = external ? "a" : Link;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-gradient-to-r from-green-700 to-green-600 p-3 text-white shadow-md sm:p-4">
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-green-600 sm:h-16 sm:w-16">
        <FaWhatsapp size={36} />
      </span>
      <div className="min-w-[180px] flex-1">
        <p className="text-xl font-extrabold leading-tight sm:text-2xl">
          आपकी खबर, <span className="text-yellow-300">हमारी आवाज़</span>
        </p>
        <p className="text-sm text-green-50 sm:text-base">कोई खबर, जनसमस्या या सूचना है? हमें भेजें…</p>
      </div>
      <Tag
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-extrabold text-black shadow hover:bg-yellow-300 sm:text-base"
      >
        WhatsApp पर मैसेज करें <FaArrowRight />
      </Tag>
    </div>
  );
}
