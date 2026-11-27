import Link from "next/link";
import LatestTabs from "./LatestTabs";
import PollWidget from "./PollWidget";
import AdSlot from "./AdSlot";
import SocialIcons from "./SocialIcons";
import QrCode from "./QrCode";
import SectionTitle from "./SectionTitle";
import { byLatest } from "@/lib/news";
import { SITE_URL } from "@/lib/site";

const slim = (n) => ({ _id: n._id, title: n.title, slug: n.slug, images: n.images, category: n.category, subcategory: n.subcategory, publish: n.publish, createdAt: n.createdAt });

export default function Sidebar({ news = [], ads = [], poll, extra }) {
  const latest = [...news].sort(byLatest).slice(0, 12).map(slim);
  const popular = [...news].sort((a, b) => (b.view || 0) - (a.view || 0)).slice(0, 12).map(slim);

  return (
    <aside className="space-y-6 lg:self-start">
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <LatestTabs tabs={[{ label: "ताज़ा खबरें", items: latest }, { label: "ज्यादा पढ़ी गई", items: popular }]} />
      </div>

      <AdSlot ads={ads} type="right-add" />

      {poll && <PollWidget poll={poll} />}

      {extra}

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <SectionTitle as="h3">सोशल हब</SectionTitle>
        <SocialIcons className="mb-3" />
        <div className="flex items-center gap-3">
          <QrCode value={SITE_URL} size={84} />
          <p className="text-sm font-semibold leading-snug text-gray-700">
            QR स्कैन करें और MP Update अपने फोन में खोलें।
            <Link href="/web-stories" className="mt-1 block text-red-600 hover:underline">वेब स्टोरीज़ देखें →</Link>
          </p>
        </div>
      </div>
    </aside>
  );
}
