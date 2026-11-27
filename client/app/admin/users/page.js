"use client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, ROLE_LABELS } from "@/lib/admin";
import { useAdmin } from "@/components/admin/AdminContext";
import { PageTitle, Card, Field, Btn, Empty, inputCls } from "@/components/admin/ui";

const ROLE_HELP = {
  Admin: "सब एडमिन – सभी सेक्शन मैनेज कर सकता है, खबर सीधे प्रकाशित करता है",
  Editor: "संपादक – खबरें जाँचकर अप्रूव / अस्वीकार करता है",
  Writer: "कंटेंट राइटर – खबर लिखता है, प्रकाशन संपादक के अप्रूवल के बाद",
  Reporter: "जिला रिपोर्टर – अपने जिले की खबर भेजता है, प्रकाशन संपादक के अप्रूवल के बाद",
};

export default function UsersPage() {
  const { user } = useAdmin();
  const [users, setUsers] = useState([]);
  const [assignable, setAssignable] = useState([]);
  const [f, setF] = useState({ name: "", email: "", password: "", role: "Reporter", district: "" });
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const d = await api("/staff/users");
      setUsers(d.users);
      setAssignable(d.assignable);
      if (d.assignable.length && !d.assignable.includes(f.role)) setF((s) => ({ ...s, role: d.assignable[d.assignable.length - 1] }));
    } catch (e) { toast.error(e.message); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [load]);

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const create = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api("/staff/users", { method: "POST", body: f });
      toast.success("अकाउंट बन गया");
      setF({ name: "", email: "", password: "", role: f.role, district: "" });
      load();
    } catch (err) { toast.error(err.message); }
    setBusy(false);
  };
  const update = async (id, body, msg) => {
    try { await api(`/staff/users/${id}`, { method: "PUT", body }); toast.success(msg); load(); } catch (e) { toast.error(e.message); }
  };
  const remove = async (u) => {
    if (!confirm(`${u.name} का अकाउंट हटाएँ?`)) return;
    try { await api(`/staff/users/${u._id}`, { method: "DELETE" }); toast.success("हटा दिया"); load(); } catch (e) { toast.error(e.message); }
  };
  const canTouch = (u) => assignable.includes(u.role) && u._id !== user._id;

  return (
    <div>
      <PageTitle>स्टाफ और रोल</PageTitle>
      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <Card>
          <h2 className="mb-3 font-extrabold">नया स्टाफ अकाउंट</h2>
          <form onSubmit={create} className="space-y-3">
            <Field label="नाम"><input required value={f.name} onChange={set("name")} className={inputCls} /></Field>
            <Field label="ईमेल (यही यूज़र आईडी है)"><input required type="email" value={f.email} onChange={set("email")} className={inputCls} /></Field>
            <Field label="पासवर्ड"><input required minLength={6} value={f.password} onChange={set("password")} className={inputCls} /></Field>
            <Field label="रोल" hint={ROLE_HELP[f.role]}>
              <select value={f.role} onChange={set("role")} className={inputCls}>
                {assignable.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
              </select>
            </Field>
            <Field label="जिला (रिपोर्टर के लिए)"><input value={f.district} onChange={set("district")} className={inputCls} placeholder="जैसे: इंदौर" /></Field>
            <Btn disabled={busy} className="w-full">{busy ? "बन रहा है…" : "अकाउंट बनाएँ"}</Btn>
          </form>
        </Card>

        <Card>
          <h2 className="mb-3 font-extrabold">सभी स्टाफ ({users.length})</h2>
          {users.length === 0 && <Empty>कोई स्टाफ नहीं</Empty>}
          <div className="divide-y">
            {users.map((u) => (
              <div key={u._id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-bold">{u.name} {u.active === false && <span className="ml-1 rounded bg-gray-200 px-1.5 text-xs">बंद</span>}</p>
                  <p className="text-xs text-gray-500">{u.email}{u.district ? ` · ${u.district}` : ""}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {canTouch(u) ? (
                    <select value={u.role} onChange={(e) => update(u._id, { role: e.target.value }, "रोल बदला")} className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm font-semibold">
                      {assignable.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                    </select>
                  ) : (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">{ROLE_LABELS[u.role]}</span>
                  )}
                  {canTouch(u) && (
                    <>
                      <Btn color="gray" onClick={() => update(u._id, { active: u.active === false }, u.active === false ? "अकाउंट चालू" : "अकाउंट बंद")}>{u.active === false ? "चालू करें" : "बंद करें"}</Btn>
                      <Btn color="gray" onClick={() => { const p = prompt("नया पासवर्ड (कम से कम 6 अक्षर)"); if (p && p.length >= 6) update(u._id, { password: p }, "पासवर्ड बदल गया"); }}>पासवर्ड</Btn>
                      <Btn onClick={() => remove(u)}>हटाएँ</Btn>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
