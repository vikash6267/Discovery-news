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
        <div className="w-11/12 mx-auto relative rounded-3xl">
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
            spaceBetween={50}
            slidesPerView={1}
            autoplay={{ delay: 2000 }}
            className="max-w-7xl mx-auto relative"
          >
            {breakingNews.map(
              (currElem, index) =>
                currElem.active === true && (
                  <SwiperSlide key={index}>
                    <div className="relative bg-red-600 text-white rounded-lg px-2">
                      <div className="flex lg:gap-3 gap-2 text-center max-h-[50px] h-[50px] items-center">
                        <p className="text-[14px] lg:text-2xl font-bold italic">
                          BREAKING NEWS ||
                        </p>
                        <div className="min-h-[100px] min-w-[1px] bg-gray-500"></div>
                        <p className="lg:text-xl text-[14px] lg:ml-4 md:ml-8">
                          {currElem.name}
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                )
            )}
          </Swiper>

          <IoCloseCircle
            size={28}
            className="absolute top-0 right-0 lg:right-10 text-white transform translate-x-1/2 -translate-y-1/2 text-xl cursor-pointer bg-black p-1 rounded-full z-10"
            onClick={() => setVisible(false)}
          />
        </div>
      )}
    </>
  );
};

export default BreakingNews;
