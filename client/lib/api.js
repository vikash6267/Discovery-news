// Server-side data access for the public website. Every call is cached for a minute (ISR),
// so a slow/sleeping API never blocks visitors and crawlers always get full HTML.
import { API_URL } from "./site";

async function get(path, revalidate = 60) {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate } });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export const getMenu = async () => (await get("/public/menu", 300))?.categories || [];
export const getNewsList = async (params = "limit=300") => (await get(`/public/news?${params}`))?.news || [];
export const getNewsBySlug = async (slug) => (await get(`/public/news/${encodeURIComponent(slug)}`))?.news || null;
export const getBreaking = async () =>
  ((await get("/breakingNews/getAll", 30))?.breakingNewss || []).filter((b) => b.active);
export const getAds = async () => (await get("/ads/getAll", 120))?.ads || [];
export const getPolls = async () => {
  const d = await get("/poll/get", 30);
  return Array.isArray(d) ? d : [];
};
export const getPoll = async (id) => (await getPolls()).find((p) => p._id === id) || null;
export const getStories = async () => (await get("/story/getAll", 120))?.stories || [];
export const getStory = async (id) => (await get(`/story/get/${id}`, 120))?.story || null;
export const getVideos = async () => (await get("/yt/getAll", 300))?.videos || [];
export const getLive = async () => {
  const d = await get("/live/getAll", 30);
  return (d?.liveStreams || d?.liveStream || []).filter((l) => l.active !== false);
};
export const getSlugs = async () => (await get("/public/slugs", 600))?.news || [];
