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
        <div className="w-full mx-auto relative rounded-lg bg-gradient-to-r from-red-700 to-yellow-500 p-2 shadow-2xl overflow-hidden">
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
            spaceBetween={10}
            slidesPerView={1}
            autoplay={{ delay: 1500 }}
            loop={true}
            className="max-w-7xl mx-auto relative"
          >
            {breakingNews.map(
              (currElem, index) =>
                currElem.active && (
                  <SwiperSlide key={index}>
                    <div className="relative bg-red-800 text-white rounded-lg px-4 py-4 shadow-lg border-4 border-transparent animate-borderGlow">
                      <div className="flex items-center gap-2 sm:gap-4 max-h-[50px] h-[50px]">
                        <p className="text-[16px] sm:text-[20px] lg:text-3xl font-extrabold italic text-yellow-400 tracking-wide drop-shadow-md uppercase">
                          Breaking News
                        </p>
                        <div className="h-[30px] sm:h-[50px] w-[2px] sm:w-[3px] bg-yellow-400"></div>
                        <p className="text-[14px] sm:text-[18px] lg:text-xl font-semibold text-white tracking-wide drop-shadow-md">
                          {currElem.name}
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                )
            )}
          </Swiper>

          {/* <IoCloseCircle
            size={28}
            className="absolute top-2 right-2 text-white bg-red-800 p-1 rounded-full cursor-pointer hover:text-red-500 hover:scale-110 transition-all"
            onClick={() => setVisible(false)}
          /> */}
        </div>
      )}
    </>
  );
};

export default BreakingNews;
