import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { DiCodeigniter } from "react-icons/di";

function LatestNews() {
  const { allNews } = useSelector((state) => state.news);

  const latestNews =allNews
  .filter((news) => news.type === "big-news")
  .sort((a, b) => new Date(b.publish) - new Date(a.publish))
  .slice(0, 5);



  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  return (
    <div className="  p-1 my-10  ">
      <div>
        <div className=" grid lg:grid-cols-4 grid-cols-1 gap-6 ">
          {/* //top */}
          <div className=" col-span-2">
            {latestNews[0] && (
              <Link to={`/${latestNews[0]?.slug}`} className=" relative">
                <img src={latestNews[0]?.images[0]?.url} alt="" className=" max-h-[340px] w-full object-cover" />
                <p className="font-semibold absolute bottom-0 text-white text-center bg-black bg-opacity-60 w-full py-5">
                  {truncateText(latestNews[0]?.title, 10)}
                  <p>{latestNews[0]?.createAt}</p>
                </p>
              </Link>
            )}
          </div>

          <div className="col-span-2 ">
            <div className=" hidden lg:grid grid-cols-2 gap-5  max-h-[200px] lg:max-w-[1200px] ">
              <div className=" flex lg:block">
                {latestNews.slice(1, 3).map((news) => (
                  <Link
                    to={`/${news?.slug}`}
                    key={news._id}
                    className="mb-4 flex gap-2 relative"
                  >
                    <img
                      src={news?.images[0]?.url}
                      alt=""
                      className="max-h-[160px] min-[150px] w-full object-cover"
                    />
                    <p className="text-[10px] font-semibold absolute bottom-0 text-white text-center bg-black bg-opacity-60 w-full py-2">
                      {truncateText(news?.title, 10)}
                    </p>
                  </Link>
                ))}
              </div>

              <div className="flex lg:block ">
                {latestNews.slice(3, 5).map((news) => (
                  <Link
                    to={`/${news?.slug}`}
                    key={news._id}
                    className="mb-4 flex gap-2 relative"
                  >
                    <img
                      src={news?.images[0]?.url}
                      alt=""
                      className="max-h-[160px]  w-full object-cover"
                    />
                    <p className="text-[10px] font-semibold absolute bottom-0 text-white text-center bg-black bg-opacity-60 w-full py-2">
                      {truncateText(news?.title, 10)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto max-h-[190px] whitespace-nowrap lg:hidden">
            {latestNews.slice(1).map((news) => (
              <Link
                to={`/${news?.slug}`}
                key={news._id}
                className="mb-4  gap-2 relative inline-block"
              >
                <img
                  src={news?.images[0]?.url}
                  alt=""
                  className=" min-w-[150px]  w-full object-cover"
                />
                <p className="text-[10px] font-semibold absolute bottom-0 text-white text-center bg-black bg-opacity-60 w-full py-2 px-2">
                  {truncateText(news?.title, 5)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LatestNews;
