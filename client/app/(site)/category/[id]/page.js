import Link from "next/link";
import { notFound } from "next/navigation";
import SectionTitle from "@/components/SectionTitle";
import { NewsCard } from "@/components/NewsCard";
import Sidebar from "@/components/Sidebar";
import AdSlot from "@/components/AdSlot";
import { getNewsList, getMenu, getAds, getPolls } from "@/lib/api";
import { findSection, divisionsOf, sectionKeyOf, byLatest } from "@/lib/news";
import { buildMeta, ogImageOf } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const revalidate = 60;
const PER_PAGE = 12;

async function load(id, district) {
  const [menu, list] = await Promise.all([getMenu(), getNewsList("limit=300")]);
  const section = findSection(menu, id);
  const sub = section?.kind === "division" ? section.districts.find((d) => d._id === district) : null;
  let items = [];
  if (section) {
    items = section.kind === "division"
      ? list.filter((n) => n?.category?._id === id && (!sub || n?.subcategory?._id === sub._id))
      : list.filter((n) => sectionKeyOf(n) === section.key);
    items = items.sort(byLatest);
  }
  return { menu, list, section, sub, items };
}

export async function generateMetadata({ params, searchParams }) {
  const { section, sub, items } = await load(params.id, searchParams?.district);
  if (!section) return { title: "श्रेणी नहीं मिली", robots: { index: false } };
  const page = Math.max(parseInt(searchParams?.page) || 1, 1);
  const name = sub ? `${sub.name} (${section.label})` : section.kind === "division" ? `${section.label} संभाग` : section.label;
  const base = sub ? `${section.href}?district=${sub._id}` : section.href;
  return buildMeta({
    title: `${name} की ताज़ा खबरें${page > 1 ? ` – पेज ${page}` : ""}`,
    description: `${name} की ताज़ा और बड़ी खबरें हिंदी में – MP Update।`,
    path: page > 1 ? `${base}${base.includes("?") ? "&" : "?"}page=${page}` : base,
    image: items[0] ? ogImageOf(items[0]) : "/og.jpg",
  });
}

const chip = (on) =>
  `whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-bold transition-colors ${on ? "border-red-600 bg-red-600 text-white" : "border-gray-300 bg-white text-gray-800 hover:border-red-600 hover:text-red-600"}`;

export default async function CategoryPage({ params, searchParams }) {
  const { menu, list, section, sub, items } = await load(params.id, searchParams?.district);
  if (!section) notFound();
  const [ads, polls] = await Promise.all([getAds(), getPolls()]);

  const page = Math.max(parseInt(searchParams?.page) || 1, 1);
  const pages = Math.max(Math.ceil(items.length / PER_PAGE), 1);
  const slice = items.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const isDiv = section.kind === "division";
  const baseHref = sub ? `${section.href}?district=${sub._id}` : section.href;
  const pageHref = (p) => (p === 1 ? baseHref : `${baseHref}${baseHref.includes("?") ? "&" : "?"}page=${p}`);
  const title = sub ? `${sub.name} · ${section.label}` : isDiv ? `${section.label} संभाग` : section.label;

  const itemList = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${title} की ताज़ा खबरें`,
    url: `${SITE_URL}${baseHref}`,
    mainEntity: { "@type": "ItemList", itemListElement: slice.map((n, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/${n.slug}`, name: n.title })) },
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <div className="min-w-0">
        <SectionTitle as="h1">{title}</SectionTitle>

        {/* districts of this division, or the 10 divisions on the "all Madhya Pradesh" page */}
        {isDiv && section.districts.length > 0 && (
          <div className="no-scrollbar -mx-1 mb-5 flex gap-2 overflow-x-auto px-1 pb-1">
            <Link href={section.href} className={chip(!sub)}>सभी {section.label}</Link>
            {section.districts.map((d) => (
              <Link key={d._id} href={`${section.href}?district=${d._id}`} className={chip(sub?._id === d._id)}>{d.name}</Link>
            ))}
          </div>
        )}
        {section.key === "mp" && (
          <div className="no-scrollbar -mx-1 mb-5 flex gap-2 overflow-x-auto px-1 pb-1">
            <span className={chip(true)}>सभी संभाग</span>
            {divisionsOf(menu).map((d) => (
              <Link key={d._id} href={`/category/${d._id}`} className={chip(false)}>{d.name}</Link>
            ))}
          </div>
        )}

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
              <Link key={p} href={pageHref(p)} className={`h-10 min-w-10 rounded-lg px-3 text-center text-sm font-bold leading-10 ${p === page ? "bg-red-600 text-white" : "bg-white text-gray-700 hover:bg-red-100"}`}>
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
