import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

const SubNavbar = () => {
  const currentDate = new Date();

  // Array of weekday names
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  // Array of month names
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Get the day of the week, month, day of the month, and year
  const dayOfWeek = daysOfWeek[currentDate.getDay()];
  const month = months[currentDate.getMonth()];
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();

  // Function to get the ordinal suffix (st, nd, rd, th)
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th'; // Special case for 11th, 12th, 13th, etc.
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;

  const formattedDate = `${dayOfWeek}, ${month} ${dayWithSuffix}, ${year}`;

  return (
    <div className="bg-neutral-950 border-b border-neutral-800">
      <div className="main max-w-7xl mx-auto lg:flex lg:justify-between hidden p-2">
        <div className="first text-gray-300 text-sm self-center">{formattedDate}</div>
        <div className="second flex gap-2">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-yellow-400 text-blue-700 hover:text-black cursor-pointer px-2 py-1 rounded-lg"
          >
            <FaFacebook size={18} />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-yellow-400 text-pink-700 hover:text-black cursor-pointer px-2 py-1 rounded-lg"
          >
            <FaInstagram size={18} />
          </a>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-yellow-400 text-red-700 hover:text-black cursor-pointer px-2 py-1 rounded-lg"
          >
            <FaYoutube size={18} />
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-yellow-400 text-blue-700 hover:text-black cursor-pointer px-2 py-1 rounded-lg"
          >
            <FaLinkedin size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SubNavbar;
