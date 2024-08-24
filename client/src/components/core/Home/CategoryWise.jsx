import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DiCodeigniter } from "react-icons/di";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { format } from "date-fns";
import NewsActive from "./RightSide/NewsActive";
import CricketLive from "./RightSide/CricketLive";

function CategoryWise() {
  const { allNews, ads } = useSelector((state) => state.news);
  const [newsActive, setNewsActive] = useState(0);

  const all = [...allNews].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const allN = all.filter((currElem) => currElem?.type === "all").slice(0, 3);
  const allN2 = all.filter((currElem) => currElem?.type === "all").slice(0, 6);

  const rajneeti = allNews
    .filter((news) => news?.category?._id === "669644aa69a6d788e2c6770d")
    .sort((a, b) => new Date(b.publish) - new Date(a.publish))
    .slice(0, 5);

  const desh = allNews
    .filter((news) => news?.category?._id === "66bdc90f433ab78f130e49f0")
    .sort((a, b) => new Date(b.publish) - new Date(a.publish))
    .slice(0, 5);
  const videsh = allNews
    .filter((news) => news?.category?._id === "66bdc8f0433ab78f130e49c1")
    .sort((a, b) => new Date(b.publish) - new Date(a.publish))
    .slice(0, 5);
  const mp = allNews
    .filter((news) => news?.subcategory?._id === "66c483733f48d32b91e8d019")
    .sort((a, b) => new Date(b.publish) - new Date(a.publish))
    .slice(0, 10);
  const cg = allNews
    .filter((news) => news?.subcategory?._id === "66c483803f48d32b91e8d01e")
    .sort((a, b) => new Date(b.publish) - new Date(a.publish))
    .slice(0, 10);
  const khel = allNews
    .filter((news) => news?.category?._id === "66839e5b2335677cc35702eb")
    .sort((a, b) => new Date(b.publish) - new Date(a.publish))
    .slice(0, 5);
  const manoranjan = allNews
    .filter((news) => news?.category?._id === "66839e1c2335677cc35702e8")
    .sort((a, b) => new Date(b.publish) - new Date(a.publish))
    .slice(0, 5);

  const dharm = allNews
    .filter((news) => news?.category?._id === "66bdc954433ab78f130e4a0b")
    .sort((a, b) => new Date(b.publish) - new Date(a.publish))
    .slice(0, 9);
  const vyapar = allNews
    .filter((news) => news?.category?._id === "66bdc944433ab78f130e4a02")
    .sort((a, b) => new Date(b.publish) - new Date(a.publish))
    .slice(0, 9);
  const international = allNews
    .filter((news) => news?.category?._id === "66c43b1b16536a3646457d72")
    .sort((a, b) => new Date(b.publish) - new Date(a.publish))
    .slice(0, 9);

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
    <div className=" grid lg:grid-cols-4 lg:gap-4 grid-cols-1">
      <div className=" lg:col-span-3 ">
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

            <div className=" grid lg:grid-cols-3 grid-cols-1  gap-6 ">
              {/* //top */}
              <div className=" col-span-2">
                {rajneeti[0] && (
                  <Link to={`/${rajneeti[0]?.slug}`} className=" relative">
                    <img
                      src={rajneeti[0]?.images[0]?.url}
                      alt=""
                      className="lg:h-[320px] h-[250px] lg:w-full -[80%] object-cover border-r-[1px] border-l-[1px] border-red-500 pr-3 pl-3"
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
                  {desh[0] && (
                    <Link to={`/${desh[0]?.slug}`} className=" relative">
                      <img
                        src={desh[0]?.images[0]?.url}
                        alt=""
                        className="lg:h-[320px] h-[250px] lg:w-full   object-cover border-r-[1px] border-l-[1px] border-red-500 pr-3 pl-3"
                      />
                      <p className="font-semibold  bottom-0  text- text-gray-500 bg-opacity-60 w-full py-5">
                        {truncateText(desh[0]?.title, 10)}
                        <p className="text-gray-400 text-[12px]">
                          {desh[0]?.createdAt
                            ? formatDate(desh[0]?.createdAt)
                            : "Date not available"}
                        </p>
                      </p>
                    </Link>
                  )}
                </div>

                <div>
                  <div>
                    {desh.slice(1).map((news) => (
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
                  {videsh[0] && (
                    <Link to={`/${videsh[0]?.slug}`} className=" relative">
                      <img
                        src={videsh[0]?.images[0]?.url}
                        alt=""
                        className="lg:h-[320px] h-[250px] lg:w-full   object-cover border-r-[1px] border-l-[1px] border-red-500 pr-3 pl-3"
                      />
                      <p className="font-semibold  bottom-0  text- text-gray-500 bg-opacity-60 w-full py-5">
                        {truncateText(videsh[0]?.title, 10)}
                        <p className="text-gray-400 text-[12px]">
                          {videsh[0]?.createdAt
                            ? formatDate(rajneeti[0]?.createdAt)
                            : "Date not available"}
                        </p>
                      </p>
                    </Link>
                  )}
                </div>

                <div>
                  <div>
                    {videsh.slice(1).map((news) => (
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
            {mp?.map((news) => (
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
            {cg.map((news) => (
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
        <div>
          <div>
            <div className=" flex justify-between mb-4 relative">
              <p className=" min-w-full min-h-[2px] bg-[#ed0302] absolute bottom-0 "></p>
              <p className=" flex items-center gap-2 font-bold text-lg bg-[#ed0302] text-white p-2 relative wf">
                {" "}
                इंटरनेशनल खबर
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
            {international.map((news) => (
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
                  {khel[0] && (
                    <Link to={`/${khel[0]?.slug}`} className=" relative">
                      <img
                        src={khel[0]?.images[0]?.url}
                        alt=""
                        className="lg:h-[320px] h-[250px] lg:w-full   object-cover border-r-[1px] border-l-[1px] border-red-500 pr-3 pl-3"
                      />
                      <p className="font-semibold  bottom-0  text- text-gray-500 bg-opacity-60 w-full py-5">
                        {truncateText(khel[0]?.title, 10)}
                        <p className="text-gray-400 text-[12px]">
                          {khel[0]?.createdAt
                            ? formatDate(khel[0]?.createdAt)
                            : "Date not available"}
                        </p>
                      </p>
                    </Link>
                  )}
                </div>

                <div>
                  <div>
                    {khel.slice(1).map((news) => (
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
                  {manoranjan[0] && (
                    <Link to={`/${manoranjan[0]?.slug}`} className=" relative">
                      <img
                        src={manoranjan[0]?.images[0]?.url}
                        alt=""
                        className="lg:h-[320px] h-[250px] lg:w-full   object-cover border-r-[1px] border-l-[1px] border-red-500 pr-3 pl-3"
                      />
                      <p className="font-semibold  bottom-0  text- text-gray-500 bg-opacity-60 w-full py-5">
                        {truncateText(manoranjan[0]?.title, 10)}
                        <p className="text-gray-400 text-[12px]">
                          {manoranjan[0]?.createdAt
                            ? formatDate(manoranjan[0]?.createdAt)
                            : "Date not available"}
                        </p>
                      </p>
                    </Link>
                  )}
                </div>

                <div>
                  <div>
                    {manoranjan.slice(1).map((news) => (
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
        <div>
          <div>
            <div className=" flex justify-between mb-4 relative">
              <p className=" min-w-full min-h-[2px] bg-[#ed0302] absolute bottom-0 "></p>
              <p className=" flex items-center gap-2 font-bold text-lg bg-[#ed0302] text-white p-2 relative wf">
                {" "}
                All News
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
            {allN?.map((news) => (
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
      </div>

      {/* Right */}
      <div className=" mt-[40px] col-span-4 lg:col-span-1">
        {/* New News */}

        <div>
          <NewsActive
            realted={allNews}
            name1={"ताज़ा खबरें"}
            name2={"ज्यादा पढ़ी गई"}
          />
        </div>

        {/* //Cricket newa */}
        <div className="mt-[50px]">
          <div className=" flex justify-between mb-4 relative">
            <p className=" min-w-full min-h-[2px] bg-[#ed0302] absolute bottom-0 "></p>
            <p className=" flex items-center gap-2 font-bold text-lg bg-[#ed0302] text-white p-2 relative wf">
              {" "}
              Cricket Score
            </p>
          </div>

          <div>
            <CricketLive />
          </div>
        </div>

        {/* Vyapar*/}

        <div>
          <div className="mt-[50px]">
            <div className=" flex justify-between mb-4 relative">
              <p className=" min-w-full min-h-[2px] bg-[#ed0302] absolute bottom-0 "></p>
              <p className=" flex items-center gap-2 font-bold text-lg bg-[#ed0302] text-white p-2 relative wf">
                {" "}
                व्यापार
              </p>
            </div>

            <div>
              <div className="flex gap-3 grid-cols-1  mt-8 p-2 flex-col">
                {vyapar?.map((currElem, index) => (
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
        {/* Dharm And JYotishi */}

        <div>
          <div className="mt-[50px]">
            <div className=" flex justify-between mb-4 relative">
              <p className=" min-w-full min-h-[2px] bg-[#ed0302] absolute bottom-0 "></p>
              <p className=" flex items-center gap-2 font-bold text-lg bg-[#ed0302] text-white p-2 relative wf">
                {" "}
                धर्म एवं ज्योतिष
              </p>
            </div>

            <div>
              <div className="flex gap-3 grid-cols-1  mt-8 p-2 flex-col">
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
        {/* <div>
          <div className="mt-[50px]">
            <div className=" flex justify-between mb-4 relative">
              <p className=" min-w-full min-h-[2px] bg-[#ed0302] absolute bottom-0 "></p>
              <p className=" flex items-center gap-2 font-bold text-lg bg-[#ed0302] text-white p-2 relative wf">
                {" "}
                छत्तीसगढ़
              </p>
            </div>

            <div>
              <div className="flex gap-3 grid-cols-1  mt-8 p-2 flex-col">
                {cg?.map((currElem, index) => (
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
        </div> */}

        {Array.isArray(ads) &&
          ads.map(
            (currElem, index) =>
              currElem?.type === "right-add" && (
                <Link
                  to={currElem?.url}
                  key={index}
                  className="block mb-4"
                  target="_blank"
                >
                  <img
                    src={currElem?.image}
                    alt="Ad Image"
                    className="w-full rounded-lg shadow-md hover:shadow-lg transition duration-300"
                  />
                </Link>
              )
          )}
        <br />
        <br />
        <div>
          <head>hest</head>
          <NewsActive
            realted={allNews}
            name1={"विशेष इंटरव्यू"}
            name2={"ग्राउंड रिपोर्ट"}
          />
        </div>

        <div>
          <div className="mt-[50px]">
            <div className=" flex justify-between mb-4 relative">
              <p className=" min-w-full min-h-[2px] bg-[#ed0302] absolute bottom-0 "></p>
              <p className=" flex items-center gap-2 font-bold text-lg bg-[#ed0302] text-white p-2 relative wf">
                {" "}
                All News
              </p>
            </div>

            <div>
              <div className="flex gap-3 grid-cols-1  mt-8 p-2 flex-col">
                {allN2?.map((currElem, index) => (
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
    </div>
  );
}

export default CategoryWise;
