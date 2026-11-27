// Google News sitemap: only stories published in the last 2 days.
import { getSlugs } from "@/lib/api";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const revalidate = 300;

const esc = (s = "") => String(s).replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]));

export async function GET() {
  const since = Date.now() - 2 * 24 * 3600 * 1000;
  const items = (await getSlugs()).filter((n) => new Date(n.publish || n.createdAt).getTime() > since);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items
  .map(
    (n) => `<url><loc>${SITE_URL}/${esc(n.slug)}</loc><news:news><news:publication><news:name>${SITE_NAME}</news:name><news:language>hi</news:language></news:publication><news:publication_date>${new Date(n.publish || n.createdAt).toISOString()}</news:publication_date><news:title>${esc(n.title)}</news:title></news:news></url>`
  )
  .join("\n")}
</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
