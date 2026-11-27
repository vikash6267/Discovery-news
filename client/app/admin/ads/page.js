"use client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/admin";
import { isDeadImg } from "@/lib/news";
import { PageTitle, Card, Field, Btn, Empty, inputCls } from "@/components/admin/ui";

const SLOTS = [
  ["header-add", "होम पेज – ऊपर चौड़ा बैनर", "970 × 90 (चौड़ा)"],
  ["right-add", "साइडबार (दाईं ओर)", "300 × 250"],
  ["buttom-add", "सेक्शन के बीच / नीचे बैनर", "728 × 90"],
  ["article-add", "खबर के अंदर / नीचे", "728 × 120"],
];
const slotName = (t) => SLOTS.find((s) => s[0] === t)?.[1] || t;
const fmt = (d) => (d ? new Date(d).toLocaleDateString("en-GB") : "—");
const toInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");

function status(a) {
  const now = Date.now();
  if (a.active === false) return ["बंद", "bg-gray-200 text-gray-700"];
  if (a.startsAt && new Date(a.startsAt) > now) return ["शुरू होना बाकी", "bg-blue-100 text-blue-700"];
  if (a.endsAt && new Date(a.endsAt) < now) return ["समय खत्म", "bg-orange-100 text-orange-700"];
  if (isDeadImg(a.image)) return ["फोटो खराब", "bg-red-100 text-red-700"];
  return ["चालू", "bg-green-100 text-green-700"];
}

