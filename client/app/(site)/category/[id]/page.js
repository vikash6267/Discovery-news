import Link from "next/link";
import { notFound } from "next/navigation";
import SectionTitle from "@/components/SectionTitle";
import { NewsCard } from "@/components/NewsCard";
import Sidebar from "@/components/Sidebar";
import AdSlot from "@/components/AdSlot";
import { getNewsList, getMenu, getAds, getPolls } from "@/lib/api";
import { buildSections, sectionKeyOf, byLatest } from "@/lib/news";
import { buildMeta, ogImageOf } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const revalidate = 60;
const PER_PAGE = 12;

async function load(id) {
  const [menu, list] = await Promise.all([getMenu(), getNewsList("limit=300")]);
  const section = buildSections(menu).find((s) => s.key === id);
  return { section, list };
}

export async function generateMetadata({ params, searchParams }) {
  const { section, list } = await load(params.id);
  if (!section) return { title: "श्रेणी नहीं मिली", robots: { index: false } };
  const page = Math.max(parseInt(searchParams?.page) || 1, 1);
  const first = list.filter((n) => sectionKeyOf(n) === section.key).sort(byLatest)[0];
  return buildMeta({
    title: `${section.label} की ताज़ा खबरें${page > 1 ? ` – पेज ${page}` : ""}`,
    description: `${section.label} की ताज़ा और बड़ी खबरें हिंदी में – MP Update।`,
    path: page > 1 ? `${section.href}?page=${page}` : section.href,
    image: first ? ogImageOf(first) : "/og.jpg",
  });
}

export default async function CategoryPage({ params, searchParams }) {
  const { section, list } = await load(params.id);
  if (!section) notFound();
  const [ads, polls] = await Promise.all([getAds(), getPolls()]);

  const items = list.filter((n) => sectionKeyOf(n) === section.key).sort(byLatest);
  const page = Math.max(parseInt(searchParams?.page) || 1, 1);
  const pages = Math.max(Math.ceil(items.length / PER_PAGE), 1);
  const slice = items.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${section.label} की ताज़ा खबरें`,
    url: `${SITE_URL}${section.href}`,
    mainEntity: { "@type": "ItemList", itemListElement: slice.map((n, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/${n.slug}`, name: n.title })) },
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <div className="min-w-0">
        <SectionTitle as="h1">{section.label}</SectionTitle>
        {slice.length === 0 && <p className="py-16 text-center text-gray-500">इस श्रेणी में अभी कोई खबर नहीं है।</p>}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {slice.map((n) => (
            <div key={n._id} className="rounded-xl bg-white p-3 shadow-sm">
              <NewsCard news={n} heightClass="h-44" titleClass="text-base" words={14} />
            </div>
          ))}
        </div>
        <AdSlot ads={ads} type="buttom-add" className="mt-8" />

        {pages > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={p === 1 ? section.href : `${section.href}?page=${p}`}
                className={`h-10 min-w-10 rounded-lg px-3 text-center text-sm font-bold leading-10 ${p === page ? "bg-red-600 text-white" : "bg-white text-gray-700 hover:bg-red-100"}`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
      <Sidebar news={list} ads={ads} poll={polls[0]} />
    </div>
  );
}
