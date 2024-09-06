import React, { useEffect, useState } from "react";
import { getSingleNews } from "../services/operations/admin";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaEnvelope,
  FaRegEye,
} from "react-icons/fa";
import Contact from "../components/core/singleNews/Contact";
import NewsActive from "../components/core/Home/RightSide/NewsActive";
import { useSelector } from "react-redux";
import CricketLive from "../components/core/Home/RightSide/CricketLive";

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

        // Set the page title and meta tags dynamically
        document.title = response?.title || "News Details";
        document
          .querySelector('meta[name="description"]')
          ?.setAttribute("content", response?.description?.slice(0, 150) || "");

        // Open Graph meta tags
        document
          .querySelector('meta[property="og:title"]')
          ?.setAttribute("content", response?.title || "");
        document
          .querySelector('meta[property="og:description"]')
          ?.setAttribute("content", response?.description?.slice(0, 150) || "");
        document
          .querySelector('meta[property="og:image"]')
          ?.setAttribute("content", response?.images?.[0]?.url || "");
        document
          .querySelector('meta[property="og:url"]')
          ?.setAttribute("content", window.location.href || "");
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

  const currentUrl = encodeURIComponent(window.location.href);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-5">
        {/* News Details */}
        <div className="lg:w-[75%] w-full">
          <div>
            <p className="font-semibold text-2xl font-sans">{news?.title}</p>
            <div className="flex gap-5">
              <p>
                {news?.createdAt ? formatDate(news.createdAt) : "Date not available"}
              </p>
              <p className="flex gap-2 items-center">
                <FaRegEye className="text-blue-800" /> {news?.view}
              </p>
            </div>
          </div>

          {/* Main Image and Description */}
          <div className="my-8">
            <div className="float-left md:w-1/3 w-full md:mr-6 mb-4">
              {news?.images?.[0] && (
                <img
                  src={news.images[0].url}
                  alt=""
                  className="w-full h-auto object-cover rounded-md"
                />
              )}
            </div>

            <div className="leading-7">
              <span className="font-bold">
                {news?.location} {" ।"}
              </span>
              <span
                dangerouslySetInnerHTML={{ __html: news?.description }}
              ></span>
            </div>
          </div>

          <Contact />
        </div>

        {/* Sidebar */}
        <div className="lg:w-[30%]">
          <NewsActive realted={allNews} />
          <CricketLive />
        </div>
      </div>
    </div>
  );
}

export default SingleNews;
