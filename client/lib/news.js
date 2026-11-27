import { format } from "date-fns";

export const truncate = (text = "", words = 12) => {
  const w = String(text).split(" ");
  return w.length > words ? `${w.slice(0, words).join(" ")}…` : text;
};

export const fmtDate = (d) => {
  const date = new Date(d);
  return isNaN(date.getTime()) ? "" : format(date, "d MMM yyyy, h:mm a");
};

export const byLatest = (a, b) => new Date(b.publish || b.createdAt) - new Date(a.publish || a.createdAt);
export const stripHtml = (html = "") => html.replace(/<\/?[^>]+(>|$)/g, " ").replace(/\s+/g, " ").trim();

/* ---------------------------------------------------------------------------
   Sections.  Rules from the editorial desk:
   - only "मध्य प्रदेश" is shown as a state;
   - every other state's news is merged into the national ("देश") column;
   - state names never appear on their own anywhere.
--------------------------------------------------------------------------- */
export const MP = "मध्य प्रदेश";
const STATE_CATEGORY = "राज्य";
const NATIONAL = "देश";

export const isDivision = (c) => c?.kind === "division";

export function sectionKeyOf(n) {
  const cat = n?.category?.name?.trim();
  const sub = n?.subcategory?.name?.trim();
  // every MP division/district story (and old "राज्य → मध्य प्रदेश" stories) belongs to the MP block
  if (isDivision(n?.category) || sub === MP) return "mp";
  if (cat === STATE_CATEGORY || cat === NATIONAL) return "national";
  return n?.category?._id || "other";
}

/** The 10 MP divisions (संभाग) in menu order, each with its districts. */
export const divisionsOf = (menu = []) =>
  menu.filter(isDivision).sort((a, b) => (a.order || 0) - (b.order || 0));

export function buildSections(menu = []) {
  const topics = menu
    .filter((c) => !isDivision(c) && ![STATE_CATEGORY, NATIONAL].includes(c.name.trim()))
    .map((c) => ({ key: c._id, label: c.name.trim(), href: `/category/${c._id}` }));
  const politics = topics.filter((s) => s.label === "राजनीति");
  const others = topics.filter((s) => s.label !== "राजनीति");
  return [
    { key: "mp", label: MP, href: "/category/mp" },
    ...politics,
    { key: "national", label: NATIONAL, href: "/category/national" },
    ...others,
  ];
}

/** Any page key: mp / national / a topic category / a division. */
export function findSection(menu, id) {
  const s = buildSections(menu).find((x) => x.key === id);
  if (s) return { ...s, kind: "topic" };
  const d = divisionsOf(menu).find((x) => x._id === id);
  if (d) return { key: d._id, label: d.name.trim(), href: `/category/${d._id}`, kind: "division", districts: d.subCategories || [] };
  return null;
}

/**
 * Navigation: the main (horizontal) bar = देश + the 10 divisions;
 * the ⋮ menu = everything else (MP overview, politics, crime, sports ... video, live).
 */
export function buildNav(menu = []) {
  const sections = buildSections(menu);
  const national = sections.find((s) => s.key === "national");
  const main = [
    national && { label: national.label, href: national.href },
    ...divisionsOf(menu).map((d) => ({ label: d.name.trim(), href: `/category/${d._id}` })),
  ].filter(Boolean);
  const more = [
    { label: "मध्य प्रदेश – सभी खबरें", href: "/category/mp" },
    ...sections.filter((s) => s.key !== "mp" && s.key !== "national").map((s) => ({ label: s.label, href: s.href })),
    { label: "वेब स्टोरीज़", href: "/web-stories" },
    { label: "वीडियो", href: "/video" },
    { label: "Live TV", href: "/live-tv" },
  ];
  return { main, more };
}

export const sectionOfNews = (n, sections) => sections.find((s) => s.key === sectionKeyOf(n));

/* ---------------------------------------------------------------------------
   Photos.  Uploaded photos live on Cloudinary.  When a photo is missing or its
   host is dead we fall back to a stock photo that matches the section.
--------------------------------------------------------------------------- */
const u = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1000&q=70`;
const P = {
  politics: ["1529107386315-e1a2ed48a620", "1532375810709-75b1da00537c", "1587474260584-136574528ed5"],
  india: ["1587474260584-136574528ed5", "1524492412937-b28074a5d7da", "1532375810709-75b1da00537c", "1599661046289-e31897846e41", "1477959858617-67f85cf4f1df"],
  world: ["1451187580459-43490279c0fa", "1477959858617-67f85cf4f1df", "1506744038136-46273834b3fb"],
  sports: ["1540747913346-19e32dc3e97e", "1531415074968-036ba1b575da", "1517649763962-0c623066013b"],
  film: ["1489599849927-2ee91cede3ba", "1514525253161-7a46d19cd819", "1573152958734-1922c188fba3"],
  business: ["1611974789855-9c2a0a7236a3", "1590283603385-17ffb3a7f29f", "1553729459-efe14ef6055d"],
  faith: ["1548013146-72479768bada", "1524492412937-b28074a5d7da", "1599661046289-e31897846e41"],
  tech: ["1588681664899-f142ff2dc9b1", "1451187580459-43490279c0fa"],
  general: ["1504711434969-e33886168f5c", "1495020689067-958852a7765e", "1585829365295-ab7cd400c167", "1588681664899-f142ff2dc9b1"],
};
const RULES = [
  [/राजनीति|इलेक्शन|चुनाव|भ्रष्टाचार|बजट/, "politics"],
  [/विदेश|इंटरनेशनल|international/i, "world"],
  [/खेल|क्रिकेट|हॉकी|हाकी|फुटबाल|टेनिस|olympics/i, "sports"],
  [/मनोरंजन|बॉलीवुड|हालीवुड|टीवी|टेलीविजन|मूवी/, "film"],
  [/व्यापार|बिजनेस|बाजार|business/i, "business"],
  [/धर्म|राशिफल|वास्तु|तीज|आस्था|जीवन मंत्र/, "faith"],
  [/टेक्नोलॉजी|विज्ञान|गेजेट/, "tech"],
  [/देश|राज्य|प्रदेश|छत्तीसगढ़|राजस्थान|दिल्ली|बिहार|उत्तर|गुजरात|महाराष्ट्र|पंजाब|हरियाणा|झारखंड|असम|बंगाल|हिमाचल|उत्तराखंड|पर्यटन/, "india"],
];
const hash = (s = "") => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

export const stockImg = (n) => {
  const name = `${n?.category?.name || ""} ${n?.subcategory?.name || ""}`;
  const key = (RULES.find(([re]) => re.test(name)) || [null, "general"])[1];
  const pool = P[key];
  return u(pool[hash(n?._id || n?.title) % pool.length]);
};

// Cloudinary cloud that is currently disabled (every URL answers 401) – do not even request it.
const DEAD = /res\.cloudinary\.com\/dsvotvxhq\//;
export const isDeadImg = (url) => !url || DEAD.test(url);
export const imgOf = (n) => {
  const url = n?.images?.[0]?.url;
  return isDeadImg(url) ? stockImg(n) : url.replace(/^http:\/\//, "https://");
};
