"use client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/admin";
import { PageTitle, Card, Field, Btn, Empty, inputCls } from "@/components/admin/ui";

export default function CategoriesPage() {
  const [cats, setCats] = useState([]);
  const [cat, setCat] = useState({ name: "", description: "" });
  const [sub, setSub] = useState({ name: "", description: "", category: "" });

  const load = useCallback(async () => {
    try { setCats((await api("/public/menu")).categories); } catch (e) { toast.error(e.message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const run = async (fn, msg) => {
    try { await fn(); toast.success(msg); load(); } catch (e) { toast.error(e.message); }
  };

  return (
    <div>
      <PageTitle>कैटेगरी और सब-कैटेगरी</PageTitle>
      <p className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
        वेबसाइट पर सिर्फ <b>मध्य प्रदेश</b> अलग सेक्शन है। बाकी राज्यों की सब-कैटेगरी की खबरें अपने आप “देश” कॉलम में जुड़ती हैं, राज्यों के नाम अलग से कहीं नहीं दिखते।
      </p>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-extrabold">नई कैटेगरी</h2>
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); run(() => api("/category/create", { method: "POST", body: cat }), "कैटेगरी बन गई").then(() => setCat({ name: "", description: "" })); }}>
            <Field label="नाम"><input required value={cat.name} onChange={(e) => setCat({ ...cat, name: e.target.value })} className={inputCls} /></Field>
            <Field label="विवरण"><input required value={cat.description} onChange={(e) => setCat({ ...cat, description: e.target.value })} className={inputCls} /></Field>
            <Btn>बनाएँ</Btn>
          </form>
        </Card>
        <Card>
          <h2 className="mb-3 font-extrabold">नई सब-कैटेगरी</h2>
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); run(() => api("/subcategory/create", { method: "POST", body: sub }), "सब-कैटेगरी बन गई").then(() => setSub({ name: "", description: "", category: sub.category })); }}>
            <Field label="कैटेगरी">
              <select required value={sub.category} onChange={(e) => setSub({ ...sub, category: e.target.value })} className={inputCls}>
                <option value="">— चुनें —</option>
                {cats.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="नाम"><input required value={sub.name} onChange={(e) => setSub({ ...sub, name: e.target.value })} className={inputCls} /></Field>
            <Field label="विवरण"><input required value={sub.description} onChange={(e) => setSub({ ...sub, description: e.target.value })} className={inputCls} /></Field>
            <Btn>बनाएँ</Btn>
          </form>
        </Card>
      </div>

      <Card className="mt-5">
        {cats.length === 0 && <Empty>कोई कैटेगरी नहीं</Empty>}
        <div className="divide-y">
          {cats.map((c) => (
            <div key={c._id} className="py-3">
              <div className="flex items-center justify-between">
                <p className="font-extrabold">{c.name}</p>
                <Btn color="gray" onClick={() => confirm(`“${c.name}” कैटेगरी हटाएँ?`) && run(() => api(`/category/delete/${c._id}`, { method: "DELETE" }), "हटा दी गई")}>हटाएँ</Btn>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {c.subCategories.map((s) => (
                  <span key={s._id} className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm">
                    {s.name}
                    <button title="हटाएँ" className="font-bold text-red-600" onClick={() => confirm(`“${s.name}” हटाएँ?`) && run(() => api(`/subcategory/delete/${s._id}`, { method: "DELETE" }), "हटा दी गई")}>×</button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
