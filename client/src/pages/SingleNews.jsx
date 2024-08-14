import React, { useEffect, useState } from "react";
import { getSingleNews } from "../services/operations/admin";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { FaClock } from "react-icons/fa";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";
import Contact from "../components/core/singleNews/Contact";
import NewsActive from "../components/core/Home/RightSide/NewsActive";
import { useSelector } from "react-redux";

function SingleNews() {
  const { allNews } = useSelector((state) => state.news);

  const [news, setNews] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await getSingleNews(id);
        setNews(response);
        console.log(response);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
      setLoading(false);
    };
    fetchNews();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return format(date, "MMMM d, yyyy h:mm a");
  };
  return (
    <div className=" max-w-7xl mx-auto p-4">
      <div className=" flex flex-col lg:flex-row gap-5 ">
        {/* News Details */}
        <div className=" lg:w-[75%]  w-full ">
          {/* UP */}

          <div>
            <div>
              <p className=" font-semibold text-2xl font-sans">{news?.title}</p>
              <p>
                {news?.createdAt
                  ? formatDate(news.createdAt)
                  : "Date not available"}
              </p>
            </div>

            <div className="flex space-x-4 mt-4">
              <a
                href={`https://facebook.com/sharer/sharer.php?u=${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className=" p-2 bg-blue-800 rounded-lg"
              >
                <FaFacebookF className="  text-white" />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-500 rounded-lg"
              >
                <FaTwitter className="text-white" />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-400 rounded-lg"
              >
                <FaLinkedinIn className="text-blue-700" />
              </a>
              <a
                href={`https://wa.me/?text=${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-green-600 rounded-lg"
              >
                <FaWhatsapp className="text-white" />
              </a>
              <a
                href={`mailto:?subject=Check this out&body=${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-600 rounded-lg"
              >
                <FaEnvelope className="text-gray-100" />
              </a>
            </div>
          </div>

          {/* down */}
          <div className="my-8">
            {/* Image */}
            <div className="float-left md:w-1/3 w-full md:mr-6 mb-4">
              {news?.images?.map((imge, index) => (
                <img
                  src={imge?.url}
                  alt=""
                  key={index}
                  className="w-full h-auto object-cover rounded-md"
                />
              ))}
            </div>

            <div className="leading-7">
              <span className="font-bold ">
                {news?.location} {" ।"}
              </span>
              <span
                dangerouslySetInnerHTML={{ __html: news?.description }}
              ></span>
            </div>
          </div>

          <Contact />
        </div>

        {/* New News */}
        <div className=" lg:w-[30%]">
          <NewsActive realted={allNews} />
        </div>
      </div>
    </div>
  );
}

export default SingleNews;
