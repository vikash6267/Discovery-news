import Link from "next/link";
import Img from "./Img";
import { imgOf, stockImg, truncate, fmtDate } from "@/lib/news";

/** Tag chip (section name) shown on cards. */
export function Tag({ children, className = "" }) {
  if (!children) return null;
  return <span className={`inline-block rounded bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white ${className}`}>{children}</span>;
}

/** Large card – image with the title below, or laid over the image when `overlay`. */
export function NewsCard({ news, label, overlay = false, words = 14, heightClass = "h-56", titleClass = "text-lg", priority = false }) {
  if (!news) return null;
  const date = fmtDate(news.publish || news.createdAt);
  const img = <Img src={imgOf(news)} fallback={stockImg(news)} alt={news.title} priority={priority} className={`w-full ${heightClass} object-cover transition-transform duration-500 group-hover:scale-105`} />;

  if (overlay) {
    return (
      <Link href={`/${news.slug}`} className="group relative block overflow-hidden rounded-xl bg-neutral-900 shadow-md">
        {img}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute bottom-0 p-4 text-white">
          <Tag className="mb-2">{label}</Tag>
          <h3 className={`font-extrabold leading-snug ${titleClass}`}>{truncate(news.title, words)}</h3>
          {date && <p className="mt-1 text-xs text-yellow-300">{date}</p>}
        </div>
      </Link>
    );
  }
  return (
    <Link href={`/${news.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-xl shadow-sm">
        {img}
        {label && <Tag className="absolute left-2 top-2">{label}</Tag>}
      </div>
      <h3 className={`mt-2 font-bold leading-snug transition-colors group-hover:text-red-600 ${titleClass}`}>{truncate(news.title, words)}</h3>
      {date && <p className="mt-1 text-xs text-gray-500">{date}</p>}
    </Link>
  );
}

/** Compact row – thumbnail beside the title. */
export function NewsRow({ news, words = 12, thumb = "w-24 h-16", showDate = true }) {
  if (!news) return null;
  return (
    <Link href={`/${news.slug}`} className="group flex gap-3 border-b border-gray-200 py-2.5 last:border-0">
      <Img src={imgOf(news)} fallback={stockImg(news)} alt="" className={`${thumb} shrink-0 rounded-md object-cover`} />
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-snug transition-colors group-hover:text-red-600">{truncate(news.title, words)}</p>
        {showDate && <p className="mt-1 text-[11px] text-gray-500">{fmtDate(news.publish || news.createdAt)}</p>}
      </div>
    </Link>
  );
}
