import Link from "next/link";
import { notFound } from "next/navigation";
import { FaRegEye, FaRegClock } from "react-icons/fa";
import Img from "@/components/Img";
import ShareBar from "@/components/ShareBar";
import Sidebar from "@/components/Sidebar";
import AdSlot from "@/components/AdSlot";
import SectionTitle from "@/components/SectionTitle";
import { NewsRow } from "@/components/NewsCard";
import { getNewsBySlug, getNewsList, getMenu, getAds, getPolls } from "@/lib/api";
import { buildSections, sectionKeyOf, imgOf, stockImg, stripHtml, fmtDate, byLatest } from "@/lib/news";
import { cleanArticleHtml } from "@/lib/sanitize";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const news = await getNewsBySlug(params.slug);
  if (!news) return { title: "खबर नहीं मिली", robots: { index: false } };
  const description = stripHtml(news.description).slice(0, 160);
  const image = imgOf(news);
  return {
    title: news.title,
    description,
    keywords: (news.tag || []).filter((t) => t !== "demo"),
    alternates: { canonical: `/${news.slug}` },
    openGraph: {
      type: "article",
      title: news.title,
      description,
      url: `${SITE_URL}/${news.slug}`,
      siteName: SITE_NAME,
      locale: "hi_IN",
      publishedTime: news.publish || news.createdAt,
      modifiedTime: news.updatedAt,
      images: [{ url: image, width: 1200, height: 630, alt: news.title }],
    },
    twitter: { card: "summary_large_image", title: news.title, description, images: [image] },
  };
}

export default async function ArticlePage({ params }) {
  const [news, list, menu, ads, polls] = await Promise.all([getNewsBySlug(params.slug), getNewsList("limit=300"), getMenu(), getAds(), getPolls()]);
  if (!news) notFound();

  const sections = buildSections(menu);
  const key = sectionKeyOf(news);
  const section = sections.find((s) => s.key === key);
  const url = `${SITE_URL}/${news.slug}`;
  const html = cleanArticleHtml(news.description);
  const related = list.filter((n) => sectionKeyOf(n) === key && n._id !== news._id).sort(byLatest).slice(0, 6);
  const tags = (news.tag || []).filter((t) => t !== "demo");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.title,
    description: stripHtml(news.description).slice(0, 200),
    image: [imgOf(news)],
    datePublished: news.publish || news.createdAt,
    dateModified: news.updatedAt || news.publish || news.createdAt,
    inLanguage: "hi-IN",
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` } },
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "होम", item: SITE_URL },
      ...(section ? [{ "@type": "ListItem", position: 2, name: section.label, item: `${SITE_URL}${section.href}` }] : []),
      { "@type": "ListItem", position: section ? 3 : 2, name: news.title, item: url },
    ],
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />

      <article className="min-w-0 rounded-xl bg-white p-5 shadow-sm md:p-8">
        <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-gray-500" aria-label="breadcrumb">
          <Link href="/" className="font-semibold text-red-600 hover:underline">होम</Link>
          {section && (
            <>
              <span>›</span>
              <Link href={section.href} className="hover:text-red-600">{section.label}</Link>
            </>
          )}
        </nav>

        {section && <span className="mb-3 inline-block rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">{section.label}</span>}
        <h1 className="text-2xl font-extrabold leading-tight md:text-4xl">{news.title}</h1>
        {news.subtitle && news.subtitle !== news.title && <p className="mt-3 text-lg text-gray-600 md:text-xl">{news.subtitle}</p>}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-y border-gray-200 py-3 text-sm text-gray-600">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5"><FaRegClock className="text-red-600" />{fmtDate(news.publish || news.createdAt)}</span>
            <span className="flex items-center gap-1.5"><FaRegEye className="text-red-600" />{news.view ?? 0}</span>
            {news.location && <span>📍 {news.location}</span>}
          </div>
          <ShareBar url={url} title={news.title} />
        </div>

        <figure className="mt-5">
          <Img src={imgOf(news)} fallback={stockImg(news)} alt={news.title} priority className="max-h-[520px] w-full rounded-xl object-cover shadow-md" />
        </figure>

        <div className="article-body mt-6" dangerouslySetInnerHTML={{ __html: html }} />

        {news.youtubeurl && (
          <p className="mt-4">
            <a href={news.youtubeurl} target="_blank" rel="noopener noreferrer" className="font-bold text-red-600 underline">▶ वीडियो देखें</a>
          </p>
        )}

        {tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((t) => (
              <Link key={t} href={`/search?q=${encodeURIComponent(t)}`} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-red-600 hover:text-white">
                #{t}
              </Link>
            ))}
          </div>
        )}

        <AdSlot ads={ads} type="article-add" className="mt-8" />

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-5">
          <Link href="/" className="rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-black">← होम पेज पर जाएँ</Link>
          <ShareBar url={url} title={news.title} />
        </div>
      </article>

      <Sidebar
        news={list}
        ads={ads}
        poll={polls[0]}
        extra={
          related.length > 0 && (
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <SectionTitle as="h3">और पढ़ें{section ? `: ${section.label}` : ""}</SectionTitle>
              {related.map((n) => (
                <NewsRow key={n._id} news={n} />
              ))}
            </div>
          )
        }
      />
    </div>
  );
}
