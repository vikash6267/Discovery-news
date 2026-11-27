import { getSlugs, getMenu, getStories } from "@/lib/api";
import { buildSections } from "@/lib/news";
import { SITE_URL } from "@/lib/site";

export const revalidate = 600;

export default async function sitemap() {
  const [slugs, menu, stories] = await Promise.all([getSlugs(), getMenu(), getStories()]);
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "hourly", priority: 1 },
    ...buildSections(menu).map((s) => ({ url: `${SITE_URL}${s.href}`, lastModified: now, changeFrequency: "hourly", priority: 0.8 })),
    ...["/web-stories", "/video", "/live-tv", "/contact"].map((p) => ({ url: `${SITE_URL}${p}`, lastModified: now, changeFrequency: "daily", priority: 0.5 })),
    ...stories.map((s) => ({ url: `${SITE_URL}/web-stories/${s._id}`, lastModified: s.updatedAt || now, priority: 0.5 })),
    ...slugs.map((n) => ({ url: `${SITE_URL}/${n.slug}`, lastModified: n.updatedAt || n.publish || n.createdAt, changeFrequency: "daily", priority: 0.7 })),
  ];
}
