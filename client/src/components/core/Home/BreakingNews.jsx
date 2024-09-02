import React, { useEffect, useState } from "react";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import { fetchBreakingNews } from "../../../services/operations/admin";
import { IoCloseCircle, IoShareSocial } from "react-icons/io5";

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Breaking News",
          text: "Check out this breaking news!",
          url: `https://www.discoveryindianews.com/#breaking`,
        });
        console.log("Thanks for sharing!");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Your browser does not support the Web Share API.");
    }
  };

  return (
    <div id="breaking">
      {visible && (
        <div>
          <div className="w-full mx-auto relative rounded-lg bg-gradient-to-r from-red-700 to-yellow-500 p-2 shadow-2xl overflow-hidden">
            <Swiper
              modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
              spaceBetween={10}
              slidesPerView={1}
              autoplay={{ delay: 4000 }}
              loop={true}
              className="max-w-7xl mx-auto relative"
            >
              {breakingNews.map(
                (currElem, index) =>
                  currElem.active && (
                    <SwiperSlide key={index}>
                      <div className="relative bg-red-800 text-white rounded-lg px-4 py-4 shadow-lg border-4 border-transparent animate-borderGlow">
                        <div className="flex items-center gap-2 sm:gap-4 max-h-[63px] h-[63px] lg:h-[50px]">
                          <p className="text-[14px] sm:text-[20px] lg:text-3xl font-extrabold italic text-yellow-400 tracking-wide drop-shadow-md uppercase">
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
          </div>

          {/* Share Button */}
          <div
            className="bottom-1 z-10 flex text-white font-semibold justify-center mt-4 cursor-pointer"
            onClick={handleShare}
          >
            <div className="bg-red-700 flex gap-1 p-1 rounded-xl">
              Share Breaking
              <IoShareSocial
                size={28}
                className="text-white bg-red-800 p-1 rounded-full cursor-pointer hover:text-red-500 hover:scale-110 transition-all"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreakingNews;
