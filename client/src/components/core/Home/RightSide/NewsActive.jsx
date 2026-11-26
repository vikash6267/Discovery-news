import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NewsRow } from "../../../ui/NewsCard";
import { byLatest } from "../../../ui/news";

const TYPES = {
  "ताज़ा खबरें": ["recent-news", "top-news"],
  "विशेष इंटरव्यू": ["Interview", "ground-report"],
};

const NewsActive = ({ name1, name2 }) => {
  const [active, setActive] = useState(0);
  const { allNews } = useSelector((state) => state.news);
  const types = TYPES[name1] || TYPES["ताज़ा खबरें"];
  const list = [...allNews].filter((n) => n?.type === types[active]).sort(byLatest).slice(0, 25);

  return (
    <div>
      <div className="grid grid-cols-2 mb-3 rounded-lg bg-gray-100 p-1">
        {[name1, name2].map((name, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`rounded-md py-1.5 text-sm font-bold transition-colors ${
              active === i ? "bg-red-600 text-white shadow" : "text-gray-700 hover:text-red-600"
            }`}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="max-h-[28rem] overflow-y-auto pr-1">
        {list.length === 0 && <p className="text-sm text-gray-500 py-6 text-center">अभी कोई खबर नहीं</p>}
        {list.map((n) => (
          <NewsRow key={n._id} news={n} thumb="w-20 h-14" />
        ))}
      </div>
    </div>
  );
};

export default NewsActive;
