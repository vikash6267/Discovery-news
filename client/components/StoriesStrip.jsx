import Link from "next/link";
import Img from "./Img";
import SectionTitle from "./SectionTitle";
import { stockImg, isDeadImg } from "@/lib/news";

export const storyCover = (s) => {
  const url = s?.images?.[0]?.url;
  return isDeadImg(url) ? stockImg({ _id: s?._id, title: Array.isArray(s?.title) ? s.title[0] : s?.title }) : url.replace(/^http:\/\//, "https://");
};
export const storyTitle = (s) => (Array.isArray(s?.title) ? s.title[0] : s?.title) || "वेब स्टोरी";

export default function StoriesStrip({ stories = [] }) {
  if (!stories.length) return null;
  return (
    <section>
      <SectionTitle href="/web-stories">वेब स्टोरीज़</SectionTitle>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {stories.slice(0, 12).map((s) => (
          <Link key={s._id} href={`/web-stories/${s._id}`} className="group relative block h-56 w-36 shrink-0 overflow-hidden rounded-xl bg-neutral-900 shadow-md">
            <Img src={storyCover(s)} fallback={stockImg({ _id: s._id })} alt={storyTitle(s)} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />
            <p className="absolute bottom-0 p-2.5 text-xs font-bold leading-snug text-white">{storyTitle(s)}</p>
            <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">STORY</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
