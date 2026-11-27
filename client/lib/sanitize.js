import sanitizeHtml from "sanitize-html";
import { isDeadImg } from "./news";

// Article HTML is written by reporters/writers in the admin editor, so it is always cleaned
// before it reaches readers (no scripts, no inline event handlers, YouTube-only iframes).
export function cleanArticleHtml(html = "") {
  return sanitizeHtml(html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img", "iframe", "h1", "h2", "h3", "figure", "figcaption", "u", "span"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      iframe: ["src", "width", "height", "allowfullscreen", "frameborder", "title"],
      "*": ["style"],
    },
    allowedStyles: { "*": { "text-align": [/^(left|right|center|justify)$/] } },
    allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com", "player.vimeo.com"],
    transformTags: {
      a: (tag, attribs) => ({ tagName: "a", attribs: { ...attribs, target: "_blank", rel: "noopener noreferrer" } }),
      img: (tag, attribs) => ({ tagName: "img", attribs: { ...attribs, src: (attribs.src || "").replace(/^http:\/\//, "https://"), loading: "lazy" } }),
    },
    exclusiveFilter: (frame) => frame.tag === "img" && isDeadImg(frame.attribs.src),
  });
}
