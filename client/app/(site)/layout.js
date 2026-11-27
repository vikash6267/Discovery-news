import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import BreakingTicker from "@/components/BreakingTicker";
import Footer from "@/components/Footer";
import { getMenu, getBreaking } from "@/lib/api";
import { buildNav } from "@/lib/news";
import { orgJsonLd, websiteJsonLd } from "@/lib/seo";

export default async function SiteLayout({ children }) {
  const [menu, breaking] = await Promise.all([getMenu(), getBreaking()]);
  const nav = buildNav(menu);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }} />
      <Header />
      <Navbar main={nav.main} more={nav.more} />
      <BreakingTicker items={breaking.map((b) => ({ name: b.name, url: b.url || "" }))} />
      <main className="mx-auto max-w-7xl px-4 py-5">{children}</main>
      <Footer />
    </>
  );
}
