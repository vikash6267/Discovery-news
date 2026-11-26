import React, { useEffect, useState } from "react";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import { fetchBreakingNews } from "../../../services/operations/admin";
import { IoShareSocial } from "react-icons/io5";
import { SITE_URL } from "../../../config/site";

const BreakingNews = () => {
  const [visible, setVisible] = useState(true);
  const [breakingNews, setBreakingNews] = useState([]);
  const [currentNews, setCurrentNews] = useState(null);

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
    if (navigator.share && currentNews) {
      try {
        await navigator.share({
          title: "Breaking News",
          title: "Breaking News",
          text: `Breaking News\n${currentNews.name}\n${SITE_URL}/#breaking\n\nVisit the latest news:\n${SITE_URL}/`,
        });
        console.log("Thanks for sharing!");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Your browser does not support the Web Share API or no news selected.");
    }
  };
  

  const active = breakingNews.filter((n) => n.active);
  if (!visible || active.length === 0) return <div id="breaking" />;

  return (
    <div id="breaking" className="bg-black border-b border-red-900">
      <div className="max-w-7xl mx-auto flex items-stretch">
        <div className="flex items-center gap-2 bg-red-600 px-3 md:px-5 text-white font-extrabold uppercase tracking-wide text-xs md:text-base shrink-0 [clip-path:polygon(0_0,100%_0,calc(100%-12px)_100%,0_100%)] pr-6">
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-300 animate-pulse" />
          Breaking
        </div>
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={active.length > 1}
          className="flex-1 min-w-0 !mx-0"
          onSlideChange={(swiper) => setCurrentNews(active[swiper.realIndex])}
        >
          {active.map((n, i) => (
            <SwiperSlide key={i}>
              <p className="px-4 py-2.5 text-white text-sm md:text-lg font-semibold truncate">{n.name}</p>
            </SwiperSlide>
          ))}
        </Swiper>
        <button onClick={handleShare} aria-label="Share breaking news" className="px-3 md:px-4 text-yellow-400 hover:text-white transition-colors">
          <IoShareSocial size={22} />
        </button>
      </div>
    </div>
  );
};

export default BreakingNews;
