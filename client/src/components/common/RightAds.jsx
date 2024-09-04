import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function RightAds() {
  const { ads } = useSelector((state) => state.news);

  // Filtering ads with type 'right-add'
  const filterAds = ads?.filter((add) => add?.type === "right-add");

  useEffect(() => {
    console.log(filterAds);
  }, [filterAds]); // Dependency array ensures this runs when filterAds changes

  return (
    <div className=' mt-[20px] border-t border-black'>
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
    </div>
  );
}

export default RightAds;
