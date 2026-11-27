import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import { NewsRow } from "@/components/NewsCard";
import { API_URL } from "@/lib/site";
import { buildMeta } from "@/lib/seo";

export const metadata = buildMeta({ title: "खबर खोजें", path: "/search", noindex: true });

async function search(q) {
  if (!q) return [];
  try {
    const res = await fetch(`${API_URL}/public/news?limit=40&q=${encodeURIComponent(q)}`, { cache: "no-store" });
    return (await res.json()).news || [];
  } catch {
    return [];
  }
}

export default async function SearchPage({ searchParams }) {
  const q = (searchParams?.q || "").trim();
  const results = await search(q);
  return (
    <div className="mx-auto max-w-3xl">
      <SectionTitle as="h1">खबर खोजें</SectionTitle>
      <form action="/search" className="mb-6 flex gap-2">
        <input name="q" defaultValue={q} placeholder="कोई शब्द लिखें…" className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-red-600" />
        <button className="rounded-lg bg-red-600 px-6 font-bold text-white hover:bg-black">खोजें</button>
      </form>
      {q && <p className="mb-3 text-sm text-gray-500">“{q}” के लिए {results.length} परिणाम</p>}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        {results.map((n) => (
          <NewsRow key={n._id} news={n} words={20} />
        ))}
        {q && results.length === 0 && <p className="py-8 text-center text-gray-500">कोई खबर नहीं मिली।</p>}
        {!q && <p className="py-8 text-center text-gray-500">ऊपर बॉक्स में खोजें।</p>}
      </div>
      <p className="mt-6 text-center"><Link href="/" className="font-bold text-red-600 hover:underline">← होम पेज</Link></p>
    </div>
  );
}
