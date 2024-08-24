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
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const AddSlideBar = () => {
  const { ads } = useSelector((state) => state.news);

  return (
    <div className="flex justify-center items-center -mb-30 lg:mt-0 mt-[110px] ">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2000 }}
        // onSwiper={(swiper) => console.log(swiper)}
        className=""
      >
        {Array.isArray(ads) &&
          ads.map(
            (currElem, index) =>
              currElem?.type === "top-add" && (
                <SwiperSlide key={index}>
                  <Link to={currElem?.url} target="_blank">
                    <img
                      src={currElem?.image}
                      alt="not found"
                      className="w-full"
                    />
                  </Link>
                </SwiperSlide>
              )
          )}
      </Swiper>
    </div>
  );
};

export default AddSlideBar;
