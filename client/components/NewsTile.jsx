import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import Img from "./Img";
import { imgOf, stockImg, truncate, fmtDate } from "@/lib/news";

/** Square-ish photo tile: headline + date over the picture and a red arrow button. */
export default function NewsTile({ news, heightClass = "h-48 sm:h-56" }) {
  if (!news) return null;
  return (
    <Link href={`/${news.slug}`} className="group relative block overflow-hidden rounded-xl bg-neutral-900 shadow-md">
      <Img src={imgOf(news)} fallback={stockImg(news)} alt={news.title} className={`w-full ${heightClass} object-cover transition-transform duration-500 group-hover:scale-105`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3 pr-12">
        <h3 className="text-[15px] font-extrabold leading-snug text-white sm:text-lg">{truncate(news.title, 11)}</h3>
        <p className="mt-1 text-xs font-semibold text-white/90 sm:text-sm">{fmtDate(news.publish || news.createdAt)}</p>
      </div>
      <span className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-red-600 text-white transition-transform group-hover:translate-x-0.5">
        <FaArrowRight size={13} />
      </span>
    </Link>
  );
}
