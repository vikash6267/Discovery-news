import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { FaPause, FaPlay } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward, IoMdRefresh } from 'react-icons/io';
import { getStory } from '../services/operations/admin';
import { useParams } from 'react-router-dom';

const animationTypes = [
  { from: { transform: 'translateX(-100%)', opacity: 0 }, to: { transform: 'translateX(0%)', opacity: 1 } },
  { from: { transform: 'translateX(100%)', opacity: 0 }, to: { transform: 'translateX(0%)', opacity: 1 } },
  { from: { transform: 'scale(0.5)', opacity: 0 }, to: { transform: 'scale(1)', opacity: 1 } },
  { from: { transform: 'scale(1.2)', opacity: 0 }, to: { transform: 'scale(1)', opacity: 1 } },
  { from: { transform: 'translateY(-100%)', opacity: 0 }, to: { transform: 'translateY(0%)', opacity: 1 } },
  { from: { transform: 'translateY(100%)', opacity: 0 }, to: { transform: 'translateY(0%)', opacity: 1 } },
];

const StatusSlider = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null); // Initially set to null
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [animationProps, setAnimationProps] = useState(animationTypes[0]);

  const fetchStory = async () => {
    const res = await getStory(id);
    setStory(res);
  };

  useEffect(() => {
    fetchStory();
  }, [id]);

  useEffect(() => {
    // Randomly select an animation type when currentIndex changes
    const randomAnimation = animationTypes[Math.floor(Math.random() * animationTypes.length)];
    setAnimationProps(randomAnimation);
  }, [currentIndex]);

  const images = story?.images || []; // Use the fetched images or an empty array

  // Automatically change image every 5 seconds unless paused
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        handleNext();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, isPaused]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const isDisabled = images.length === 0;

  // Image animation
  const imageAnimation = useSpring({
    from: animationProps.from,
    to: animationProps.to,
    reset: true,
    config: { tension: 180, friction: 20 },
  });

  // Text spring animation (coming from top)
  const textSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(-510%)' },
    to: { opacity: 1, transform: 'translateY(0%)' },
    reset: true,
    config: { tension: 180, friction: 20 },
  });

  return (
    <div className="relative w-full h-screen">
      {/* Blurred Background */}
      {images.length > 0 && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-black"
          style={{
            backgroundImage: `url(${images[currentIndex].url})`,
            backdropFilter: 'blur(50px)',
            filter: 'blur(50px)', // Fallback for some browsers
            WebkitBackdropFilter: 'blur(50px)', // For Safari
          }}
        ></div>
      )}

      {/* Slider Container */}
      <div className="relative z-10 lg:w-[390px] h-full max-w-screen-md mx-auto bg-white border overflow-hidden">
        {/* Images with animation */}
        {images.length > 0 && (
          <animated.div style={imageAnimation} className="w-full h-full absolute">
            <img
              src={images[currentIndex].url}
              alt={`Slide ${currentIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </animated.div>
        )}

        {/* Text Overlay with spring animation */}
        {images.length > 0 && (
          <animated.div style={textSpring} className="absolute bottom-14 left-0 right-0 bg-red-800 bg-opacity-90 p-2 font-semibold text-white text-center">
            <p>{story?.title[currentIndex]}</p>
          </animated.div>
        )}

        {/* Full-width Dot Indicator */}
        <div className="absolute top-4 left-0 right-0 px-4">
          <div className="flex justify-center space-x-2">
            {images.length === 1 ? (
              <span className="w-3 h-3 bg-white rounded-full"></span>
            ) : (
              images.map((_, index) => (
                <span
                  key={index}
                  className={`w-full h-1 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-gray-400'}`}
                />
              ))
            )}
          </div>
        </div>

        {/* Left 25% clickable area for previous */}
        <div
          className="absolute top-0 left-0 h-full w-1/4 bg-transparent cursor-pointer"
          onClick={handlePrev}
          onTouchStart={handlePause} onTouchEnd={handleResume}
        ></div>

        {/* Right 75% clickable area for next */}
        <div
          className="absolute top-0 right-0 h-full w-3/4 bg-transparent cursor-pointer"
          onClick={handleNext}
          onTouchStart={handlePause} onTouchEnd={handleResume}
        ></div>

        {/* Desktop Pause Button */}
        <div className="absolute bottom-4 right-4 lg:block hidden">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="bg-white text-black p-2 rounded-full shadow-lg"
          >
            {isPaused ? <FaPlay /> : <FaPause />}
          </button>
        </div>

        {/* Desktop Navigation Icons */}
        <>
          <button
            className="absolute top-0 left-0 h-full bg-transparent cursor-pointer flex items-center justify-center"
            onClick={handlePrev}
            onTouchStart={handlePause}
            onTouchEnd={handleResume}
            disabled={isDisabled}
          >
            <IoIosArrowBack size={30} className="text-black" />
          </button>

          <button
            className="absolute top-0 right-0 h-full bg-transparent cursor-pointer flex items-center justify-center"
            onClick={handleNext}
            onTouchStart={handlePause}
            onTouchEnd={handleResume}
            disabled={isDisabled}
          >
            {images.length > 0 ? (
              <IoIosArrowForward size={30} className="text-black" />
            ) : (
              <IoMdRefresh size={30} className="text-black" /> // Display refresh icon if no images
            )}
          </button>
        </>
      </div>
    </div>
  );
};

export default StatusSlider;
