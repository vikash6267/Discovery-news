import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import NewsActive from "./RightSide/NewsActive";
import CricketLive from "./RightSide/CricketLive";
import RightAds from "../../common/RightAds";
import SectionTitle from "../../ui/SectionTitle";
import { NewsCard, NewsRow } from "../../ui/NewsCard";
import { byLatest } from "../../ui/news";
import { fetchCategory } from "../../../services/operations/admin";
import { saveCategory } from "../../../redux/newsSlice";

const STATE = "राज्य";
const PREFERRED = ["राजनीति", "देश", "विदेश"];

function CategoryWise() {
  const dispatch = useDispatch();
  const { allNews, ads, category } = useSelector((state) => state.news);

  useEffect(() => {
    if (category.length) return;
    fetchCategory().then((d) => d?.categories?.length && dispatch(saveCategory(d.categories)));
  }, [category.length, dispatch]);

  // Sections are built from the categories the backend returns (no hard-coded DB ids).
  const sections = useMemo(() => {
    const latest = [...allNews].sort(byLatest);
    const list = [];
    category.forEach((cat) => {
      const name = cat.name.trim();
      if (name === STATE) {
        (cat.subCategories || []).forEach((sub) =>
          list.push({
            id: sub._id,
            title: sub.name,
            href: `/subcategory/${sub._id}`,
            news: latest.filter((n) => n?.subcategory?._id === sub._id).slice(0, 5),
            order: 10,
          })
        );
      } else {
        const p = PREFERRED.indexOf(name);
        list.push({
          id: cat._id,
          title: name,
          href: `/category/${cat._id}`,
          news: latest.filter((n) => n?.category?._id === cat._id).slice(0, 5),
          order: p === -1 ? 20 : p,
        });
      }
    });
    return list.filter((s) => s.news.length).sort((a, b) => a.order - b.order);
  }, [allNews, category]);

  const allN = [...allNews].filter((n) => n?.type === "all").sort(byLatest).slice(0, 6);
  const rightAds = Array.isArray(ads) ? ads.filter((a) => a?.type === "right-add") : [];

  return (
    <div className="grid gap-8 lg:grid-cols-4 my-8">
      <div className="lg:col-span-3 space-y-10">
        {sections.length === 0 && (
          <p className="text-center text-gray-500 py-16">खबरें लोड हो रही हैं…</p>
        )}
        {sections.map((s) => (
          <section key={s.id}>
            <SectionTitle href={s.href}>{s.title}</SectionTitle>
            <div className="grid gap-5 md:grid-cols-5">
              <div className="md:col-span-3">
                <NewsCard news={s.news[0]} heightClass="h-52 md:h-64" titleClass="text-lg" words={16} />
              </div>
              <div className="md:col-span-2">
                {s.news.slice(1).map((n) => (
                  <NewsRow key={n._id} news={n} />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      <aside className="space-y-8">
        <div className="rounded-xl bg-white shadow-sm p-4">
          <NewsActive name1="ताज़ा खबरें" name2="ज्यादा पढ़ी गई" />
        </div>

        <div className="rounded-xl bg-white shadow-sm p-4">
          <SectionTitle>Cricket Score</SectionTitle>
          <CricketLive />
        </div>

        {rightAds.map((ad, i) => (
          <a key={i} href={ad?.url || "#"} target="_blank" rel="noopener noreferrer" className="block">
            <img src={ad?.image} alt="Advertisement" className="w-full rounded-xl shadow-md hover:shadow-lg transition" />
          </a>
        ))}

        <div className="rounded-xl bg-white shadow-sm p-4">
          <NewsActive name1="विशेष इंटरव्यू" name2="ग्राउंड रिपोर्ट" />
        </div>

        {allN.length > 0 && (
          <div className="rounded-xl bg-white shadow-sm p-4">
            <SectionTitle>All News</SectionTitle>
            {allN.map((n) => (
              <NewsRow key={n._id} news={n} />
            ))}
          </div>
        )}
        <RightAds />
      </aside>
    </div>
  );
}

export default CategoryWise;
