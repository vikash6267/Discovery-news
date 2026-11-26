import { format } from "date-fns";

export const truncate = (text = "", words = 12) => {
  const w = String(text).split(" ");
  return w.length > words ? `${w.slice(0, words).join(" ")}…` : text;
};

export const fmtDate = (d) => {
  const date = new Date(d);
  return isNaN(date.getTime()) ? "" : format(date, "d MMM yyyy, h:mm a");
};

export const byLatest = (a, b) =>
  new Date(b.publish || b.createdAt) - new Date(a.publish || a.createdAt);

// ---- photos -----------------------------------------------------------
// Uploaded photos live on Cloudinary. If a photo is missing/unreachable we show a
// matching stock photo for the news category instead of a broken image.
const u = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=70`;
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
const hash = (str = "") => [...String(str)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

export const stockImg = (news) => {
  const name = `${news?.category?.name || ""} ${news?.subcategory?.name || ""}`;
  const key = (RULES.find(([re]) => re.test(name)) || [null, "general"])[1];
  const pool = P[key];
  return u(pool[hash(news?._id || news?.title) % pool.length]);
};

// Cloudinary cloud that is currently disabled (every URL returns 401) – don't even request it.
const DEAD = /res\.cloudinary\.com\/dsvotvxhq\//;
export const isDeadImg = (url) => !url || DEAD.test(url);

export const imgOf = (news) => {
  const url = news?.images?.[0]?.url;
  return isDeadImg(url) ? stockImg(news) : url.replace(/^http:\/\//, "https://");
};

/** Spread onto <img>: {...imgProps(news)} – gives src + a safe fallback on error. */
export const imgProps = (news) => ({
  src: imgOf(news),
  onError: (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = stockImg(news);
  },
});
