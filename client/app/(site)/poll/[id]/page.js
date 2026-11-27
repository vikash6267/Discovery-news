import { notFound } from "next/navigation";
import PollWidget from "@/components/PollWidget";
import SectionTitle from "@/components/SectionTitle";
import { getPoll } from "@/lib/api";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const revalidate = 30;

export async function generateMetadata({ params }) {
  const poll = await getPoll(params.id);
  if (!poll) return { title: "पोल नहीं मिला", robots: { index: false } };
  return {
    title: `पोल: ${poll.question}`,
    description: `${poll.question} – अपना वोट दें और नतीजे देखें।`,
    alternates: { canonical: `/poll/${poll._id}` },
    openGraph: { type: "website", title: `पोल: ${poll.question}`, url: `${SITE_URL}/poll/${poll._id}`, siteName: SITE_NAME, images: [{ url: "/og.jpg", width: 1200, height: 630 }] },
  };
}

export default async function PollPage({ params }) {
  const poll = await getPoll(params.id);
  if (!poll) notFound();
  return (
    <div className="mx-auto max-w-xl">
      <SectionTitle as="h1">जनता की राय</SectionTitle>
      <PollWidget poll={poll} standalone />
    </div>
  );
}
