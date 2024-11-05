import React, { useState, useEffect, useRef } from 'react';
import { FaPause, FaPlay } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward, IoMdRefresh } from 'react-icons/io';
import { getStory } from '../services/operations/admin';
import { useParams } from 'react-router-dom';

const StatusSlider = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slideProgress, setSlideProgress] = useState([]);
  const progressIntervalRef = useRef(null);
  const sliderIntervalRef = useRef(null);

  const fetchStory = async () => {
    const res = await getStory(id);
    setStory(res);
    setSlideProgress(Array(res.images.length).fill(0));
  };

  useEffect(() => {
    fetchStory();
  }, [id]);

  useEffect(() => {
    if (story && story.images.length > 0) {
      // Reset progress and start the interval
      setSlideProgress((prev) => {
        const newProgress = [...prev];
        newProgress[currentIndex] = 0; // Reset progress for the new slide
        return newProgress;
      });

      // Clear previous intervals if any
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      if (sliderIntervalRef.current) {
        clearInterval(sliderIntervalRef.current);
      }

      // Start new progress interval
      progressIntervalRef.current = setInterval(() => {
        if (!isPaused) {
          setSlideProgress((prev) => {
            const newProgress = [...prev];
            if (newProgress[currentIndex] < 100) {
              newProgress[currentIndex] = Math.min(100, newProgress[currentIndex] + (100 / 5)); // Fill 100% over 5 seconds
            }
            return newProgress;
          });
        }
      }, 1000);

      // Start slider interval
      sliderIntervalRef.current = setInterval(() => {
        if (!isPaused) {
          handleNext();
        }
      }, 5000);

      return () => {
        clearInterval(progressIntervalRef.current);
        clearInterval(sliderIntervalRef.current);
      };
    }
  }, [currentIndex, isPaused, story]);



  useEffect(() => {
    if (story && story.images.length > 0) {
      // Reset progress and start the interval
      setSlideProgress((prev) => {
        const newProgress = prev.map((_, index) => {
          if (index < currentIndex) {
            return 100; // Completed for past slides
          } else if (index === currentIndex) {
            return 0; // Reset for the current slide
          } else {
            return 0; // Reset for future slides
          }
        });
        return newProgress;
      });
  
      // Clear previous intervals if any
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
  
      if (sliderIntervalRef.current) {
        clearInterval(sliderIntervalRef.current);
      }
  
      // Start new progress interval
      progressIntervalRef.current = setInterval(() => {
        if (!isPaused) {
          setSlideProgress((prev) => {
            const newProgress = [...prev];
            if (newProgress[currentIndex] < 100) {
              newProgress[currentIndex] = Math.min(100, newProgress[currentIndex] + (100 / 5)); // Fill 100% over 5 seconds
            }
            return newProgress;
          });
        }
      }, 1000);
  
      // Start slider interval
      sliderIntervalRef.current = setInterval(() => {
        if (!isPaused) {
          handleNext();
        }
      }, 5000);
  
      return () => {
        clearInterval(progressIntervalRef.current);
        clearInterval(sliderIntervalRef.current);
      };
    }
  }, [currentIndex, isPaused, story]);

  

  
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % (story?.images.length || 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? (story?.images.length || 1) - 1 : prevIndex - 1
    );
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const images = story?.images || [];

  return (
    <div className="relative w-full lg:h-screen h-[90vh]">
      {/* Blurred Background */}
      {images.length > 0 && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-black"
          style={{
            backgroundImage: `url(${images[currentIndex]?.url})`,
            backdropFilter: 'blur(50px)',
            filter: 'blur(50px)',
            WebkitBackdropFilter: 'blur(50px)',
          }}
        ></div>
      )}

      {/* Slider Container */}
      <div className="relative z-10 lg:w-[390px] h-full max-w-screen-md mx-auto bg-white border overflow-hidden">
        {/* Images without animation */}
        {images.length > 0 && (
          <div className="w-full h-full absolute">
            <img
              src={images[currentIndex]?.url}
              alt={`Slide ${currentIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Text Overlay */}
        {images.length > 0 && (
          <div className="absolute bottom-14 left-0 right-0 bg-red-800 bg-opacity-90 p-2 font-semibold text-white text-center">
            <p>{story?.title[currentIndex]}</p>
          </div>
        )}

        {/* Full-width Dot Indicator */}
        <div className="absolute top-4 left-0 right-0 px-4">
          <div className="flex justify-center space-x-2">
            {images.length > 0 &&
              images.map((_, index) => (
                <div key={index} className="relative w-full h-1 rounded-full bg-gray-400">
                  <div
                    className="absolute top-0 left-0 h-full bg-white rounded-full"
                    style={{ width: `${slideProgress[index] || 0}%`, transition: 'width 1s' }}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Left 25% clickable area for previous */}
        <div
          className="absolute top-0 left-0 h-full w-1/4 bg-transparent cursor-pointer"
          onClick={handlePrev}
          onTouchStart={handlePause}
          onTouchEnd={handleResume}
        ></div>

        {/* Right 75% clickable area for next */}
        <div
          className="absolute top-0 right-0 h-full w-3/4 bg-transparent cursor-pointer"
          onClick={handleNext}
          onTouchStart={handlePause}
          onTouchEnd={handleResume}
        ></div>

        {/* Desktop Pause Button */}
        <div className="absolute bottom-4 right-4 lg:block hidden z-20">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="bg-white text-black p-2 rounded-full shadow-lg"
          >
            {isPaused ? <FaPlay /> : <FaPause />}
          </button>
        </div>

        {/* Desktop Navigation Icons */}
        <button
          className="absolute top-0 left-0 h-full bg-transparent cursor-pointer flex items-center justify-center"
          onClick={handlePrev}
          onTouchStart={handlePause}
          onTouchEnd={handleResume}
        >
          <div className={`bg-white p-2 rounded-full ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <IoIosArrowBack size={30} className="text-black" />
          </div>
        </button>

        <button
          className="absolute top-0 right-0 h-full bg-transparent cursor-pointer flex items-center justify-center"
          onClick={handleNext}
          onTouchStart={handlePause}
          onTouchEnd={handleResume}
        >
          <div className='bg-white p-2 rounded-full'>
            {currentIndex === images.length - 1 ? (
              <IoMdRefresh size={30} className="text-black" />
            ) : (
              <IoIosArrowForward size={30} className="text-black" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default StatusSlider;
