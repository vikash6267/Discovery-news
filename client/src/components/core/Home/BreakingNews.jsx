import React from "react";

const newsItems = [
  "खास खबर 1",
  "खास खबर 2",
  "खास खबर 3",
  "खास खबर 4",
  "खास खबर 5",
  "खास खबर 6",
];

const BreakingNews = () => {
  return (
    <div className="bg-white text-black ">
      <div className="flex items-center shadow-lg max-w-7xl mx-auto">
        <span className="bg-gray-200 py-3 px-4 font-bold">खास खबर</span>
        <div className="flex-1 overflow-hidden">
          <div className="whitespace-nowrap animate-scroll">
            {newsItems.map((item, index) => (
              <span key={index} className="px-4">
                • {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakingNews;
