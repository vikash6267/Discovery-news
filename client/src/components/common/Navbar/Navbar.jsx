import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaSearch } from "react-icons/fa";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

const navLinks = [
  { title: "होम", path: "/" },
  { title: "देश", path: "/desh" },
  { title: "विदेश", path: "/videsh" },
  { title: "राजनीति", path: "/rajniti" },
  {
    title: "मध्य प्रदेश",
    path: "/madhyapradesh",
    sublinks: [
      { title: "भोपल", path: "/bhopal" },
      { title: "इंदौर", path: "/indore" },
      { title: "ग्वालियर", path: "/gwalior" },
    ],
  },
  {
    title: "छत्तीसगढ़",
    path: "/chhattisgarh",
    sublinks: [
      { title: "रायपुर", path: "/raipur" },
      { title: "बिलासपुर", path: "/bilaspur" },
      { title: "दुर्ग", path: "/durg" },
    ],
  },
  { title: "खेल", path: "/khel" },
  { title: "व्यापार", path: "/vyapar" },
  { title: "मनोरंजन", path: "/manoranjan" },
  {
    title: "धर्म एवं ज्योतिष",
    path: "/dharm",
    sublinks: [
      { title: "हिंदू धर्म", path: "/hindu" },
      { title: "इस्लाम धर्म", path: "/islam" },
      { title: "ज्योतिष", path: "/jyotish" },
    ],
  },
  {
    title: "लाइफ स्टाइल",
    path: "/lifestyle",
    sublinks: [
      { title: "स्वास्थ्य", path: "/health" },
      { title: "फैशन", path: "/fashion" },
      { title: "यात्रा", path: "/travel" },
    ],
  },
  { title: "हेल्थ", path: "/health" },
  { title: "वीडियो", path: "/video" },
  { title: "लाइव टीवी", path: "/livetv" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleDropdownToggle = (index, hasSublinks) => {
    if (hasSublinks) {
      if (openDropdown === index) {
        setOpenDropdown(null);
      } else {
        setOpenDropdown(index);
      }
    } else {
      setIsOpen(false);
      setOpenDropdown(null);
    }
  };

  const handleLinkClick = () => {
    setIsOpen(false);
    setOpenDropdown(null);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <nav className="bg-red-600">
      <div className="container mx-auto flex items-center justify-between py-2 px-4">
        <div className="flex space-x-4">
          <div className="text-white text-xl font-bold">Brand</div>
          <div className="hidden lg:flex space-x-4">
            {navLinks.map((link, index) => (
              <div key={index} className="group relative">
                <Link
                  to={link.path}
                  className="text-white hover:bg-red-700 px-3 py-2 rounded-md"
                >
                  {link.title}
                </Link>
                {link.sublinks && (
                  <div className="absolute left-0 top-full bg-red-600 py-2 hidden group-hover:block">
                    {link.sublinks.map((sublink, subIndex) => (
                      <Link
                        key={subIndex}
                        to={sublink.path}
                        className="block text-white px-4 py-2 hover:bg-red-700"
                      >
                        {sublink.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSearch}
            className="text-white bg-gray-200 rounded-md p-2"
          >
            <FaSearch className="text-black" />
          </button>
          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              <FaBars size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Search Input Field */}
      {isSearchOpen && (
        <div className="bg-white py-2 px-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 border rounded-md focus:outline-none"
          />
        </div>
      )}

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden">
          {navLinks.map((link, index) => (
            <div key={index} className="border-b border-gray-200">
              <div className="flex justify-between items-center px-4 py-2 cursor-pointer">
                <Link
                  to={link.path}
                  className="text-white"
                  onClick={handleLinkClick}
                >
                  {link.title}
                </Link>
                {link.sublinks && (
                  <>
                    {openDropdown === index ? (
                      <AiOutlineMinus
                        className="text-white cursor-pointer"
                        onClick={() =>
                          handleDropdownToggle(index, link.sublinks)
                        }
                      />
                    ) : (
                      <AiOutlinePlus
                        className="text-white cursor-pointer"
                        onClick={() =>
                          handleDropdownToggle(index, link.sublinks)
                        }
                      />
                    )}
                  </>
                )}
              </div>
              {openDropdown === index && link.sublinks && (
                <div className="bg-red-600 pl-4">
                  {link.sublinks.map((sublink, subIndex) => (
                    <Link
                      key={subIndex}
                      to={sublink.path}
                      className="block text-white px-4 py-2"
                      onClick={handleLinkClick}
                    >
                      {sublink.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
