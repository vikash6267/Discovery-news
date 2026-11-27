"use client";
import { API_URL } from "@/lib/site";

/** Ad banner link that counts the click (shown in Admin → विज्ञापन). */
export default function AdLink({ id, href, src, alt = "विज्ञापन" }) {
  const track = () => {
    try {
      const url = `${API_URL}/ads/click/${id}`;
      if (navigator.sendBeacon) navigator.sendBeacon(url);
      else fetch(url, { method: "POST", keepalive: true });
    } catch {}
  };
  return (
    <a href={href} target="_blank" rel="noopener sponsored noreferrer" onClick={track} className="block overflow-hidden rounded-lg shadow-md transition hover:shadow-lg">
      <img src={src} alt={alt} loading="lazy" className="w-full object-cover" />
    </a>
  );
}
