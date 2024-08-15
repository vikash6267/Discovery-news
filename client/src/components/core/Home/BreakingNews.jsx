import React, { useEffect, useState } from "react";
import { fetchBreakingNews } from "../../../services/operations/admin";

const BreakingNews = () => {
  const [breakingNews, setBreakingNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const findAllBreakingNews = async () => {
    try {
      const response = await fetchBreakingNews();
      setBreakingNews(response);
    } catch (error) {
      setError("Failed to fetch breaking news");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    findAllBreakingNews();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-white text-black">
      <div className="flex items-center shadow-lg max-w-7xl mx-auto">
        <span className="bg-gray-200 py-3 px-4 font-bold">खास खबर</span>
        <div className="flex-1 overflow-hidden">
          <div className="whitespace-nowrap animate-scroll">
            {breakingNews.length > 0 ? (
              breakingNews.map((item, index) => (
                <span key={index} className="px-4">
                  • {item?.name}
                </span>
              ))
            ) : (
              <span className="px-4">No breaking news available</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakingNews;
