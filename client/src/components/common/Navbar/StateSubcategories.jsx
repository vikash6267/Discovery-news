import React, { useEffect, useState } from "react";
import { fetchCategory } from "../../../services/operations/admin";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const StateSubcategories = () => {
  const { category } = useSelector((state) => state.news);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const pick = (list) =>
      setSubCategories(list?.find((c) => c.name.trim() === "राज्य")?.subCategories || []);
    if (category.length) pick(category);
    else fetchCategory().then((d) => pick(d?.categories));
  }, [category]);

  if (!subCategories.length) return null;

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
        <span className="text-xs font-bold text-red-600 uppercase shrink-0">राज्य</span>
        {subCategories.map((sub) => (
          <Link
            key={sub?._id}
            to={`/subcategory/${sub?._id}`}
            className="rounded-full border border-gray-300 px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors"
          >
            {sub?.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StateSubcategories;
