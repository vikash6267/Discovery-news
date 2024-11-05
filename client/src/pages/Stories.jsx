import React, { useEffect, useState } from "react";
import { getAllStories } from "../services/operations/admin";
import { Link } from "react-router-dom";

const Stories = () => {
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
  const [currentPage, setCurrentPage] = useState(1);
  const storiesPerPage = 12;

  // Calculate the total number of pages
  const totalPages = Math.ceil(stories.length / storiesPerPage);

  // Calculate the stories to show on the current page
  const indexOfLastStory = currentPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = stories.slice(indexOfFirstStory, indexOfLastStory);

  // Pagination handler
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Web Stories</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentStories.map((story) => (
          <Link key={story.id} to={`/web-story/${story._id}`}>
            <div className="bg-white shadow rounded-lg overflow-hidden relative">
              {/* Image */}
              <img
                src={story?.images[0]?.url}
                alt={story.title}
                className="w-full object-cover"
              />
              {/* Author and Date on top of the image */}
              <div className="absolute bottom-0 left-0 right-0 bg-red-600 bg-opacity-75 text-white text-xs p-2">
                <p>
                  By {story.author} —{" "}
                  {new Date(story.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold">{story.title[0]}</h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 bg-blue-500 text-white rounded-md mx-2 ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Previous
        </button>
        <span className="text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 bg-blue-500 text-white rounded-md mx-2 ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Stories;
