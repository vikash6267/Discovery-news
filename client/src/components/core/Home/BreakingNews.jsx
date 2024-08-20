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
    <>
      {visible && (
        <div className="relative rounded-3xl bg-white shadow-lg">
          {/* Swiper for Breaking News */}
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
            spaceBetween={50}
            slidesPerView={1}
            autoplay={{ delay: 2000 }}
            pagination={{ clickable: true }}
            className="max-w-7xl mx-auto rounded-lg"
          >
            {breakingNews.map(
              (currElem, index) =>
                currElem.active === true && (
                  <SwiperSlide key={index}>
                    <div className="relative bg-red-600 text-white rounded-lg px-4 py-2">
                      <div className="flex items-center gap-2 text-center">
                        <p className="text-lg font-bold italic">
                          BREAKING NEWS ||
                        </p>
                        <div className="h-8 w-1 bg-gray-500"></div>
                        <p className="text-lg">{currElem.name}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                )
            )}
          </Swiper>

          {/* Scrolling News Marquee */}
          <div className="bg-white text-black shadow-md">
            <div className="flex items-center max-w-7xl mx-auto p-2 relative">
              <span className="bg-red-600 text-white py-2 px-4 font-bold">
                Breaking News
              </span>
              <div className="flex-1 overflow-hidden whitespace-nowrap">
                <div className="animate-scroll">
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
              <IoCloseCircle
                size={28}
                className="absolute top-0 right-0 lg:right-10 text-white transform translate-x-1/2 -translate-y-1/2 text-xl cursor-pointer bg-black p-1 rounded-full z-10"
                onClick={() => setVisible(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BreakingNews;
