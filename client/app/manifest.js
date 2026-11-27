import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

export default function manifest() {
  return {
    name: `${SITE_NAME} – सत्ता, सियासत और सरोकार`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#b91c1c",
    lang: "hi",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
