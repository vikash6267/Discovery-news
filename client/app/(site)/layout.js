import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import BreakingTicker from "@/components/BreakingTicker";
import Footer from "@/components/Footer";
import { getMenu, getBreaking } from "@/lib/api";
import { buildSections } from "@/lib/news";

export default async function SiteLayout({ children }) {
  const [menu, breaking] = await Promise.all([getMenu(), getBreaking()]);
  const items = [
    ...buildSections(menu).map((s) => ({ label: s.label, href: s.href })),
    { label: "वीडियो", href: "/video" },
    { label: "Live TV", href: "/live-tv" },
  ];

  return (
    <>
      <Header />
      <Navbar items={items} />
      <BreakingTicker items={breaking.map((b) => ({ name: b.name, url: b.url || "" }))} />
      <main className="mx-auto max-w-7xl px-4 py-5">{children}</main>
      <Footer />
    </>
  );
}
