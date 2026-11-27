"use client";
import { useState } from "react";
import { NewsRow } from "./NewsCard";

export default function LatestTabs({ tabs }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="mb-3 grid rounded-lg bg-gray-100 p-1" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
        {tabs.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setActive(i)}
            className={`rounded-md py-1.5 text-sm font-bold transition-colors ${active === i ? "bg-red-600 text-white shadow" : "text-gray-700 hover:text-red-600"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="max-h-[28rem] overflow-y-auto pr-1">
        {tabs[active].items.length === 0 && <p className="py-6 text-center text-sm text-gray-500">अभी कोई खबर नहीं</p>}
        {tabs[active].items.map((n) => (
          <NewsRow key={n._id} news={n} thumb="w-20 h-14" />
        ))}
      </div>
    </div>
  );
}
