import React, { useEffect, useState } from "react";
import { getSingleNews } from "../services/operations/admin";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { Helmet } from "react-helmet";
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
import CricketLive from "../components/core/Home/RightSide/CricketLive";
import SectionTitle from "../components/ui/SectionTitle";
import { NewsRow } from "../components/ui/NewsCard";
import { byLatest } from "../components/ui/news";
import { useSelector } from "react-redux";
import { SITE_NAME, SITE_URL } from "../config/site";

const stripHtml = (html = "") => html.replace(/<\/?[^>]+(>|$)/g, "");

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
        setNews(response || {});
      } catch (error) {
        console.error("Error fetching news:", error);
      }
      setLoading(false);
      window.scrollTo({ top: 0 });
    };
    fetchNews();
  }, [id]);

  const related = allNews
    .filter((n) => n?.category?._id && n.category._id === news?.category?._id && n._id !== news?._id)
    .sort(byLatest)
    .slice(0, 6);

  const articleUrl = `${SITE_URL}/${news?.slug || id}`;
  const currentUrl = encodeURIComponent(articleUrl);
  const dateText = news?.createdAt ? format(new Date(news.createdAt), "d MMMM yyyy, h:mm a") : "";
  const desc = stripHtml(news?.description).slice(0, 160);
  const shareBtn = "h-9 w-9 grid place-items-center rounded-full text-white hover:scale-110 transition-transform";

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Helmet>
        <title>{news?.title ? `${news.title} | ${SITE_NAME}` : SITE_NAME}</title>
        <meta name="description" content={desc} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={news?.title} />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={news?.images?.[0]?.url} />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={news?.title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={news?.images?.[0]?.url} />
      </Helmet>

      <div className="flex flex-col lg:flex-row gap-8">
        <article className="lg:w-[70%] w-full bg-white rounded-xl shadow-sm p-5 md:p-8">
          {loading && <p className="text-gray-500">लोड हो रहा है…</p>}
          {news?.category?.name && (
            <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
              {news.category.name}
            </span>
          )}
          <h1 className="text-2xl md:text-4xl font-extrabold leading-tight">{news?.title}</h1>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-y border-gray-200 py-3 text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>{dateText}</span>
              <span className="flex gap-1.5 items-center">
                <FaRegEye className="text-red-600" /> {news?.view ?? 0}
              </span>
            </div>
            <div className="flex gap-2">
              <a aria-label="Facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`} target="_blank" rel="noopener noreferrer" className={`${shareBtn} bg-blue-700`}><FaFacebookF /></a>
              <a aria-label="Twitter" href={`https://twitter.com/intent/tweet?url=${currentUrl}`} target="_blank" rel="noopener noreferrer" className={`${shareBtn} bg-sky-500`}><FaTwitter /></a>
              <a aria-label="LinkedIn" href={`https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}`} target="_blank" rel="noopener noreferrer" className={`${shareBtn} bg-blue-600`}><FaLinkedinIn /></a>
              <a aria-label="WhatsApp" href={`https://wa.me/?text=${encodeURIComponent(`${news?.title}\n${articleUrl}`)}`} target="_blank" rel="noopener noreferrer" className={`${shareBtn} bg-green-600`}><FaWhatsapp /></a>
              <a aria-label="Email" href={`mailto:?subject=${encodeURIComponent(news?.title || "")}&body=${currentUrl}`} className={`${shareBtn} bg-gray-600`}><FaEnvelope /></a>
            </div>
          </div>

          {news?.images?.[0] && (
            <img src={news.images[0].url} alt={news?.title} className="w-full max-h-[480px] object-cover rounded-xl mt-5" />
          )}

          <div className="mt-6 text-lg leading-8 text-gray-800 [&_p]:mb-4 [&_a]:text-red-600 [&_a]:underline [&_img]:rounded-lg [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:my-3">
            <strong>{news?.location}{news?.location ? " । " : ""}</strong>
            <span dangerouslySetInnerHTML={{ __html: news?.description || "" }}></span>
          </div>

          {news?.images?.slice(1).length > 0 && (
            <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {news.images.slice(1).map((imge, index) => (
                <img src={imge.url} alt="" key={index} className="w-full h-auto object-cover rounded-xl" />
              ))}
            </div>
          )}

          <Contact />
        </article>

        <aside className="lg:w-[30%] space-y-6">
          <div className="rounded-xl bg-white shadow-sm p-4">
            <NewsActive name1="ताज़ा खबरें" name2="ज्यादा पढ़ी गई" />
          </div>
          <div className="rounded-xl bg-white shadow-sm p-4">
            <SectionTitle>Cricket Score</SectionTitle>
            <CricketLive />
          </div>
          {related.length > 0 && (
            <div className="rounded-xl bg-white shadow-sm p-4">
              <SectionTitle>{`और पढ़ें: ${news?.category?.name}`}</SectionTitle>
              {related.map((n) => (
                <NewsRow key={n._id} news={n} />
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default SingleNews;
