import Link from "next/link";
import AdLink from "./AdLink";
import { isDeadImg } from "@/lib/news";

/**
 * Advertisement space.
 * type: "header-add" | "right-add" | "buttom-add" | "article-add"  (set when creating an ad in the admin panel)
 * When no ad is booked for the slot a tidy "advertise here" box is shown.
 */
const SIZES = {
  "header-add": "min-h-[70px] sm:min-h-[90px]",
  "right-add": "min-h-[250px]",
  "buttom-add": "min-h-[90px]",
  "article-add": "min-h-[120px]",
};

export default function AdSlot({ ads = [], type, className = "" }) {
  const list = ads.filter((a) => a?.type === type && !isDeadImg(a.image));
  const size = SIZES[type] || "min-h-[90px]";

  if (!list.length) {
    return (
      <div className={`${size} ${className} flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white/60 p-3 text-center text-gray-400`}>
        <span className="text-[10px] font-bold uppercase tracking-widest">विज्ञापन</span>
        <Link href="/contact" className="text-sm font-semibold text-gray-500 hover:text-red-600">
          अपना विज्ञापन यहाँ दें
        </Link>
      </div>
    );
  }
  return (
    <div className={`${className} space-y-3`}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">विज्ञापन</p>
      {list.map((ad) => (
        <AdLink key={ad._id} id={ad._id} href={ad.url} src={ad.image} />
      ))}
    </div>
  );
}
