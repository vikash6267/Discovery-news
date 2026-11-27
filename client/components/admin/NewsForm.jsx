"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import "react-quill/dist/quill.snow.css";
import { api, uploadImages, slugify, isEditorial } from "@/lib/admin";
import { useAdmin } from "./AdminContext";
import { Card, Field, Btn, inputCls, PageTitle } from "./ui";

const Quill = dynamic(() => import("react-quill"), { ssr: false, loading: () => <p className="p-4 text-gray-500">एडिटर लोड हो रहा है…</p> });

const TYPES = [
  ["recent-news", "ताज़ा खबर (Recent)"],
  ["top-news", "टॉप न्यूज़"],
  ["big-news", "सबसे बड़ी खबर (Lead)"],
  ["all", "ऑल न्यूज़"],
  ["Interview", "विशेष इंटरव्यू"],
  ["ground-report", "ग्राउंड रिपोर्ट"],
];

const EMPTY = { title: "", subtitle: "", slug: "", location: "", category: "", subcategory: "", type: "recent-news", language: "Hindi", description: "", youtubeurl: "", tags: "", images: [] };

export default function NewsForm({ id }) {
  const { user } = useAdmin();
  const router = useRouter();
  const editorial = isEditorial(user.role);
  const [f, setF] = useState(EMPTY);
  const [menu, setMenu] = useState([]);
  const [imgUrl, setImgUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(!id);
  const [notify, setNotify] = useState(false);

  useEffect(() => {
    api("/public/menu").then((d) => setMenu(d.categories || []));
    if (id) {
      api(`/staff/news/${id}`)
        .then(({ news: n }) => {
          setF({
            title: n.title || "", subtitle: n.subtitle || "", slug: n.slug || "", location: n.location || "",
            category: n.category || "", subcategory: n.subcategory || "", type: n.type || "recent-news",
            language: n.language || "Hindi", description: n.description || "", youtubeurl: n.youtubeurl || "",
            tags: (n.tag || []).join(", "), images: n.images || [],
          });
          setLoaded(true);
        })
        .catch((e) => toast.error(e.message));
    }
  }, [id]);

  const subs = useMemo(() => menu.find((c) => c._id === f.category)?.subCategories || [], [menu, f.category]);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const addFiles = async (files) => {
    if (!files?.length) return;
    const t = toast.loading("फोटो अपलोड हो रही है…");
    try {
      const up = await uploadImages(files);
      setF((s) => ({ ...s, images: [...s.images, ...up] }));
      toast.success("फोटो जुड़ गई", { id: t });
    } catch (e) {
      toast.error(`अपलोड नहीं हुई (${e.message}). नीचे फोटो का लिंक चिपकाएँ।`, { id: t });
    }
  };
  const addUrl = () => {
    if (!/^https?:\/\//.test(imgUrl)) return toast.error("सही फोटो लिंक डालें (https://…)");
    setF((s) => ({ ...s, images: [...s.images, { url: imgUrl, public_id: "external" }] }));
    setImgUrl("");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!f.category) return toast.error("कैटेगरी चुनें");
    if (!f.description || f.description === "<p><br></p>") return toast.error("खबर का मुख्य हिस्सा लिखें");
    setBusy(true);
    try {
      const tag = f.tags.split(",").map((t) => t.trim()).filter(Boolean);
      const body = {
        ...(id ? { id } : {}),
        title: f.title, subtitle: f.subtitle, slug: f.slug || slugify(f.title), location: f.location,
        category: f.category, subcategory: f.subcategory || "", type: f.type, language: f.language,
        description: f.description, youtubeurl: f.youtubeurl,
        images: JSON.stringify(f.images), tag: JSON.stringify(tag.length ? tag : [f.title.split(" ")[0]]),
        notificationSend: notify,
      };
      await api(id ? "/news/update" : "/news/create", { method: id ? "PUT" : "POST", body });
      toast.success(editorial ? "खबर सेव / प्रकाशित हो गई" : "खबर संपादक को समीक्षा के लिए भेज दी गई");
      router.push("/admin/news");
    } catch (err) {
      toast.error(err.message);
    }
    setBusy(false);
  };

  if (!loaded) return <p className="text-gray-500">लोड हो रहा है…</p>;

  return (
    <form onSubmit={submit}>
      <PageTitle actions={<Btn disabled={busy}>{busy ? "सेव हो रहा है…" : editorial ? (id ? "अपडेट करें" : "प्रकाशित करें") : "संपादक को भेजें"}</Btn>}>
        {id ? "खबर संपादित करें" : "नई खबर"}
      </PageTitle>
      {!editorial && (
        <p className="mb-4 rounded-lg bg-yellow-50 p-3 text-sm font-semibold text-yellow-800">आपकी खबर सीधे लाइव नहीं होगी — पहले संपादक जाँचेगा और अप्रूव करने के बाद ही प्रकाशित होगी।</p>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card className="space-y-4">
            <Field label="शीर्षक *"><input required value={f.title} onChange={set("title")} className={inputCls} placeholder="खबर का शीर्षक" /></Field>
            <Field label="उप-शीर्षक"><input value={f.subtitle} onChange={set("subtitle")} className={inputCls} /></Field>
            <Field label="खबर *">
              <div className="rounded-lg bg-white">
                <Quill
                  theme="snow"
                  value={f.description}
                  onChange={(v) => setF((s) => ({ ...s, description: v }))}
                  modules={{ toolbar: [[{ header: [2, 3, false] }], ["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }], ["blockquote", "link"], ["clean"]] }}
                  style={{ minHeight: 260 }}
                />
              </div>
            </Field>
          </Card>

          <Card className="space-y-3">
            <h2 className="font-extrabold">फोटो</h2>
            <div className="flex flex-wrap gap-3">
              {f.images.map((im, i) => (
                <div key={i} className="relative">
                  <img src={im.url} alt="" className="h-24 w-32 rounded-lg object-cover" onError={(e) => (e.currentTarget.style.opacity = 0.3)} />
                  <button type="button" onClick={() => setF((s) => ({ ...s, images: s.images.filter((_, k) => k !== i) }))} className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-600 text-xs font-bold text-white">×</button>
                  {i === 0 && <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 text-[10px] text-white">मुख्य</span>}
                </div>
              ))}
            </div>
            <input type="file" accept="image/*" multiple onChange={(e) => addFiles(e.target.files)} className="block text-sm" />
            <div className="flex gap-2">
              <input value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} placeholder="या फोटो का लिंक चिपकाएँ (https://…)" className={inputCls} />
              <Btn type="button" color="dark" onClick={addUrl}>जोड़ें</Btn>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="space-y-4">
            <Field label="कैटेगरी *">
              <select required value={f.category} onChange={(e) => setF((s) => ({ ...s, category: e.target.value, subcategory: "" }))} className={inputCls}>
                <option value="">— चुनें —</option>
                {menu.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </Field>
            {subs.length > 0 && (
              <Field label="सब-कैटेगरी" hint="मध्य प्रदेश चुनने पर खबर ‘मध्य प्रदेश’ सेक्शन में जाएगी; बाकी राज्य ‘देश’ में जुड़ते हैं।">
                <select value={f.subcategory} onChange={set("subcategory")} className={inputCls}>
                  <option value="">— कोई नहीं —</option>
                  {subs.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </Field>
            )}
            <Field label="जिला / स्थान *"><input required value={f.location} onChange={set("location")} className={inputCls} placeholder="जैसे: भोपाल" /></Field>
            <Field label="खबर का प्रकार">
              <select value={f.type} onChange={set("type")} className={inputCls}>
                {TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </Field>
            <Field label="टैग (कॉमा से अलग)"><input value={f.tags} onChange={set("tags")} className={inputCls} placeholder="भोपाल, चुनाव" /></Field>
            <Field label="URL स्लग" hint="खाली छोड़ने पर अपने आप बन जाएगा"><input value={f.slug} onChange={set("slug")} className={inputCls} placeholder="auto" /></Field>
            <Field label="YouTube लिंक (वैकल्पिक)"><input value={f.youtubeurl} onChange={set("youtubeurl")} className={inputCls} /></Field>
            {!id && editorial && (
              <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} /> नोटिफिकेशन भेजें</label>
            )}
          </Card>
        </div>
      </div>
    </form>
  );
}
