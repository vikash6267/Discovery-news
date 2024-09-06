import React, { useEffect, useState } from "react";
import { getSingleNews } from "../services/operations/admin";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import { Helmet } from 'react-helmet';
import {
  FaRegEye,
} from "react-icons/fa";
import Contact from "../components/core/singleNews/Contact";
import NewsActive from "../components/core/Home/RightSide/NewsActive";
import { useSelector } from "react-redux";
import CricketLive from "../components/core/Home/RightSide/CricketLive";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  LinkedinShareButton
} from 'react-share';
import {
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaLinkedinIn,
  FaTelegramPlane,
} from "react-icons/fa";

function SingleNews() {
  const { allNews } = useSelector((state) => state.news);

  const [news, setNews] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const dharm = allNews
    .filter((news) => news?.category?._id === "66bdc954433ab78f130e4a0b")
    .sort((a, b) => new Date(b.publish) - new Date(a.publish))
    .slice(0, 9);

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await getSingleNews(id);
        setNews(response);
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

  const currentUrl = window.location.href;

  return (
    <div className=" max-w-7xl mx-auto p-4">
      <Helmet>
        <title>{"Default drter Title"}</title>
        <meta property="og:title" content={ "Default Title"} />
        <meta property="og:description" content="test" />
        <meta property="og:image" content="https://discoveryindianews.com/static/media/logo.855eab8f06c9a753f7fd.jpg" />
        <meta property="og:url" content="diescover.com" />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* News Details */}
        <div className="lg:w-[75%] w-full">
          <div>
            <p className="font-semibold text-2xl font-sans">{news?.title}</p>
            <div className="flex gap-5">
              <p>{news?.createdAt ? formatDate(news.createdAt) : "Date not available"}</p>
              <p className="flex gap-2 items-center">
                <FaRegEye className="text-blue-800" /> {news?.view}
              </p>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="flex space-x-4 mt-4">
            <FacebookShareButton url={currentUrl} quote={news?.title}>
              <div className="p-2 bg-blue-800 rounded-lg">
                <FaFacebookF className="text-white" />
              </div>
            </FacebookShareButton>

            <TwitterShareButton url={currentUrl} title={news?.title}>
              <div className="p-2 bg-blue-500 rounded-lg">
                <FaTwitter className="text-white" />
              </div>
            </TwitterShareButton>

            <LinkedinShareButton url={currentUrl} title={news?.title}>
              <div className="p-2 bg-blue-400 rounded-lg">
                <FaLinkedinIn className="text-blue-700" />
              </div>
            </LinkedinShareButton>

            <WhatsappShareButton url={currentUrl} title={news?.title}>
              <div className="p-2 bg-green-600 rounded-lg">
                <FaWhatsapp className="text-white" />
              </div>
            </WhatsappShareButton>

            <TelegramShareButton url={currentUrl} title={news?.title}>
              <div className="p-2 bg-blue-600 rounded-lg">
                <FaTelegramPlane className="text-white" />
              </div>
            </TelegramShareButton>
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
              <span className="font-bold">{news?.location} {" ।"}</span>
              <span
                dangerouslySetInnerHTML={{ __html: news?.description }}
              ></span>
            </div>
          </div>

          {/* Additional Images */}
          {news?.images?.slice(1).length > 0 && (
            <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {news.images.slice(1).map((imge, index) => (
                <img
                  src={imge.url}
                  alt=""
                  key={index}
                  className="w-full h-auto object-cover rounded-md"
                />
              ))}
            </div>
          )}

          <Contact />
        </div>

        {/* Sidebar */}
        <div className="lg:w-[30%]">
          <NewsActive related={allNews} />
          <div className="mt-[50px]">
            <div className="flex justify-between mb-4 relative">
              <p className="min-w-full min-h-[2px] bg-[#ed0302] absolute bottom-0"></p>
              <p className="flex items-center gap-2 font-bold text-lg bg-[#ed0302] text-white p-2 relative wf">
                Cricket Score
              </p>
            </div>

            <div>
              <CricketLive />
            </div>
          </div>

          {/* Dharm And Jyotishi */}
          <div className="mt-[50px]">
            <div className="flex justify-between mb-4 relative">
              <p className="min-w-full min-h-[2px] bg-[#ed0302] absolute bottom-0"></p>
              <p className="flex items-center gap-2 font-bold text-lg bg-[#ed0302] text-white p-2 relative wf">
                धर्म एवं ज्योतिष
              </p>
            </div>

            <div className="flex gap-3 grid-cols-1 mt-8 p-2 flex-col">
              {dharm?.map((currElem, index) => (
                <Link to={`/${currElem?.slug}`} key={currElem._id}>
                  <div className="flex gap-3">
                    <img
                      src={currElem?.images[0]?.url}
                      alt=""
                      className="w-[105px]"
                    />
                    <p className="text-wrap mt-2 text-sm">
                      {truncateText(currElem.title, 10)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleNews;
