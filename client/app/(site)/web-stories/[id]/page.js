import { notFound } from "next/navigation";
import StoryViewer from "@/components/StoryViewer";
import { storyCover, storyTitle } from "@/components/StoriesStrip";
import { getStory } from "@/lib/api";
import { isDeadImg, stockImg } from "@/lib/news";
import { SITE_URL } from "@/lib/site";
import { buildMeta } from "@/lib/seo";

export const revalidate = 120;

export async function generateMetadata({ params }) {
  const story = await getStory(params.id);
  if (!story) return { title: "स्टोरी नहीं मिली", robots: { index: false } };
  const title = storyTitle(story);
  return buildMeta({ title, description: `${title} – MP Update वेब स्टोरी`, path: `/web-stories/${story._id}`, image: storyCover(story), type: "article" });
}

export default async function StoryPage({ params }) {
  const story = await getStory(params.id);
  if (!story) notFound();
  const titles = Array.isArray(story.title) ? story.title : [story.title];
  const images = story.images?.length ? story.images : [{}];
  const slides = images.map((im, i) => ({
    image: isDeadImg(im.url) ? stockImg({ _id: story._id + i }) : im.url.replace(/^http:\/\//, "https://"),
    fallback: stockImg({ _id: story._id + i }),
    text: titles[i] || titles[0] || "",
  }));

  return (
    <div className="py-4">
      <StoryViewer slides={slides} url={`${SITE_URL}/web-stories/${story._id}`} title={storyTitle(story)} />
    </div>
  );
}
