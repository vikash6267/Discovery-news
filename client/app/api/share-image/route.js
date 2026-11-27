// Same-origin proxy of a story's photo, used by the "Instagram" share button.
// (The phone's share sheet can only hand a *file* to Instagram, and the browser may only build that file
//  from a same-origin response – so we stream the photo through our own domain.)
import { getNewsBySlug } from "@/lib/api";
import { imgOf } from "@/lib/news";

export const revalidate = 3600;

export async function GET(request) {
  const slug = new URL(request.url).searchParams.get("slug") || "";
  if (!slug) return new Response("missing slug", { status: 400 });

  const news = await getNewsBySlug(slug);
  if (!news) return new Response("not found", { status: 404 });

  try {
    const upstream = await fetch(imgOf(news), { next: { revalidate: 3600 } });
    if (!upstream.ok) throw new Error("upstream " + upstream.status);
    const type = (upstream.headers.get("content-type") || "image/jpeg").split(";")[0];
    if (!type.startsWith("image/")) throw new Error("not an image");
    return new Response(upstream.body, {
      headers: { "Content-Type": type, "Cache-Control": "public, max-age=3600, s-maxage=3600", "Content-Disposition": `inline; filename="mpupdate-${slug}.jpg"` },
    });
  } catch (e) {
    return new Response("image unavailable", { status: 502 });
  }
}