export default function AdsPage() {
  const [ads, setAds] = useState([]);
  const [f, setF] = useState({ title: "", type: "right-add", url: "", imageUrl: "", startsAt: "", endsAt: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [edit, setEdit] = useState(null);

  const load = useCallback(async () => {
    try { setAds((await api("/ads/admin/all")).ads || []); } catch (e) { toast.error(e.message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!file) return setPreview(f.imageUrl);
    const u = URL.createObjectURL(file);
    setPreview(u);
    return () => URL.revokeObjectURL(u);
  }, [file, f.imageUrl]);

  const create = async (e) => {
    e.preventDefault();
    if (!file && !f.imageUrl) return toast.error("फोटो चुनें या फोटो का लिंक डालें");
    setBusy(true);
    try {
      const form = new FormData();
      ["title", "type", "url", "startsAt", "endsAt"].forEach((k) => f[k] && form.append(k, f[k]));
      if (file) form.append("image", file);
      else form.append("imageUrl", f.imageUrl);
      await api("/ads/create", { method: "POST", form });
      toast.success("विज्ञापन जुड़ गया और वेबसाइट पर चालू है");
      setF({ ...f, title: "", url: "", imageUrl: "", startsAt: "", endsAt: "" });
      setFile(null);
      e.target.reset();
      load();
    } catch (err) { toast.error(err.message); }
    setBusy(false);
  };

  const patch = async (id, body, msg) => {
    try { await api(`/ads/update/${id}`, { method: "PUT", body }); toast.success(msg); load(); } catch (e) { toast.error(e.message); }
  };
  const remove = async (id) => {
    if (!confirm("विज्ञापन हमेशा के लिए हटाएँ?")) return;
    try { await api(`/ads/delete/${id}`, { method: "DELETE" }); toast.success("हटा दिया"); load(); } catch (e) { toast.error(e.message); }
  };
  const saveEdit = async (e) => {
    e.preventDefault();
    await patch(edit._id, { title: edit.title, url: edit.url, type: edit.type, startsAt: edit.startsAt, endsAt: edit.endsAt }, "विज्ञापन अपडेट हो गया");
    setEdit(null);
  };

  const live = ads.filter((a) => status(a)[0] === "चालू").length;

  return (
    <div>
      <PageTitle>विज्ञापन</PageTitle>
      <p className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
        चालू विज्ञापन: <b>{live}</b> · हर स्लॉट में बैनर अपने आप दिखता है। तारीख डालने पर विज्ञापन उसी अवधि में दिखेगा। जिस स्लॉट में कोई विज्ञापन नहीं होता वहाँ “अपना विज्ञापन यहाँ दें” बॉक्स दिखता है।
      </p>

      <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <Card>
          <h2 className="mb-3 font-extrabold">नया विज्ञापन</h2>
          <form onSubmit={create} className="space-y-3">
            <Field label="विज्ञापनदाता / नाम"><input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className={inputCls} placeholder="जैसे: ABC ज्वेलर्स" /></Field>
            <Field label="कहाँ दिखाना है" hint={`सही साइज़: ${SLOTS.find((s) => s[0] === f.type)?.[2]}`}>
              <select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })} className={inputCls}>
                {SLOTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </Field>
            <Field label="क्लिक करने पर लिंक *"><input required type="url" value={f.url} onChange={(e) => setF({ ...f, url: e.target.value })} className={inputCls} placeholder="https://…" /></Field>
            <Field label="बैनर फोटो"><input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0] || null)} className="w-full text-sm" /></Field>
            <Field label="या फोटो का लिंक"><input value={f.imageUrl} onChange={(e) => setF({ ...f, imageUrl: e.target.value })} className={inputCls} placeholder="https://…jpg" /></Field>
            {preview && <img src={preview} alt="प्रीव्यू" className="max-h-32 w-full rounded-lg border object-contain" />}
            <div className="grid grid-cols-2 gap-3">
              <Field label="शुरू (वैकल्पिक)"><input type="date" value={f.startsAt} onChange={(e) => setF({ ...f, startsAt: e.target.value })} className={inputCls} /></Field>
              <Field label="खत्म (वैकल्पिक)"><input type="date" value={f.endsAt} onChange={(e) => setF({ ...f, endsAt: e.target.value })} className={inputCls} /></Field>
            </div>
            <Btn disabled={busy} className="w-full">{busy ? "जुड़ रहा है…" : "विज्ञापन जोड़ें"}</Btn>
          </form>
        </Card>

        <Card>
          <h2 className="mb-3 font-extrabold">सभी विज्ञापन ({ads.length})</h2>
          {ads.length === 0 && <Empty>अभी कोई विज्ञापन नहीं</Empty>}
          <div className="grid gap-4 md:grid-cols-2">
            {ads.map((a) => {
              const [label, cls] = status(a);
              return (
                <div key={a._id} className="rounded-xl border p-3">
                  {isDeadImg(a.image) ? (
                    <div className="grid h-24 place-items-center rounded bg-red-50 px-2 text-center text-xs font-bold text-red-600">फोटो उपलब्ध नहीं (पुराना Cloudinary) — नई फोटो के साथ दोबारा बनाएँ</div>
                  ) : (
                    <img src={a.image} alt="" className="max-h-32 w-full rounded object-contain" />
                  )}
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold">{a.title || "बिना नाम"}</p>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${cls}`}>{label}</span>
                  </div>
                  <p className="text-sm text-gray-600">{slotName(a.type)}</p>
                  <p className="truncate text-xs text-gray-500">{a.url}</p>
                  <p className="mt-1 text-xs text-gray-500">अवधि: {fmt(a.startsAt)} → {fmt(a.endsAt)} · क्लिक: <b>{a.clicks || 0}</b></p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Btn color={a.active === false ? "green" : "gray"} onClick={() => patch(a._id, { active: a.active === false }, a.active === false ? "विज्ञापन चालू" : "विज्ञापन बंद")}>{a.active === false ? "चालू करें" : "बंद करें"}</Btn>
                    <Btn color="dark" onClick={() => setEdit({ ...a, startsAt: toInput(a.startsAt), endsAt: toInput(a.endsAt) })}>बदलें</Btn>
                    <Btn onClick={() => remove(a._id)}>हटाएँ</Btn>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {edit && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-4" onClick={() => setEdit(null)}>
          <form onSubmit={saveEdit} onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-md space-y-3 overflow-y-auto rounded-2xl bg-white p-5">
            <h3 className="text-lg font-extrabold">विज्ञापन बदलें</h3>
            <Field label="नाम"><input value={edit.title || ""} onChange={(e) => setEdit({ ...edit, title: e.target.value })} className={inputCls} /></Field>
            <Field label="स्लॉट"><select value={edit.type} onChange={(e) => setEdit({ ...edit, type: e.target.value })} className={inputCls}>{SLOTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
            <Field label="लिंक"><input required type="url" value={edit.url} onChange={(e) => setEdit({ ...edit, url: e.target.value })} className={inputCls} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="शुरू"><input type="date" value={edit.startsAt} onChange={(e) => setEdit({ ...edit, startsAt: e.target.value })} className={inputCls} /></Field>
              <Field label="खत्म"><input type="date" value={edit.endsAt} onChange={(e) => setEdit({ ...edit, endsAt: e.target.value })} className={inputCls} /></Field>
            </div>
            <div className="flex gap-2"><Btn className="flex-1">सेव करें</Btn><Btn type="button" color="gray" onClick={() => setEdit(null)}>रद्द</Btn></div>
          </form>
        </div>
      )}
    </div>
  );
}
