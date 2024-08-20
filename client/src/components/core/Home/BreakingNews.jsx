import React, { useEffect, useState } from "react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import { fetchBreakingNews } from "../../../services/operations/admin";
import { IoCloseCircle } from "react-icons/io5";

const BreakingNews = () => {
  const [visible, setVisible] = useState(true);
  const [breakingNews, setBreakingNews] = useState([]);

  useEffect(() => {
    const fetchBreakingNewsList = async () => {
      try {
        const response = await fetchBreakingNews();
        setBreakingNews(response || []);
      } catch (error) {
        console.error("Error fetching breaking news:", error);
      }
    };

    fetchBreakingNewsList();
  }, []);

  return (
    <div className="bg-white text-black">
      <div className="flex items-center shadow-lg max-w-7xl mx-auto">
        <span className="bg-gray-200 py-3 px-4 font-bold">खास खबर</span>
        <div className="flex-1 overflow-hidden">
          <div className="whitespace-nowrap animate-scroll">
            {breakingNews.length > 0 ? (
              breakingNews.map((item, index) => (
                <span key={index} className="px-4">
                  • {item?.name}
                </span>
              ))
            ) : (
              <span className="px-4">No breaking news available</span>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BreakingNews;
