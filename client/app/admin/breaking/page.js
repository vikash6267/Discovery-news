"use client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/admin";
import { PageTitle, Card, Btn, Empty, Field, inputCls } from "@/components/admin/ui";

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
    api("/public/news?limit=100").then((d) => setStories(d.news || [])).catch(() => {});
  }, [load]);

  const run = async (fn, msg) => {
    try { await fn(); toast.success(msg); load(); } catch (e) { toast.error(e.message); }
  };

  const pick = (s) => {
    setSlug(s);
    const n = stories.find((x) => x.slug === s);
    if (n && !name) setName(n.title);
  };

  const create = (e) => {
    e.preventDefault();
    run(() => api("/breakingNews/create", { method: "POST", body: { name, active: true, url: slug ? `/${slug}` : "" } }), "पट्टी में जुड़ गई").then(() => { setName(""); setSlug(""); });
  };

  return (
    <div>
      <PageTitle>ब्रेकिंग न्यूज़ पट्टी</PageTitle>
      <Card>
        <form className="space-y-3" onSubmit={create}>
          <Field label="कौन सी खबर खुलनी चाहिए (क्लिक करने पर)" hint="खबर चुनने पर पट्टी पर क्लिक करते ही वही पूरी स्टोरी खुलेगी। न चुनें तो खोज पेज खुलेगा।">
            <select value={slug} onChange={(e) => pick(e.target.value)} className={inputCls}>
              <option value="">— कोई खबर नहीं जोड़ें —</option>
              {stories.map((s) => <option key={s._id} value={s.slug}>{s.title.slice(0, 90)}</option>)}
            </select>
          </Field>
          <Field label="पट्टी का टेक्स्ट (मोबाइल पर भी पूरा दिखता है)">
            <textarea required rows={2} value={name} onChange={(e) => setName(e.target.value)} placeholder="ब्रेकिंग न्यूज़ का पूरा टेक्स्ट" className={inputCls} />
          </Field>
          <Btn>पट्टी में जोड़ें</Btn>
        </form>

        {items.length === 0 && <Empty>कोई ब्रेकिंग न्यूज़ नहीं</Empty>}
        <div className="mt-5 divide-y">
          {items.map((b) => (
            <div key={b._id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className={`font-semibold ${b.active ? "" : "text-gray-400 line-through"}`}>{b.name}</p>
                <p className="text-xs text-gray-500">{b.url ? `खुलेगा: ${b.url}` : "खबर जुड़ी नहीं (खोज पेज खुलेगा)"}</p>
              </div>
              <div className="flex gap-2">
                <Btn color={b.active ? "gray" : "green"} onClick={() => run(() => api(`/breakingNews/update/${b._id}`, { method: "PUT", body: { active: !b.active } }), b.active ? "बंद की गई" : "चालू की गई")}>{b.active ? "बंद करें" : "चालू करें"}</Btn>
                <Btn onClick={() => confirm("हटाएँ?") && run(() => api(`/breakingNews/delete/${b._id}`, { method: "DELETE" }), "हटा दिया")}>हटाएँ</Btn>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
