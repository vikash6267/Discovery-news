import Link from "next/link";
import Img from "@/components/Img";
import SectionTitle from "@/components/SectionTitle";
import { storyCover, storyTitle } from "@/components/StoriesStrip";
import { getStories } from "@/lib/api";
import { stockImg } from "@/lib/news";
import { buildMeta } from "@/lib/seo";

export const revalidate = 120;
export const metadata = buildMeta({ title: "वेब स्टोरीज़", description: "MP Update की वेब स्टोरीज़ – तस्वीरों में ताज़ा खबरें।", path: "/web-stories" });

export default async function StoriesPage() {
  const stories = await getStories();
  return (
    <div>
      <SectionTitle as="h1">वेब स्टोरीज़</SectionTitle>
      {stories.length === 0 && <p className="py-16 text-center text-gray-500">अभी कोई वेब स्टोरी नहीं है।</p>}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {[...stories].reverse().map((s) => (
          <Link key={s._id} href={`/web-stories/${s._id}`} className="group relative block aspect-[9/16] overflow-hidden rounded-xl bg-neutral-900 shadow-md">
            <Img src={storyCover(s)} fallback={stockImg({ _id: s._id })} alt={storyTitle(s)} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />
            <p className="absolute bottom-0 p-3 text-sm font-bold leading-snug text-white">{storyTitle(s)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
