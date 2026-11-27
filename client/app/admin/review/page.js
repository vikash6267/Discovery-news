"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { api } from "@/lib/admin";
import { fmtDate, imgOf, stockImg } from "@/lib/news";
import { cleanBody } from "@/components/admin/clean";
import { PageTitle, Card, Btn, Empty, inputCls } from "@/components/admin/ui";

/** Editorial desk: stories sent by writers / district reporters wait here until an editor approves them. */
export default function ReviewPage() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(null); // id of expanded story
  const [detail, setDetail] = useState({});
  const [reason, setReason] = useState({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems((await api("/staff/news?status=pending&limit=50")).news);
    } catch (e) {
      toast.error(e.message);
    }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const expand = async (id) => {
    setOpen(open === id ? null : id);
    if (!detail[id]) {
      try {
        const { news } = await api(`/staff/news/${id}`);
        setDetail((d) => ({ ...d, [id]: news }));
      } catch (e) { toast.error(e.message); }
    }
  };
  const act = async (id, action, body) => {
    try {
      await api(`/staff/news/${id}/${action}`, { method: "PUT", body });
      toast.success(action === "approve" ? "खबर प्रकाशित हो गई" : "खबर अस्वीकृत — लेखक को कारण दिखेगा");
      load();
    } catch (e) { toast.error(e.message); }
  };

  return (
    <div>
      <PageTitle>संपादकीय – अप्रूवल के इंतज़ार में ({items.length})</PageTitle>
      {loading && <Empty>लोड हो रहा है…</Empty>}
      {!loading && items.length === 0 && <Card><Empty>🎉 कोई खबर लंबित नहीं है</Empty></Card>}
      <div className="space-y-4">
        {items.map((n) => {
          const d = detail[n._id];
          const by = (n.submittedBy || n.author)?.name || "—";
          return (
            <Card key={n._id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 gap-3">
                  <img src={imgOf(n)} onError={(e) => (e.currentTarget.src = stockImg(n))} alt="" className="h-20 w-28 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <p className="font-bold leading-snug">{n.title}</p>
                    <p className="mt-1 text-xs text-gray-500">{n.category?.name} · {n.location} · {fmtDate(n.createdAt)} · ✍ {by}{(n.submittedBy || n.author)?.district ? ` (${(n.submittedBy || n.author).district})` : ""}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Btn color="gray" onClick={() => expand(n._id)}>{open === n._id ? "बंद करें" : "पूरी खबर पढ़ें"}</Btn>
                  <Link href={`/admin/news/${n._id}`} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white">सुधारें</Link>
                  <Btn color="green" onClick={() => act(n._id, "approve")}>✓ अप्रूव और प्रकाशित</Btn>
                </div>
              </div>

              {open === n._id && (
                <div className="mt-4 border-t pt-4">
                  {d ? <div className="article-body" dangerouslySetInnerHTML={{ __html: cleanBody(d.description) }} /> : <p className="text-gray-500">लोड हो रहा है…</p>}
                  <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg bg-red-50 p-3">
                    <input value={reason[n._id] || ""} onChange={(e) => setReason((r) => ({ ...r, [n._id]: e.target.value }))} placeholder="अस्वीकार करने का कारण (लेखक को दिखेगा)" className={`${inputCls} flex-1`} />
                    <Btn onClick={() => act(n._id, "reject", { reason: reason[n._id] || "" })}>✗ अस्वीकार करें</Btn>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
