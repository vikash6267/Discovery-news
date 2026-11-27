import { SITE_NAME, SITE_URL, SITE_TAGLINE, SITE_DESCRIPTION } from "./site";
import { imgOf, isDeadImg } from "./news";

export const absUrl = (path = "/") => (/^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`);

/** Social-share image for a story: real photo as is, stock photo cropped to the 1200x630 card size. */
export function ogImageOf(news) {
  const src = imgOf(news);
  const real = !isDeadImg(news?.images?.[0]?.url);
  return real ? src : src.replace(/w=\d+/, "w=1200&h=630").replace("auto=format", "fm=jpg").replace("fit=crop", "fit=crop&crop=entropy");
}

/**
 * One place for every page's <head>: title, description, canonical, Open Graph and Twitter card.
 * (Next replaces – not merges – nested openGraph objects, so each page must provide the complete set.)
 */
export function buildMeta({ title, description = SITE_DESCRIPTION, path = "/", image = "/og.jpg", type = "website", noindex = false, extra = {} }) {
  const url = absUrl(path);
  const img = absUrl(image);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      locale: "hi_IN",
      title: title || `${SITE_NAME} | ${SITE_TAGLINE}`,
      description,
      images: [{ url: img, width: 1200, height: 630, alt: title || SITE_NAME }],
      ...extra,
    },
    twitter: { card: "summary_large_image", site: "@MPupdate_news", title: title || SITE_NAME, description, images: [img] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export const orgJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  name: SITE_NAME,
  alternateName: "MP Update News",
  slogan: SITE_TAGLINE,
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png`, width: 700, height: 448 },
  sameAs: [
    "https://www.facebook.com/MPupdate.official/",
    "https://www.instagram.com/mpupdate.official/",
    "https://www.youtube.com/@MPupdate.official",
    "https://x.com/MPupdate_news",
  ],
});

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "hi-IN",
  potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/search?q={search_term_string}`, "query-input": "required name=search_term_string" },
});
