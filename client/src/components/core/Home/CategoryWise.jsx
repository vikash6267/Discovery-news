import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DiCodeigniter } from "react-icons/di";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { format } from "date-fns";
import NewsActive from "./RightSide/NewsActive";
import CricketLive from "./RightSide/CricketLive";

function CategoryWise() {
  const { allNews } = useSelector((state) => state.news);
  const [newsActive, setNewsActive] = useState(0);

  const rajneeti = allNews
    .filter((news) => news.category._id === "669644aa69a6d788e2c6770d")
    .sort((a, b) => new Date(b.publish) - new Date(a.publish))
    .slice(0, 5);

  useEffect(() => {
    console.log(rajneeti);
  }, []);

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return format(date, "MMMM d, yyyy h:mm a");
  };
  return (
    <div className=" grid lg:grid-cols-4 gap-4">
      <div className=" col-span-3">
        {/* Rajneeti */}
        <div className="  p-1 my-10  ">
          <div>
            <div className=" flex justify-between mb-4 relative">
              <p className=" min-w-full min-h-[2px] bg-[#ed0302] absolute bottom-0 "></p>
              <p className=" flex items-center gap-2 font-bold text-lg bg-[#ed0302] text-white p-2 relative wf">
                {" "}
                राजनीति
              </p>
              <Link
                className=" flex items-center gap-2"
                to={`/category/669644aa69a6d788e2c6770d`}
              >
                और भी जानै{" "}
                <FaArrowUpRightFromSquare className=" text-blue-600" />
              </Link>
            </div>

            <div className=" grid lg:grid-cols-3 grid-cols-1 gap-6 ">
              {/* //top */}
              <div className=" col-span-2">
                {rajneeti[0] && (
                  <Link to={`/${rajneeti[0]?.slug}`} className=" relative">
                    <img
                      src={rajneeti[0]?.images[0]?.url}
                      alt=""
                      className="lg:h-[320px] h-[250px] lg:w-full w-[80%] object-cover border-r-[1px] border-l-[1px] border-red-500 pr-3 pl-3"
                    />
                    <p className="font-semibold  bottom-0  text- text-gray-500 bg-opacity-60 w-full py-5">
                      {truncateText(rajneeti[0]?.title, 10)}
                      <p className="text-gray-400 text-[12px]">
                        {rajneeti[0]?.createdAt
                          ? formatDate(rajneeti[0]?.createdAt)
                          : "Date not available"}
                      </p>
                    </p>
                  </Link>
                )}

                {/* {rajneeti[1] && (
              <Link
                to={`/${rajneeti[1]?.slug}`}
                className="flex gap-2 mt-4"
              >
                <img
                  src={rajneeti[1]?.images[0]?.url}
                  alt=""
                  className="h-[60px]"
                />
                <p className="font-semibold text-[12px]">
                  {truncateText(rajneeti[1]?.title, 20)}
                </p>
              </Link>
            )} */}
              </div>

              <div>
                <div>
                  {rajneeti.slice(1).map((news) => (
                    <Link
                      to={`/${news?.slug}`}
                      key={news._id}
                      className="mb-4 flex gap-3"
                    >
                      <img
                        src={news?.images[0]?.url}
                        alt=""
                        className="h-[65px] min-w-[110px]"
                      />
                      <p className="font-semibold text-[12px] ">
                        {truncateText(news?.title, 20)}
                        <p className="text-gray-400 text-[12px]">
                          {news.createdAt
                            ? formatDate(rajneeti[0]?.createdAt)
                            : "Date not available"}
                        </p>
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desh Videsh  */}
        <div className=" grid lg:grid-cols-2 gap-4">
          {/* Desh */}
          <div className="  p-1 my-10  ">
            <div>
              <div className=" flex justify-between mb-4 relative">
                <p className=" min-w-full min-h-[2px] bg-[#ed0302] absolute bottom-0 "></p>
                <p className=" flex items-center gap-2 font-bold text-lg bg-[#ed0302] text-white p-2 relative wf">
                  {" "}
                  देश
                </p>
                <Link
                  className=" flex items-center gap-2"
                  to={`/category/669644aa69a6d788e2c6770d`}
                >
                  और भी जानै{" "}
                  <FaArrowUpRightFromSquare className=" text-blue-600" />
                </Link>
              </div>

              <div className=" grid  grid-cols-1 gap-6 ">
                {/* //top */}
                <div className=" col-span-2">
                  {rajneeti[0] && (
                    <Link to={`/${rajneeti[0]?.slug}`} className=" relative">
                      <img
                        src={rajneeti[0]?.images[0]?.url}
                        alt=""
                        className="lg:h-[320px] h-[250px] lg:w-full w-[80%] object-cover border-r-[1px] border-l-[1px] border-red-500 pr-3 pl-3"
                      />
                      <p className="font-semibold  bottom-0  text- text-gray-500 bg-opacity-60 w-full py-5">
                        {truncateText(rajneeti[0]?.title, 10)}
                        <p className="text-gray-400 text-[12px]">
                          {rajneeti[0]?.createdAt
                            ? formatDate(rajneeti[0]?.createdAt)
                            : "Date not available"}
                        </p>
                      </p>
                    </Link>
                  )}
                </div>

                <div>
                  <div>
                    {rajneeti.slice(1).map((news) => (
                      <Link
                        to={`/${news?.slug}`}
                        key={news._id}
                        className="mb-4 flex gap-3"
                      >
                        <img
                          src={news?.images[0]?.url}
                          alt=""
                          className="h-[65px] min-w-[110px]"
                        />
                        <p className="font-semibold text-[12px] ">
                          {truncateText(news?.title, 20)}
                          <p className="text-gray-400 text-[12px]">
                            {news.createdAt
                              ? formatDate(rajneeti[0]?.createdAt)
                              : "Date not available"}
                          </p>
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Videsh */}

          <div className="  p-1 my-10  ">
            <div>
              <div className=" flex justify-between mb-4 relative">
                <p className=" min-w-full min-h-[2px] bg-[#ed0302] absolute bottom-0 "></p>
                <p className=" flex items-center gap-2 font-bold text-lg bg-[#ed0302] text-white p-2 relative wf">
                  {" "}
                  विदेश
                </p>
                <Link
                  className=" flex items-center gap-2"
                  to={`/category/669644aa69a6d788e2c6770d`}
                >
                  और भी जानै{" "}
                  <FaArrowUpRightFromSquare className=" text-blue-600" />
                </Link>
              </div>

              <div className=" grid  grid-cols-1 gap-6 ">
                {/* //top */}
                <div className=" col-span-2">
                  {rajneeti[0] && (
                    <Link to={`/${rajneeti[0]?.slug}`} className=" relative">
                      <img
                        src={rajneeti[0]?.images[0]?.url}
                        alt=""
                        className="lg:h-[320px] h-[250px] lg:w-full w-[80%] object-cover border-r-[1px] border-l-[1px] border-red-500 pr-3 pl-3"
                      />
                      <p className="font-semibold  bottom-0  text- text-gray-500 bg-opacity-60 w-full py-5">
                        {truncateText(rajneeti[0]?.title, 10)}
                        <p className="text-gray-400 text-[12px]">
                          {rajneeti[0]?.createdAt
                            ? formatDate(rajneeti[0]?.createdAt)
                            : "Date not available"}
                        </p>
                      </p>
                    </Link>
                  )}
                </div>

                <div>
                  <div>
                    {rajneeti.slice(1).map((news) => (
                      <Link
                        to={`/${news?.slug}`}
                        key={news._id}
                        className="mb-4 flex gap-3"
                      >
                        <img
                          src={news?.images[0]?.url}
                          alt=""
                          className="h-[65px] min-w-[110px]"
                        />
                        <p className="font-semibold text-[12px] ">
                          {truncateText(news?.title, 20)}
                          <p className="text-gray-400 text-[12px]">
                            {news.createdAt
                              ? formatDate(rajneeti[0]?.createdAt)
                              : "Date not available"}
                          </p>
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MP */}
        <div>
          <div>
            <div className=" flex justify-between mb-4 relative">
              <p className=" min-w-full min-h-[2px] bg-[#ed0302] absolute bottom-0 "></p>
              <p className=" flex items-center gap-2 font-bold text-lg bg-[#ed0302] text-white p-2 relative wf">
                {" "}
                मध्य प्रदेश
              </p>
              <Link
                className=" flex items-center gap-2"
                to={`/category/669644aa69a6d788e2c6770d`}
              >
                और भी जानै{" "}
                <FaArrowUpRightFromSquare className=" text-blue-600" />
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            {allNews.map((news) => (
              <div className=" " key={news._id}>
                {news && (
                  <Link to={`/${news?.slug}`} className=" relative">
                    <img
                      src={news?.images[0]?.url}
                      alt=""
                      className="max-w-full h-[200px] object-cover border-r-[1px] border-l-[1px] border-red-500 pr-3 pl-3"
                    />
                    <p className="font-semibold  bottom-0  text- text-gray-500 bg-opacity-60  py-5 text-wrap">
                      {truncateText(news?.title, 10)}
                      <p className="text-gray-400 text-[12px]">
                        {news?.createdAt
                          ? formatDate(news?.createdAt)
                          : "Date not available"}
                      </p>
                    </p>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MP */}
        <div>
          <div>
            <div className=" flex justify-between mb-4 relative">
              <p className=" min-w-full min-h-[2px] bg-[#ed0302] absolute bottom-0 "></p>
              <p className=" flex items-center gap-2 font-bold text-lg bg-[#ed0302] text-white p-2 relative wf">
                {" "}
                छत्तीसगढ़
              </p>
              <Link
                className=" flex items-center gap-2"
                to={`/category/669644aa69a6d788e2c6770d`}
              >
                और भी जानै{" "}
                <FaArrowUpRightFromSquare className=" text-blue-600" />
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            {allNews.map((news) => (
              <div className=" " key={news._id}>
                {news && (
                  <Link to={`/${news?.slug}`} className=" relative">
                    <img
                      src={news?.images[0]?.url}
                      alt=""
                      className="max-w-full h-[200px] object-cover border-r-[1px] border-l-[1px] border-red-500 pr-3 pl-3"
                    />
                    <p className="font-semibold  bottom-0  text- text-gray-500 bg-opacity-60  py-5 text-wrap">
                      {truncateText(news?.title, 10)}
                      <p className="text-gray-400 text-[12px]">
                        {news?.createdAt
                          ? formatDate(news?.createdAt)
                          : "Date not available"}
                      </p>
                    </p>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Khel Manorang  */}
        <div className=" grid lg:grid-cols-2 gap-4">
          {/* Desh */}
          <div className="  p-1 my-10  ">
            <div>
              <div className=" flex justify-between mb-4 relative">
                <p className=" min-w-full min-h-[2px] bg-[#ed0302] absolute bottom-0 "></p>
                <p className=" flex items-center gap-2 font-bold text-lg bg-[#ed0302] text-white p-2 relative wf">
                  {" "}
                  खेल
                </p>
                <Link
                  className=" flex items-center gap-2"
                  to={`/category/669644aa69a6d788e2c6770d`}
                >
                  और भी जानै{" "}
                  <FaArrowUpRightFromSquare className=" text-blue-600" />
                </Link>
              </div>

              <div className=" grid  grid-cols-1 gap-6 ">
                {/* //top */}
                <div className=" col-span-2">
                  {rajneeti[0] && (
                    <Link to={`/${rajneeti[0]?.slug}`} className=" relative">
                      <img
                        src={rajneeti[0]?.images[0]?.url}
                        alt=""
                        className="lg:h-[320px] h-[250px] lg:w-full w-[80%] object-cover border-r-[1px] border-l-[1px] border-red-500 pr-3 pl-3"
                      />
                      <p className="font-semibold  bottom-0  text- text-gray-500 bg-opacity-60 w-full py-5">
                        {truncateText(rajneeti[0]?.title, 10)}
                        <p className="text-gray-400 text-[12px]">
                          {rajneeti[0]?.createdAt
                            ? formatDate(rajneeti[0]?.createdAt)
                            : "Date not available"}
                        </p>
                      </p>
                    </Link>
                  )}
                </div>

                <div>
                  <div>
                    {rajneeti.slice(1).map((news) => (
                      <Link
                        to={`/${news?.slug}`}
                        key={news._id}
                        className="mb-4 flex gap-3"
                      >
                        <img
                          src={news?.images[0]?.url}
                          alt=""
                          className="h-[65px] min-w-[110px]"
                        />
                        <p className="font-semibold text-[12px] ">
                          {truncateText(news?.title, 20)}
                          <p className="text-gray-400 text-[12px]">
                            {news.createdAt
                              ? formatDate(rajneeti[0]?.createdAt)
                              : "Date not available"}
                          </p>
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Videsh */}

          <div className="  p-1 my-10  ">
            <div>
              <div className=" flex justify-between mb-4 relative">
                <p className=" min-w-full min-h-[2px] bg-[#ed0302] absolute bottom-0 "></p>
                <p className=" flex items-center gap-2 font-bold text-lg bg-[#ed0302] text-white p-2 relative wf">
                  {" "}
                  मनोरंजन
                </p>
                <Link
                  className=" flex items-center gap-2"
                  to={`/category/669644aa69a6d788e2c6770d`}
                >
                  और भी जानै{" "}
                  <FaArrowUpRightFromSquare className=" text-blue-600" />
                </Link>
              </div>

              <div className=" grid  grid-cols-1 gap-6 ">
                {/* //top */}
                <div className=" col-span-2">
                  {rajneeti[0] && (
                    <Link to={`/${rajneeti[0]?.slug}`} className=" relative">
                      <img
                        src={rajneeti[0]?.images[0]?.url}
                        alt=""
                        className="lg:h-[320px] h-[250px] lg:w-full w-[80%] object-cover border-r-[1px] border-l-[1px] border-red-500 pr-3 pl-3"
                      />
                      <p className="font-semibold  bottom-0  text- text-gray-500 bg-opacity-60 w-full py-5">
                        {truncateText(rajneeti[0]?.title, 10)}
                        <p className="text-gray-400 text-[12px]">
                          {rajneeti[0]?.createdAt
                            ? formatDate(rajneeti[0]?.createdAt)
                            : "Date not available"}
                        </p>
                      </p>
                    </Link>
                  )}
                </div>

                <div>
                  <div>
                    {rajneeti.slice(1).map((news) => (
                      <Link
                        to={`/${news?.slug}`}
                        key={news._id}
                        className="mb-4 flex gap-3"
                      >
                        <img
                          src={news?.images[0]?.url}
                          alt=""
                          className="h-[65px] min-w-[110px]"
                        />
                        <p className="font-semibold text-[12px] ">
                          {truncateText(news?.title, 20)}
                          <p className="text-gray-400 text-[12px]">
                            {news.createdAt
                              ? formatDate(rajneeti[0]?.createdAt)
                              : "Date not available"}
                          </p>
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className=" mt-[40px] col-span-4 lg:col-span-1">
        {/* New News */}
        <div className=" ">
  

          <div>
            <NewsActive  realted={allNews} />
          </div>
        </div>
      
      
        <div className="mt-[50px]">
        <div className=" flex justify-between mb-4 relative">
                <p className=" min-w-full min-h-[2px] bg-[#ed0302] absolute bottom-0 "></p>
                <p className=" flex items-center gap-2 font-bold text-lg bg-[#ed0302] text-white p-2 relative wf">
                  {" "}
                  Cricket Score
                </p>
            
              </div>

          <div>
            <CricketLive   />
          </div>
        </div>


      </div>
    </div>
  );
}

export default CategoryWise;
