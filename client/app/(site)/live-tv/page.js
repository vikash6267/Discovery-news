import SectionTitle from "@/components/SectionTitle";
import { getLive } from "@/lib/api";
import { ytId } from "@/lib/youtube";
import { buildMeta } from "@/lib/seo";

export const revalidate = 60;
export const metadata = buildMeta({ title: "Live TV", description: "MP Update लाइव – सीधा प्रसारण।", path: "/live-tv" });

export default async function LivePage() {
  const streams = await getLive();
  return (
    <div>
      <SectionTitle as="h1">Live TV</SectionTitle>
      {streams.length === 0 && <p className="py-16 text-center text-gray-500">अभी कोई लाइव प्रसारण नहीं चल रहा है।</p>}
      <div className="grid gap-6 lg:grid-cols-2">
        {streams.map((s) => {
          const id = ytId(s.url);
          return (
            <div key={s._id} className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="aspect-video bg-black">
                {id ? (
                  <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=0`} title={s.name} allowFullScreen className="h-full w-full" />
                ) : (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="grid h-full place-items-center text-white underline">लाइव देखें</a>
                )}
              </div>
              <p className="flex items-center gap-2 p-3 font-bold"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-600" />{s.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
