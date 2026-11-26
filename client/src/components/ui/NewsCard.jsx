import { Link } from "react-router-dom";
import { imgProps, truncate, fmtDate } from "./news";

/** Large card: image with title below, or overlaid when `overlay`. */
export function NewsCard({ news, overlay = false, words = 14, heightClass = "h-56", titleClass = "text-lg" }) {
  if (!news) return null;
  const date = fmtDate(news.publish || news.createdAt);
  if (overlay) {
    return (
      <Link to={`/${news.slug}`} className="group relative block overflow-hidden rounded-xl shadow-md">
        <img {...imgProps(news)} alt={news.title} loading="lazy" className={`w-full ${heightClass} object-cover transition-transform duration-500 group-hover:scale-105`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute bottom-0 p-4 text-white">
          <h3 className={`font-bold leading-snug ${titleClass}`}>{truncate(news.title, words)}</h3>
          {date && <p className="text-xs text-yellow-300 mt-1">{date}</p>}
        </div>
      </Link>
    );
  }
  return (
    <Link to={`/${news.slug}`} className="group block">
      <div className="overflow-hidden rounded-xl shadow-sm">
        <img {...imgProps(news)} alt={news.title} loading="lazy" className={`w-full ${heightClass} object-cover transition-transform duration-500 group-hover:scale-105`} />
      </div>
      <h3 className={`mt-2 font-bold leading-snug group-hover:text-red-600 transition-colors ${titleClass}`}>{truncate(news.title, words)}</h3>
      {date && <p className="text-xs text-gray-500 mt-1">{date}</p>}
    </Link>
  );
}

/** Compact row: small thumbnail beside title. */
export function NewsRow({ news, words = 12, thumb = "w-24 h-16", showDate = true }) {
  if (!news) return null;
  return (
    <Link to={`/${news.slug}`} className="group flex gap-3 py-2.5 border-b border-gray-200 last:border-0">
      <img {...imgProps(news)} alt="" loading="lazy" className={`${thumb} shrink-0 rounded-md object-cover`} />
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-snug group-hover:text-red-600 transition-colors">{truncate(news.title, words)}</p>
        {showDate && <p className="text-[11px] text-gray-500 mt-1">{fmtDate(news.publish || news.createdAt)}</p>}
      </div>
    </Link>
  );
}
