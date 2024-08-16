import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
const Footer = () => {
  const { token } = useSelector((state) => state.auth);
  return (
    <footer className="bg-white border-t-2 border-red-600">
      <div className="container mx-auto py-2">
        <div className="flex justify-center flex-wrap text-sm space-x-4 text-gray-700">
          <Link to="/" className="hover:underline">
            देश
          </Link>
          <span>|</span>
          <Link to="/" className="hover:underline">
            विदेश
          </Link>
          <span>|</span>
          <Link to="/" className="hover:underline">
            राजनीति
          </Link>
          <span>|</span>
          <Link to="/" className="hover:underline">
            मध्य प्रदेश
          </Link>
          <span>|</span>
          <Link to="/" className="hover:underline">
            छत्तीसगढ़
          </Link>
          <span>|</span>
          <Link to="/" className="hover:underline">
            खेल
          </Link>
          <span>|</span>
          <Link to="/" className="hover:underline">
            व्यापार
          </Link>
          <span>|</span>
          <Link to="/" className="hover:underline">
            मनोरंजन
          </Link>
          <span>|</span>
          <Link to="/" className="hover:underline">
            धर्म एवं ज्योतिष
          </Link>
          <span>|</span>
          <Link to="/" className="hover:underline">
            लाइफ स्टाइल
          </Link>
          <span>|</span>
          <Link to="/" className="hover:underline">
            दिल्ली/NCR
          </Link>
        </div>
        <div className="flex justify-center items-center py-4 border-t mt-4">
          <div className="flex space-x-4 text-gray-700 text-sm">
            <Link to="/about" className="hover:underline">
              हमारे बारे में
            </Link>
            <span>|</span>
            <Link to="/contact" className="hover:underline">
              Contact Us
            </Link>
            <span>|</span>
            <Link to="/archive" className="hover:underline">
              Archive
            </Link>
            <span>|</span>

            {token ? (
              <Link to="/admin/dashboard" className="hover:underline">
                Admin Login
              </Link>
            ) : (
              <Link to="/login" className="hover:underline">
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="bg-red-600 text-white text-center py-2">
        2024 © discoveryindianews.com All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
