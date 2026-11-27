import SectionTitle from "@/components/SectionTitle";
import { NewsCard, NewsRow } from "@/components/NewsCard";
import NewsTile from "@/components/NewsTile";
import HeroCarousel from "@/components/HeroCarousel";
import WhatsAppCta from "@/components/WhatsAppCta";
import Sidebar from "@/components/Sidebar";
import AdSlot from "@/components/AdSlot";
import StoriesStrip from "@/components/StoriesStrip";
import { getNewsList, getMenu, getAds, getPolls, getStories } from "@/lib/api";
import { buildSections, sectionKeyOf, byLatest, imgOf, stockImg, fmtDate } from "@/lib/news";

export const revalidate = 60;

export default async function Home() {
  const [list, menu, ads, polls, stories] = await Promise.all([getNewsList("limit=300"), getMenu(), getAds(), getPolls(), getStories()]);
  const news = [...list].sort(byLatest);
  const sections = buildSections(menu);

  if (!news.length) {
    return <p className="py-24 text-center text-lg text-gray-500">खबरें लोड हो रही हैं… कृपया कुछ देर बाद पुनः प्रयास करें।</p>;
  }

  // 1) biggest stories first (lead = big-news, then top-news, then the newest) – shown as the large slider
  const rank = (n) => (n.type === "big-news" ? 0 : n.type === "top-news" ? 1 : 2);
  const ordered = [...news].sort((a, b) => rank(a) - rank(b) || byLatest(a, b));
  const heroNews = ordered.slice(0, 5);
  const slides = heroNews.map((n) => ({
    _id: n._id,
    slug: n.slug,
    title: n.title,
    location: n.location,
    date: fmtDate(n.publish || n.createdAt),
    img: imgOf(n),
    fallback: stockImg(n),
  }));

  // 2) the next four, as photo tiles directly below the slider
  const used = new Set(heroNews.map((n) => n._id));
  const tiles = news.filter((n) => !used.has(n._id)).slice(0, 4);

  // 3) everything else section by section (MP, politics, national incl. other states, world, ...)
  const blocks = sections
    .map((s) => ({ ...s, items: news.filter((n) => sectionKeyOf(n) === s.key).slice(0, 5) }))
    .filter((b) => b.items.length > 0);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="min-w-0 space-y-8">
        <HeroCarousel slides={slides} />

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {tiles.map((n) => (
            <NewsTile key={n._id} news={n} />
          ))}
        </div>

        <WhatsAppCta />
        <AdSlot ads={ads} type="header-add" />

        {blocks.map((b, idx) => (
          <div key={b.key} className="space-y-8">
            <section>
              <SectionTitle href={b.href}>{b.label}</SectionTitle>
              <div className="grid gap-5 md:grid-cols-5">
                <div className="md:col-span-3">
                  <NewsCard news={b.items[0]} heightClass="h-52 md:h-64" titleClass="text-lg" words={16} />
                </div>
                <div className="md:col-span-2">
                  {b.items.slice(1).map((n) => (
                    <NewsRow key={n._id} news={n} />
                  ))}
                </div>
              </div>
            </section>
            {idx === 1 && <StoriesStrip stories={stories} />}
            {idx === 2 && <AdSlot ads={ads} type="buttom-add" />}
          </div>
        ))}
      </div>

      <Sidebar news={news} ads={ads} poll={polls[0]} />
    </div>
  );
}
