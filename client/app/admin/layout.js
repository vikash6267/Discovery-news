"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import {
  FaTachometerAlt, FaNewspaper, FaPlusCircle, FaClipboardCheck, FaUsers, FaListUl, FaAd, FaBroadcastTower,
  FaPoll, FaImages, FaVideo, FaSignOutAlt, FaExternalLinkAlt, FaBars, FaAngleDoubleLeft, FaAngleDoubleRight, FaTimes,
} from "react-icons/fa";
import logo from "@/public/logo.png";
import { getSession, clearSession, api, ROLE_LABELS, isEditorial, isManager } from "@/lib/admin";
import { AdminContext } from "@/components/admin/AdminContext";

const GROUPS = [
  {
    title: "मुख्य",
    items: [{ href: "/admin", label: "डैशबोर्ड", icon: FaTachometerAlt, show: () => true }],
  },
  {
    title: "खबरें",
    items: [
      { href: "/admin/news/new", label: "नई खबर लिखें", icon: FaPlusCircle, show: () => true },
      { href: "/admin/news", label: "सभी खबरें", icon: FaNewspaper, show: () => true, exact: true },
      { href: "/admin/review", label: "संपादकीय (अप्रूवल)", icon: FaClipboardCheck, show: (r) => isEditorial(r), badge: true },
    ],
  },
  {
    title: "वेबसाइट कंटेंट",
    items: [
      { href: "/admin/breaking", label: "ब्रेकिंग न्यूज़", icon: FaBroadcastTower, show: (r) => isEditorial(r) },
      { href: "/admin/stories", label: "वेब स्टोरीज़", icon: FaImages, show: (r) => isEditorial(r) },
      { href: "/admin/videos", label: "वीडियो / Live", icon: FaVideo, show: (r) => isEditorial(r) },
      { href: "/admin/polls", label: "पोल", icon: FaPoll, show: (r) => isManager(r) },
      { href: "/admin/ads", label: "विज्ञापन", icon: FaAd, show: (r) => isManager(r) },
    ],
  },
  {
    title: "सेटिंग",
    items: [
      { href: "/admin/categories", label: "कैटेगरी", icon: FaListUl, show: (r) => isManager(r) },
      { href: "/admin/users", label: "स्टाफ / रोल", icon: FaUsers, show: (r) => isManager(r) },
    ],
  },
];

