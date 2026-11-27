"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api, isEditorial } from "@/lib/admin";
import { fmtDate } from "@/lib/news";
import { useAdmin } from "@/components/admin/AdminContext";
import { PageTitle, Card, Btn, StatusBadge, Empty, inputCls } from "@/components/admin/ui";

const TABS = [["all", "सभी"], ["approved", "प्रकाशित"], ["pending", "समीक्षा में"], ["rejected", "अस्वीकृत"]];
const LIMIT = 15;

function NewsList() {
  const { user } = useAdmin();
  const router = useRouter();
  const sp = useSearchParams();
  const status = sp.get("status") || "all";
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ news: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const editorial = isEditorial(user.role);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await api(`/staff/news?status=${status}&page=${page}&limit=${LIMIT}&q=${encodeURIComponent(q)}`));
    } catch (e) {
      toast.error(e.message);
    }
    setLoading(false);
  }, [status, page, q]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (fn, okMsg) => {
    try {
      await fn();
      toast.success(okMsg);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const remove = (n) => {
    if (!confirm(`“${n.title}” हमेशा के लिए हटाएँ?`)) return;
    act(() => api("/news/delete", { method: "DELETE", body: { id: n._id } }), "खबर हटा दी गई");
  };

  return (
    <div>
      <PageTitle actions={<Link href="/admin/news/new" className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-black">+ नई खबर</Link>}>
        {editorial ? "सभी खबरें" : "मेरी खबरें"}
      </PageTitle>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
            {TABS.map(([k, l]) => (
              <button key={k} onClick={() => { setPage(1); router.replace(`/admin/news?status=${k}`); }} className={`rounded-md px-3 py-1.5 text-sm font-bold ${status === k ? "bg-red-600 text-white" : "text-gray-600 hover:text-red-600"}`}>{l}</button>
            ))}
          </div>
          <input value={q} onChange={(e) => { setPage(1); setQ(e.target.value); }} placeholder="शीर्षक खोजें…" className={`${inputCls} max-w-xs`} />
        </div>

        {loading && <Empty>लोड हो रहा है…</Empty>}
        {!loading && data.news.length === 0 && <Empty>कोई खबर नहीं मिली</Empty>}

        <div className="divide-y">
          {data.news.map((n) => (
            <div key={n._id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-bold leading-snug">{n.title}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                  <StatusBadge status={n.status} />
                  <span>{n.category?.name}{n.subcategory?.name ? ` › ${n.subcategory.name}` : ""}</span>
                  <span>{fmtDate(n.createdAt)}</span>
                  {(n.submittedBy || n.author)?.name && <span>✍ {(n.submittedBy || n.author).name}</span>}
                  <span>👁 {n.view ?? 0}</span>
                </p>
                {n.status === "rejected" && n.rejectReason && <p className="mt-1 text-xs font-semibold text-red-600">कारण: {n.rejectReason}</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                {n.status === "approved" && <a href={`/${n.slug}`} target="_blank" className="rounded-lg bg-gray-200 px-3 py-1.5 text-sm font-bold hover:bg-gray-300">देखें</a>}
                <Link href={`/admin/news/${n._id}`} className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-bold text-white hover:bg-black">संपादित करें</Link>
                {editorial && n.status !== "approved" && <Btn color="green" onClick={() => act(() => api(`/staff/news/${n._id}/approve`, { method: "PUT" }), "खबर प्रकाशित हो गई")}>अप्रूव</Btn>}
                {editorial && n.status === "approved" && <Btn color="gray" onClick={() => act(() => api(`/staff/news/${n._id}/unpublish`, { method: "PUT" }), "खबर हटाकर समीक्षा में भेजी")}>अनपब्लिश</Btn>}
                {editorial && <Btn onClick={() => remove(n)}>हटाएँ</Btn>}
              </div>
            </div>
          ))}
        </div>

        {data.total > LIMIT && (
          <div className="mt-4 flex items-center justify-between">
            <Btn color="gray" disabled={page === 1} onClick={() => setPage(page - 1)}>← पिछला</Btn>
            <span className="text-sm text-gray-500">पेज {page} / {Math.ceil(data.total / LIMIT)}</span>
            <Btn color="gray" disabled={page >= Math.ceil(data.total / LIMIT)} onClick={() => setPage(page + 1)}>अगला →</Btn>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Empty>लोड हो रहा है…</Empty>}>
      <NewsList />
    </Suspense>
  );
}
