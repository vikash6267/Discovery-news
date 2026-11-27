import { notFound } from "next/navigation";
import PollWidget from "@/components/PollWidget";
import SectionTitle from "@/components/SectionTitle";
import { getPoll } from "@/lib/api";
import { buildMeta } from "@/lib/seo";

export const revalidate = 30;

export async function generateMetadata({ params }) {
  const poll = await getPoll(params.id);
  if (!poll) return { title: "पोल नहीं मिला", robots: { index: false } };
  return buildMeta({
    title: `पोल: ${poll.question}`,
    description: `${poll.question} – अपना वोट दें और नतीजे देखें। MP Update जनता की राय।`,
    path: `/poll/${poll._id}`,
  });
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
