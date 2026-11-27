"use client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/admin";
import { SITE_URL } from "@/lib/site";
import { PageTitle, Card, Field, Btn, Empty, inputCls } from "@/components/admin/ui";

export default function PollsPage() {
  const [polls, setPolls] = useState([]);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const load = useCallback(async () => {
    try { const d = await api("/poll/get"); setPolls(Array.isArray(d) ? d : []); } catch (e) { toast.error(e.message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const create = async (e) => {
    e.preventDefault();
    const opts = options.map((o) => o.trim()).filter(Boolean);
    if (opts.length < 2) return toast.error("कम से कम 2 विकल्प चाहिए");
    try {
      await api("/poll/create", { method: "POST", body: { question, options: opts.map((text) => ({ text })) } });
      toast.success("पोल बन गया");
      setQuestion(""); setOptions(["", ""]); load();
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div>
      <PageTitle>पोल</PageTitle>
      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <Card>
          <h2 className="mb-3 font-extrabold">नया पोल</h2>
          <form onSubmit={create} className="space-y-3">
            <Field label="सवाल"><input required value={question} onChange={(e) => setQuestion(e.target.value)} className={inputCls} /></Field>
            {options.map((o, i) => (
              <Field key={i} label={`विकल्प ${i + 1}`}><input value={o} onChange={(e) => setOptions(options.map((x, k) => (k === i ? e.target.value : x)))} className={inputCls} /></Field>
            ))}
            <Btn type="button" color="gray" onClick={() => setOptions([...options, ""])}>+ विकल्प</Btn>
            <Btn className="w-full">पोल बनाएँ</Btn>
          </form>
        </Card>
        <Card>
          <h2 className="mb-3 font-extrabold">सभी पोल</h2>
          {polls.length === 0 && <Empty>कोई पोल नहीं</Empty>}
          <div className="space-y-4">
            {polls.map((p) => {
              const total = p.options.reduce((s, o) => s + (o.votes || 0), 0);
              return (
                <div key={p._id} className="rounded-lg border p-3">
                  <p className="font-bold">{p.question}</p>
                  <ul className="mt-1 text-sm text-gray-600">
                    {p.options.map((o) => <li key={o._id}>{o.text} — {o.votes || 0} वोट</li>)}
                  </ul>
                  <p className="mt-1 text-xs text-gray-400">कुल {total} वोट · शेयर लिंक: {SITE_URL}/poll/{p._id}</p>
                  <Btn color="gray" className="mt-2" onClick={async () => { if (!confirm("पोल हटाएँ?")) return; try { await api(`/poll/delete/${p._id}`, { method: "DELETE" }); load(); } catch (e) { toast.error(e.message); } }}>हटाएँ</Btn>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
