import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoCloseCircle, IoShareSocial } from "react-icons/io5";

const PolllAns = () => {
  const [polls, setPolls] = useState([]);
  const [votedPolls, setVotedPolls] = useState(new Set());
  const [showPercentage, setShowPercentage] = useState("");

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/poll/get`
        );
        setPolls(response.data);

        // Load voted polls from localStorage
        const storedVotedPolls =
          JSON.parse(localStorage.getItem("votedPolls")) || [];
        setVotedPolls(new Set(storedVotedPolls));
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };

    fetchPolls();
  }, []);

  const handleVote = async (pollId, optionId) => {
    // if (votedPolls.has(pollId)) {
    //   alert("You have already voted on this poll.");
    //   return;
    // }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/poll/vote/${pollId}`,
        {
          optionId,
        }
      );

      const updatedPolls = polls.map((poll) => {
        if (poll._id === pollId) {
          const totalVotes = poll.options.reduce(
            (acc, curr) => acc + curr.votes,
            0
          );
          const updatedOptions = poll.options.map((option) => {
            if (option._id === optionId) {
              return {
                ...option,
                votes: option.votes + 1,
                percentage: ((option.votes + 1) / (totalVotes + 1)) * 100,
              };
            } else {
              return {
                ...option,
                percentage: (option.votes / (totalVotes + 1)) * 100,
              };
            }
          });
          return {
            ...poll,
            options: updatedOptions,
          };
        }
        return poll;
      });
      setPolls(updatedPolls);

      // Update voted polls in state and localStorage
      const newVotedPolls = new Set(votedPolls);
      newVotedPolls.add(pollId);
      setVotedPolls(newVotedPolls);
      localStorage.setItem("votedPolls", JSON.stringify([...newVotedPolls]));

      setShowPercentage(optionId); // Show percentage temporarily
      setTimeout(() => setShowPercentage(""), 5000); // Hide percentage after 5 seconds
    } catch (error) {
      console.error("Error voting:", error);
    }
  };


  
// Add this script to the page
// window.addEventListener('load', () => {
//   // Delay the execution by 1 second (1000 milliseconds)
//   setTimeout(() => {
//     if (window.location.hash) {
//       const targetId = window.location.hash.substring(1);
//       const targetElement = document.getElementById(targetId);
//       if (targetElement) {
//         targetElement.scrollIntoView({ behavior: 'smooth' });
//       }
//     }
//   }, 1000); // 1 second delay
// });



useEffect(() => {
  // Scroll to the section if there's a hash in the URL
  const scrollToHash = () => {
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }, 1000); // Delay of 1 second
      }
    }
  };

  scrollToHash();

  // Handle hash change (e.g., when the URL hash changes while the component is mounted)
  window.addEventListener('hashchange', scrollToHash);

  return () => {
    window.removeEventListener('hashchange', scrollToHash);
  };
}, []);



  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Poll",
          text: "Share Your Openion",
          url: `https://www.discoveryindianews.com/#pollsvote`,
        });
        console.log("Thanks for sharing!");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Your browser does not support the Web Share API.");
    }
  };

  return (
    <div className="flex justify-center p-4" id="pollsvote">
      <div className="w-full max-w-3xl">
        <div className=" flex flex-col my-10 ">
        <h2 className="text-2xl font-bold text-center uppercase ">
          Let's Vote
        </h2>



        <div
            className="bottom-1 z-10 flex text-white font-semibold justify-center mt-1 cursor-pointer"
            onClick={handleShare}
          >
            <div className="bg-red-700 flex gap-1 p-1 px-4 rounded-xl">
              Share Poll
              <IoShareSocial
                size={28}
                className="text-white bg-red-800 p-1 rounded-full cursor-pointer hover:text-red-500 hover:scale-110 transition-all"
              />
            </div>
          </div>
        </div>
        {polls.map((poll) => (
          <div
            key={poll._id}
            className="mb-4 p-4 border border-gray-200 rounded-lg bg-white shadow-md"
          >
            <h3 className="text-xl font-semibold mb-2">{poll.question}</h3>
            <ul>
              {poll.options.map((option) => (
                <li
                  key={option._id}
                  className={`py-2 cursor-pointer mb-5 ${
                    votedPolls.has(poll._id)
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-yellow-300"
                  }`}
                  onClick={() => handleVote(poll._id, option._id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{option.text}</span>
                    <span className="text-gray-600">{option.votes} votes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                    <div
                      className="bg-yellow-500 h-4 rounded-full transition-width duration-300 ease-in-out"
                      style={{
                        width: `${option.percentage || 0}%`,
                      }}
                    ></div>
                  </div>
                  {option.percentage !== undefined && (
                    <span
                      className={`text-gray-600 text-sm ${
                        showPercentage === option._id ? "" : "hidden"
                      }`}
                    >
                      ({option.percentage.toFixed(2)}%)
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PolllAns;
