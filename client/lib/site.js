export const SITE_NAME = "MP Update";
export const SITE_TAGLINE = "सत्ता, सियासत और सरोकार";
export const SITE_DESCRIPTION =
  "MP Update – मध्य प्रदेश और देश-दुनिया की ताज़ा खबरें, राजनीति, खेल, मनोरंजन और वीडियो एक ही जगह।";
// In a production build the live addresses are the default, so canonical / Open Graph / sitemap links
// can never leak "localhost" even if the hosting dashboard has no environment variables set.
const PROD = process.env.NODE_ENV === "production";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || (PROD ? "https://www.mpupdate.com" : "http://localhost:3000")).replace(/\/$/, "");
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || (PROD ? "https://api.mpupdate.com/api/v1" : "http://localhost:8080/api/v1")).replace(/\/$/, "");

// Official MP Update accounts (shown in header, footer, social hub and QR codes)
export const SOCIAL = [
  { key: "instagram", label: "Instagram", url: "https://www.instagram.com/mpupdate.official/", color: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600" },
  { key: "facebook", label: "Facebook", url: "https://www.facebook.com/MPupdate.official/", color: "bg-blue-600" },
  { key: "youtube", label: "YouTube", url: "https://www.youtube.com/@MPupdate.official", color: "bg-red-600" },
  { key: "x", label: "X", url: "https://x.com/MPupdate_news", color: "bg-black" },
  { key: "website", label: "Website", url: "https://www.mpupdate.com/", color: "bg-yellow-500" },
];

// WhatsApp number for "send us a story" (digits with country code, e.g. 919876543210). Set in .env.local.
export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
