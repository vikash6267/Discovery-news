"use client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/admin";
import { PageTitle, Card, Field, Btn, Empty, inputCls } from "@/components/admin/ui";

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [lives, setLives] = useState([]);
  const [vUrl, setVUrl] = useState("");
  const [live, setLive] = useState({ name: "", url: "" });

  const load = useCallback(async () => {
    try { setVideos((await api("/yt/getAll")).videos || []); } catch { setVideos([]); }
    try { setLives((await api("/live/getAll")).liveStreams || []); } catch { setLives([]); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const run = async (fn, msg) => { try { await fn(); toast.success(msg); load(); } catch (e) { toast.error(e.message); } };

  return (
    <div>
      <PageTitle>वीडियो और Live TV</PageTitle>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-extrabold">YouTube वीडियो</h2>
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); run(() => api("/yt/create", { method: "POST", body: { url: vUrl, type: "video" } }), "वीडियो जुड़ गया").then(() => setVUrl("")); }}>
            <input required value={vUrl} onChange={(e) => setVUrl(e.target.value)} placeholder="YouTube लिंक" className={inputCls} />
            <Btn>जोड़ें</Btn>
          </form>
          {videos.length === 0 && <Empty>कोई वीडियो नहीं</Empty>}
          <div className="mt-3 divide-y">
            {videos.map((v) => (
              <div key={v._id} className="flex items-center justify-between gap-2 py-2">
                <p className="min-w-0 flex-1 break-all text-sm">{v.url}</p>
                <Btn color="gray" onClick={() => confirm("हटाएँ?") && run(() => api(`/yt/delete/${v._id}`, { method: "DELETE" }), "हटा दिया")}>हटाएँ</Btn>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="mb-3 font-extrabold">Live स्ट्रीम</h2>
          <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); run(() => api("/live/create", { method: "POST", body: { ...live, active: true } }), "लाइव जुड़ गया").then(() => setLive({ name: "", url: "" })); }}>
            <Field label="नाम"><input required value={live.name} onChange={(e) => setLive({ ...live, name: e.target.value })} className={inputCls} /></Field>
            <Field label="YouTube Live लिंक"><input required value={live.url} onChange={(e) => setLive({ ...live, url: e.target.value })} className={inputCls} /></Field>
            <Btn>जोड़ें</Btn>
          </form>
          {lives.length === 0 && <Empty>कोई लाइव नहीं</Empty>}
          <div className="mt-3 divide-y">
            {lives.map((l) => (
              <div key={l._id} className="flex items-center justify-between gap-2 py-2">
                <p className="text-sm font-semibold">{l.name} <span className={l.active ? "text-green-600" : "text-gray-400"}>{l.active ? "● चालू" : "बंद"}</span></p>
                <div className="flex gap-2">
                  <Btn color="gray" onClick={() => run(() => api(`/live/update/${l._id}`, { method: "PUT", body: { active: !l.active } }), "बदल गया")}>{l.active ? "बंद" : "चालू"}</Btn>
                  <Btn onClick={() => confirm("हटाएँ?") && run(() => api(`/live/delete/${l._id}`, { method: "DELETE" }), "हटा दिया")}>हटाएँ</Btn>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
