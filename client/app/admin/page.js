"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaUsers, FaPlusCircle, FaAd, FaBroadcastTower, FaImages, FaPoll, FaClipboardCheck } from "react-icons/fa";
import { api, ROLE_LABELS, isEditorial, isManager } from "@/lib/admin";
import { fmtDate } from "@/lib/news";
import { useAdmin } from "@/components/admin/AdminContext";
import { Card, StatusBadge, Empty } from "@/components/admin/ui";

export default function Dashboard() {
  const { user } = useAdmin();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const editorial = isEditorial(user.role);

  useEffect(() => {
    api("/staff/stats").then((d) => setStats(d.stats)).catch(() => {});
    api("/staff/news?limit=6").then((d) => setRecent(d.news)).catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greet = hour < 12 ? "सुप्रभात" : hour < 17 ? "नमस्कार" : "शुभ संध्या";

  const cards = [
    { label: "प्रकाशित खबरें", value: stats?.approved, icon: FaCheckCircle, tone: "from-green-500 to-green-600", href: "/admin/news?status=approved" },
    { label: "समीक्षा में", value: stats?.pending, icon: FaHourglassHalf, tone: "from-yellow-400 to-orange-500", href: editorial ? "/admin/review" : "/admin/news?status=pending" },
    { label: "अस्वीकृत", value: stats?.rejected, icon: FaTimesCircle, tone: "from-red-500 to-red-700", href: "/admin/news?status=rejected" },
    ...(editorial ? [{ label: "स्टाफ सदस्य", value: stats?.staff, icon: FaUsers, tone: "from-blue-500 to-indigo-600", href: isManager(user.role) ? "/admin/users" : "/admin" }] : []),
  ];

  const actions = [
    { href: "/admin/news/new", label: "नई खबर", icon: FaPlusCircle, show: true },
    { href: "/admin/review", label: "अप्रूवल", icon: FaClipboardCheck, show: editorial },
    { href: "/admin/breaking", label: "ब्रेकिंग", icon: FaBroadcastTower, show: editorial },
    { href: "/admin/stories", label: "वेब स्टोरी", icon: FaImages, show: editorial },
    { href: "/admin/polls", label: "पोल", icon: FaPoll, show: isManager(user.role) },
    { href: "/admin/ads", label: "विज्ञापन", icon: FaAd, show: isManager(user.role) },
  ].filter((a) => a.show);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-neutral-900 p-5 text-white shadow-lg sm:p-7">
        <p className="text-sm font-semibold text-red-100">{greet},</p>
        <h2 className="text-2xl font-extrabold sm:text-3xl">{user.name}</h2>
        <p className="mt-1 text-sm text-red-100">आपकी भूमिका: <b className="text-yellow-300">{ROLE_LABELS[user.role]}</b></p>
        {editorial && stats?.pending > 0 && (
          <Link href="/admin/review" className="mt-4 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-2 text-sm font-extrabold text-black hover:bg-yellow-300">
            <FaClipboardCheck /> {stats.pending} खबरें आपके अप्रूवल का इंतज़ार कर रही हैं →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${c.tone} p-4 text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg`}>
            <c.icon className="absolute -right-2 -top-2 text-white/20 transition group-hover:scale-110" size={72} />
            <p className="text-3xl font-extrabold sm:text-4xl">{c.value ?? "–"}</p>
            <p className="mt-1 text-sm font-semibold text-white/90">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-extrabold">{editorial ? "हाल की खबरें" : "मेरी हाल की खबरें"}</h3>
            <Link href="/admin/news" className="text-sm font-bold text-red-600 hover:underline">सभी देखें →</Link>
          </div>
          {recent.length === 0 && <Empty>अभी कोई खबर नहीं</Empty>}
          <div className="divide-y">
            {recent.map((n) => (
              <Link key={n._id} href={`/admin/news/${n._id}`} className="flex items-start justify-between gap-3 py-3 hover:bg-gray-50">
                <div className="min-w-0">
                  <p className="line-clamp-2 font-semibold leading-snug">{n.title}</p>
                  <p className="mt-1 text-xs text-gray-500">{n.category?.name} · {fmtDate(n.createdAt)}</p>
                </div>
                <StatusBadge status={n.status} />
              </Link>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <h3 className="mb-3 font-extrabold">जल्दी काम</h3>
            <div className="grid grid-cols-3 gap-2">
              {actions.map((a) => (
                <Link key={a.href} href={a.href} className="flex flex-col items-center gap-1.5 rounded-xl bg-gray-50 px-2 py-3 text-center text-xs font-bold text-gray-700 transition hover:bg-red-600 hover:text-white">
                  <a.icon size={20} /> {a.label}
                </Link>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="mb-2 font-extrabold">कामकाज का तरीका</h3>
            {editorial ? (
              <p className="text-sm leading-relaxed text-gray-600">आप खबर सीधे प्रकाशित कर सकते हैं। राइटर और जिला रिपोर्टर की खबरें “संपादकीय” में आती हैं — जाँचकर अप्रूव या कारण के साथ अस्वीकार करें।</p>
            ) : (
              <p className="text-sm leading-relaxed text-gray-600">आपकी खबर सीधे लाइव नहीं होती। पहले संपादक जाँचता है और अप्रूव करने के बाद ही प्रकाशित होती है। अस्वीकार होने पर कारण दिखेगा — सुधारकर दोबारा भेजें।</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
