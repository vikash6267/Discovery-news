"use client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, uploadImages } from "@/lib/admin";
import { SITE_URL } from "@/lib/site";
import { storyTitle } from "@/components/StoriesStrip";
import { PageTitle, Card, Field, Btn, Empty, inputCls } from "@/components/admin/ui";

const blank = () => ({ text: "", image: "" });

export default function StoriesPage() {
  const [stories, setStories] = useState([]);
  const [author, setAuthor] = useState("MP Update");
  const [slides, setSlides] = useState([blank(), blank()]);

  const load = useCallback(async () => {
    try { setStories((await api("/story/getAll")).stories || []); } catch (e) { toast.error(e.message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const setSlide = (i, patch) => setSlides((s) => s.map((x, k) => (k === i ? { ...x, ...patch } : x)));
  const upload = async (i, file) => {
    if (!file) return;
    const t = toast.loading("अपलोड हो रही है…");
    try { const [im] = await uploadImages([file]); setSlide(i, { image: im.url }); toast.success("फोटो जुड़ गई", { id: t }); }
    catch (e) { toast.error(`अपलोड नहीं हुई (${e.message}) — फोटो का लिंक डालें`, { id: t }); }
  };

  const create = async (e) => {
    e.preventDefault();
    const ok = slides.filter((s) => s.text.trim() && s.image.trim());
    if (!ok.length) return toast.error("कम से कम एक स्लाइड में टेक्स्ट और फोटो चाहिए");
    try {
      await api("/story/create", { method: "POST", body: { title: ok.map((s) => s.text), author, images: ok.map((s) => ({ url: s.image, public_id: "external" })) } });
      toast.success("वेब स्टोरी बन गई");
      setSlides([blank(), blank()]); load();
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div>
      <PageTitle>वेब स्टोरीज़</PageTitle>
      <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <Card>
          <h2 className="mb-3 font-extrabold">नई वेब स्टोरी</h2>
          <form onSubmit={create} className="space-y-3">
            <Field label="लेखक / डेस्क"><input value={author} onChange={(e) => setAuthor(e.target.value)} className={inputCls} /></Field>
            {slides.map((s, i) => (
              <div key={i} className="space-y-2 rounded-lg border p-3">
                <p className="text-xs font-bold text-gray-500">स्लाइड {i + 1}</p>
                <input value={s.text} onChange={(e) => setSlide(i, { text: e.target.value })} placeholder="स्लाइड का टेक्स्ट" className={inputCls} />
                <input value={s.image} onChange={(e) => setSlide(i, { image: e.target.value })} placeholder="फोटो का लिंक (https://…)" className={inputCls} />
                <input type="file" accept="image/*" onChange={(e) => upload(i, e.target.files[0])} className="text-xs" />
              </div>
            ))}
            <div className="flex gap-2">
              <Btn type="button" color="gray" onClick={() => setSlides([...slides, blank()])}>+ स्लाइड</Btn>
              <Btn className="flex-1">स्टोरी बनाएँ</Btn>
            </div>
          </form>
        </Card>
        <Card>
          <h2 className="mb-3 font-extrabold">सभी स्टोरीज़ ({stories.length})</h2>
          {stories.length === 0 && <Empty>कोई स्टोरी नहीं</Empty>}
          <div className="divide-y">
            {[...stories].reverse().map((s) => (
              <div key={s._id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="font-bold">{storyTitle(s)}</p>
                  <p className="text-xs text-gray-500">{s.images?.length || 0} स्लाइड · {SITE_URL}/web-stories/{s._id}</p>
                </div>
                <div className="flex gap-2">
                  <a href={`/web-stories/${s._id}`} target="_blank" className="rounded-lg bg-gray-200 px-3 py-2 text-sm font-bold">देखें</a>
                  <Btn onClick={async () => { if (!confirm("स्टोरी हटाएँ?")) return; try { await api(`/story/delete/${s._id}`, { method: "DELETE" }); load(); } catch (e) { toast.error(e.message); } }}>हटाएँ</Btn>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