const TITLES = [
  ["/admin/news/new", "नई खबर"], ["/admin/news", "खबरें"], ["/admin/review", "संपादकीय"], ["/admin/breaking", "ब्रेकिंग न्यूज़"],
  ["/admin/stories", "वेब स्टोरीज़"], ["/admin/videos", "वीडियो / Live"], ["/admin/polls", "पोल"], ["/admin/ads", "विज्ञापन"],
  ["/admin/categories", "कैटेगरी"], ["/admin/users", "स्टाफ / रोल"], ["/admin", "डैशबोर्ड"],
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState(undefined);
  const [drawer, setDrawer] = useState(false); // mobile
  const [collapsed, setCollapsed] = useState(false); // desktop
  const [pending, setPending] = useState(0);
  const [menu, setMenu] = useState(false);
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    const s = getSession();
    setSession(s);
    if (!s && !isLogin) router.replace("/admin/login");
  }, [pathname, isLogin, router]);

  useEffect(() => {
    setCollapsed(localStorage.getItem("mp_admin_collapsed") === "1");
  }, []);
  const toggleCollapse = () => {
    setCollapsed((c) => {
      localStorage.setItem("mp_admin_collapsed", c ? "0" : "1");
      return !c;
    });
  };

  useEffect(() => {
    setDrawer(false);
    setMenu(false);
  }, [pathname]);

  // pending-approval badge for editors
  const role = session?.user?.role;
  useEffect(() => {
    if (!role || !isEditorial(role)) return;
    const load = () => api("/staff/stats").then((d) => setPending(d.stats.pending)).catch(() => {});
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [role, pathname]);

  if (isLogin) return (<>{children}<Toaster position="top-center" /></>);
  if (!session) return <div className="grid min-h-screen place-items-center text-gray-500">लोड हो रहा है…</div>;

  const logout = () => {
    clearSession();
    router.replace("/admin/login");
  };
  const title = TITLES.find(([p]) => (p === "/admin" ? pathname === "/admin" : pathname.startsWith(p)))?.[1] || "एडमिन";
  const initials = (session.user.name || "A").trim().slice(0, 1).toUpperCase();
  const isActive = (it) => (it.href === "/admin" ? pathname === "/admin" : it.exact ? pathname === it.href || (pathname.startsWith("/admin/news/") && !pathname.startsWith("/admin/news/new")) : pathname.startsWith(it.href));

  const Sidebar = ({ compact }) => (
    <div className="flex h-full flex-col">
      <div className={`flex items-center border-b border-white/10 ${compact ? "justify-center p-3" : "gap-3 p-4"}`}>
        <Link href="/admin" className="shrink-0"><Image src={logo} alt="MP Update" unoptimized className={`${compact ? "h-9" : "h-12"} w-auto rounded-lg`} /></Link>
        {!compact && (
          <div className="min-w-0 flex-1">
            <p className="truncate font-extrabold text-white">MP Update</p>
            <p className="text-xs font-semibold text-yellow-400">एडमिन पैनल</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {GROUPS.map((g) => {
          const items = g.items.filter((i) => i.show(role));
          if (!items.length) return null;
          return (
            <div key={g.title} className="mb-3">
              {!compact ? <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">{g.title}</p> : <div className="mx-3 mb-1 border-t border-white/10" />}
              {items.map((it) => {
                const active = isActive(it);
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    title={it.label}
                    className={`group relative mb-0.5 flex items-center rounded-lg text-sm font-semibold transition-colors ${compact ? "justify-center px-0 py-3" : "gap-3 px-3 py-2.5"} ${active ? "bg-red-600 text-white shadow" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}
                  >
                    <it.icon className="shrink-0" size={compact ? 18 : 16} />
                    {!compact && <span className="flex-1 truncate">{it.label}</span>}
                    {it.badge && pending > 0 && (
                      <span className={`rounded-full bg-yellow-400 px-1.5 text-[11px] font-extrabold text-black ${compact ? "absolute right-1.5 top-1.5" : ""}`}>{pending}</span>
                    )}
                    {compact && <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 hidden -translate-y-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white shadow group-hover:block">{it.label}</span>}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-2">
        <Link href="/" target="_blank" title="वेबसाइट देखें" className={`mb-1 flex items-center rounded-lg text-sm font-semibold text-gray-300 hover:bg-white/10 hover:text-white ${compact ? "justify-center py-3" : "gap-3 px-3 py-2.5"}`}>
          <FaExternalLinkAlt size={15} /> {!compact && "वेबसाइट देखें"}
        </Link>
        <button onClick={toggleCollapse} title={compact ? "मेन्यू फैलाएँ" : "मेन्यू समेटें"} className={`hidden w-full items-center rounded-lg text-sm font-semibold text-gray-400 hover:bg-white/10 hover:text-white lg:flex ${compact ? "justify-center py-3" : "gap-3 px-3 py-2.5"}`}>
          {compact ? <FaAngleDoubleRight /> : <><FaAngleDoubleLeft /> मेन्यू समेटें</>}
        </button>
      </div>
    </div>
  );

  return (
    <AdminContext.Provider value={session}>
      <div className="min-h-screen bg-gray-100">
        {/* desktop sidebar (collapsible) */}
        <aside className={`fixed inset-y-0 left-0 z-40 hidden bg-neutral-950 text-gray-200 shadow-xl transition-[width] duration-200 lg:block ${collapsed ? "w-[68px]" : "w-64"}`}>
          <Sidebar compact={collapsed} />
        </aside>

        {/* mobile drawer */}
        {drawer && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setDrawer(false)} />}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-neutral-950 text-gray-200 shadow-2xl transition-transform lg:hidden ${drawer ? "translate-x-0" : "-translate-x-full"}`}>
          <button className="absolute right-3 top-4 text-white" onClick={() => setDrawer(false)} aria-label="बंद करें"><FaTimes size={20} /></button>
          <Sidebar compact={false} />
        </aside>

        <div className={`min-w-0 transition-[padding] duration-200 ${collapsed ? "lg:pl-[68px]" : "lg:pl-64"}`}>
          <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b bg-white/95 px-3 py-2.5 backdrop-blur sm:px-5">
            <div className="flex min-w-0 items-center gap-2">
              <button className="rounded-lg bg-gray-100 p-2.5 lg:hidden" onClick={() => setDrawer(true)} aria-label="मेन्यू"><FaBars /></button>
              <button className="hidden rounded-lg bg-gray-100 p-2.5 hover:bg-gray-200 lg:block" onClick={toggleCollapse} aria-label="मेन्यू समेटें / फैलाएँ"><FaBars /></button>
              <h1 className="truncate text-lg font-extrabold sm:text-xl">{title}</h1>
            </div>

            <div className="flex items-center gap-2">
              {isEditorial(role) && pending > 0 && (
                <Link href="/admin/review" className="hidden items-center gap-2 rounded-full bg-yellow-100 px-3 py-1.5 text-sm font-bold text-yellow-800 hover:bg-yellow-200 sm:flex">
                  <FaClipboardCheck /> {pending} अप्रूवल बाकी
                </Link>
              )}
              <Link href="/admin/news/new" className="hidden rounded-full bg-red-600 px-4 py-1.5 text-sm font-bold text-white hover:bg-black sm:block">+ नई खबर</Link>

              <div className="relative">
                <button onClick={() => setMenu(!menu)} className="flex items-center gap-2 rounded-full bg-gray-100 py-1 pl-1 pr-3 hover:bg-gray-200">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-red-600 text-sm font-extrabold text-white">{initials}</span>
                  <span className="hidden text-left leading-tight sm:block">
                    <span className="block max-w-[120px] truncate text-sm font-bold">{session.user.name}</span>
                    <span className="block text-[11px] font-semibold text-red-600">{ROLE_LABELS[role] || role}</span>
                  </span>
                </button>
                {menu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenu(false)} />
                    <div className="absolute right-0 z-50 mt-2 w-60 rounded-xl border bg-white p-2 shadow-xl">
                      <div className="border-b px-3 py-2">
                        <p className="font-bold">{session.user.name}</p>
                        <p className="truncate text-xs text-gray-500">{session.user.email}</p>
                        <span className="mt-1 inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">{ROLE_LABELS[role] || role}</span>
                      </div>
                      <Link href="/" target="_blank" className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-gray-100"><FaExternalLinkAlt size={12} /> वेबसाइट देखें</Link>
                      <button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"><FaSignOutAlt /> लॉगआउट</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>
          <main className="p-3 sm:p-5 lg:p-6">{children}</main>
        </div>
      </div>
      <Toaster position="top-center" toastOptions={{ style: { fontWeight: 600 } }} />
    </AdminContext.Provider>
  );
}
