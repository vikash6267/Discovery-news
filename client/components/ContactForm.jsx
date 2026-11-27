"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { API_URL } from "@/lib/site";

export default function ContactForm() {
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setBusy(true);
    try {
      const res = await fetch(`${API_URL}/contact/create`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      toast.success("धन्यवाद! हम जल्द संपर्क करेंगे।");
      form.reset();
    } catch {
      toast.error("संदेश नहीं भेजा जा सका");
    }
    setBusy(false);
  };

  const field = "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-red-600";
  return (
    <form onSubmit={submit} className="space-y-3">
      <input name="name" required placeholder="आपका नाम" className={field} />
      <input name="email" type="email" required placeholder="ईमेल" className={field} />
      <input name="location" required placeholder="शहर / जिला" className={field} />
      <textarea name="message" required rows={5} placeholder="आपका संदेश या विज्ञापन की जानकारी" className={field} />
      <button disabled={busy} className="rounded-lg bg-red-600 px-8 py-2.5 font-bold text-white hover:bg-black disabled:opacity-60">
        {busy ? "भेजा जा रहा है…" : "संदेश भेजें"}
      </button>
    </form>
  );
}
