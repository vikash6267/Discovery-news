import SectionTitle from "@/components/SectionTitle";
import ShareBar from "@/components/ShareBar";
import { getVideos } from "@/lib/api";
import { ytId } from "@/lib/youtube";
import { SITE_URL } from "@/lib/site";
import { buildMeta } from "@/lib/seo";

export const revalidate = 300;
export const metadata = buildMeta({ title: "वीडियो न्यूज़", description: "MP Update की ताज़ा वीडियो खबरें – मध्य प्रदेश और देश-दुनिया।", path: "/video" });

export default async function VideoPage() {
  const videos = (await getVideos()).map((v) => ({ ...v, id: ytId(v.url) })).filter((v) => v.id);
  return (
    <div>
      <SectionTitle as="h1">वीडियो न्यूज़</SectionTitle>
      {videos.length === 0 && <p className="py-16 text-center text-gray-500">अभी कोई वीडियो नहीं है।</p>}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...videos].reverse().map((v) => (
          <div key={v._id} className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="aspect-video bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${v.id}`}
                title="MP Update वीडियो"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            <div className="p-3">
              <ShareBar url={`https://youtu.be/${v.id}`} title="MP Update वीडियो" />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-gray-500">
        और वीडियो के लिए हमारा <a className="font-bold text-red-600 underline" href="https://www.youtube.com/@MPupdate.official" target="_blank" rel="noopener noreferrer">YouTube चैनल</a> सब्सक्राइब करें। · {SITE_URL.replace("https://", "")}
      </p>
    </div>
  );
}
