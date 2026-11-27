"use client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/admin";
import { PageTitle, Card, Btn, Empty, Field, inputCls } from "@/components/admin/ui";

const slugOf = (url = "") => url.replace(/^\//, "");

export default function BreakingPage() {
  const [items, setItems] = useState([]);
  const [stories, setStories] = useState([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const load = useCallback(async () => {
    try { setItems((await api("/breakingNews/getAll")).breakingNewss || []); } catch (e) { setItems([]); }
  }, []);
  useEffect(() => {
    load();
    api("/public/news?limit=150").then((d) => setStories(d.news || [])).catch(() => {});
  }, [load]);

  const run = async (fn, msg) => {
    try { await fn(); toast.success(msg); load(); return true; } catch (e) { toast.error(e.message); return false; }
  };

  const pick = (s) => {
    setSlug(s);
    const n = stories.find((x) => x.slug === s);
    if (n && !name) setName(n.title);
  };

  const create = async (e) => {
    e.preventDefault();
    if (!slug) return toast.error("पहले वह खबर चुनें जो पट्टी पर क्लिक करने से खुलेगी");
    if (await run(() => api("/breakingNews/create", { method: "POST", body: { name, active: true, url: `/${slug}` } }), "पट्टी में जुड़ गई")) {
      setName(""); setSlug("");
    }
  };

  const storyOptions = (
    <>
      <option value="">— खबर चुनें —</option>
      {stories.map((s) => <option key={s._id} value={s.slug}>{s.title.slice(0, 90)}</option>)}
    </>
  );

  return (
    <div>
      <PageTitle>ब्रेकिंग न्यूज़ पट्टी</PageTitle>
      <Card>
        <form className="space-y-3" onSubmit={create}>
          <Field label="खबर का लिंक *" hint="यहाँ चुनी हुई खबर ही पट्टी पर क्लिक करते ही पूरी खुलेगी।">
            <select required value={slug} onChange={(e) => pick(e.target.value)} className={inputCls}>{storyOptions}</select>
          </Field>
          <Field label="पट्टी का टेक्स्ट (मोबाइल पर भी पूरा दिखता है)">
            <textarea required rows={2} value={name} onChange={(e) => setName(e.target.value)} placeholder="ब्रेकिंग न्यूज़ का पूरा टेक्स्ट" className={inputCls} />
          </Field>
          <Btn>पट्टी में जोड़ें</Btn>
        </form>

        {items.length === 0 && <Empty>कोई ब्रेकिंग न्यूज़ नहीं</Empty>}
        <div className="mt-5 divide-y">
          {items.map((b) => (
            <div key={b._id} className="space-y-2 py-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className={`min-w-0 flex-1 font-semibold ${b.active ? "" : "text-gray-400 line-through"}`}>{b.name}</p>
                <div className="flex gap-2">
                  <Btn color={b.active ? "gray" : "green"} onClick={() => run(() => api(`/breakingNews/update/${b._id}`, { method: "PUT", body: { active: !b.active } }), b.active ? "बंद की गई" : "चालू की गई")}>{b.active ? "बंद करें" : "चालू करें"}</Btn>
                  <Btn onClick={() => confirm("हटाएँ?") && run(() => api(`/breakingNews/delete/${b._id}`, { method: "DELETE" }), "हटा दिया")}>हटाएँ</Btn>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${b.url ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{b.url ? "खबर जुड़ी है" : "खबर नहीं जुड़ी"}</span>
                <select
                  value={slugOf(b.url)}
                  onChange={(e) => run(() => api(`/breakingNews/update/${b._id}`, { method: "PUT", body: { url: e.target.value ? `/${e.target.value}` : "" } }), "खबर का लिंक सेव हो गया")}
                  className="min-w-0 max-w-full flex-1 rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm"
                >
                  {slugOf(b.url) && !stories.some((s) => s.slug === slugOf(b.url)) && <option value={slugOf(b.url)}>{b.url}</option>}
                  {storyOptions}
                </select>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
