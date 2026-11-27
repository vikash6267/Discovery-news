"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import logo from "@/public/logo.png";
import { api, setSession, getSession, isStaff } from "@/lib/admin";

export default function LoginPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (getSession()) router.replace("/admin");
  }, [router]);

  const submit = async (e) => {
    e.preventDefault();
    const { email, password } = Object.fromEntries(new FormData(e.currentTarget));
    setBusy(true);
    try {
      const data = await api("/auth/login", { method: "POST", body: { email, password } });
      if (!isStaff(data.user.role)) throw new Error("इस अकाउंट को एडमिन पैनल की अनुमति नहीं है");
      setSession({ token: data.token, user: { _id: data.user._id, name: data.user.name, email: data.user.email, role: data.user.role, district: data.user.district } });
      router.replace("/admin");
    } catch (err) {
      toast.error(err.message);
    }
    setBusy(false);
  };

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-red-800 via-red-600 to-neutral-900 p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-2xl">
        <Image src={logo} alt="MP Update" unoptimized className="mx-auto mb-4 h-24 w-auto rounded-xl" />
        <h1 className="mb-1 text-center text-2xl font-extrabold">एडमिन लॉगिन</h1>
        <p className="mb-5 text-center text-sm text-gray-500">मास्टर एडमिन · सब एडमिन · संपादक · राइटर · जिला रिपोर्टर</p>
        <input name="email" type="email" required placeholder="ईमेल" className="mb-3 w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-red-600" />
        <input name="password" type="password" required placeholder="पासवर्ड" className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-red-600" />
        <button disabled={busy} className="w-full rounded-lg bg-red-600 py-2.5 font-bold text-white hover:bg-black disabled:opacity-60">{busy ? "लॉगिन हो रहा है…" : "लॉगिन"}</button>
      </form>
    </div>
  );
}
