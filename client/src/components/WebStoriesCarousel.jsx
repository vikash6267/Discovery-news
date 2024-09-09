import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllStories } from "../services/operations/admin";

const WebStoriesCarousel = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchAllStories = async () => {
      try {
        const response = await getAllStories();
        setStories(response || []);
        console.log(response);
      } catch (error) {
        console.error("Error fetching stories:", error);
        setStories([]);
      }
    };

    fetchAllStories();
  }, []);
  return (
    <div className="bg-red-900 p-4">
      <h2 className="text-white text-2xl font-bold mb-4">Web Stories</h2>
      <div className="flex overflow-x-auto space-x-4">
        {stories.map((story, index) => (
          <Link 
          to={`/web-story/${story._id}`}
            key={index}
            className="min-w-[200px] bg-red-500 rounded overflow-hidden shadow-lg"
          >
            <img
              src={story.images[0]?.url}
              alt={story.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-2">
              <h3 className="text-white text-sm">{story.title[0]}</h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center items-center mt-4">
        <Link
          to="/web-stories"
          className="bg-red-600 text-white py-2 px-4 rounded"
        >
          View More
        </Link>
      </div>
    </div>
  );
};

export default WebStoriesCarousel;
