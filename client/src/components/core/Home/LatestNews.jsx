import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import {Link} from "react-router-dom"
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { DiCodeigniter } from "react-icons/di";

function LatestNews() {
    const { allNews} = useSelector((state) => state.news);

    const latestNews = [...(allNews)]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

    useEffect(()=>{
        console.log(latestNews)
    },[])

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
              <Link to={`/${latestNews[0]?.slug}`} className=' relative'>
                <img src={latestNews[0]?.images[0]?.url} alt="" className="" />
                <p className="font-semibold absolute bottom-0 text-white text-center bg-black bg-opacity-60 w-full py-5">
                  {truncateText(latestNews[0]?.title, 20)}
                </p>
              </Link>
            )}

          
          </div>

          <div>
            <div>
              {latestNews.slice(2,4).map((news) => (
                <Link
                to={`/${news?.slug}`}
                
                 key={news._id} className="mb-4 flex gap-2 relative">
                  <img src={news?.images[0]?.url} alt="" className="max-h-[160px]" />
                  <p className="font-semibold text-[12px] font-semibold absolute bottom-0 text-white text-center bg-black bg-opacity-60 w-full py-2">
                    {truncateText(news?.title, 10)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LatestNews