import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaHome, FaSearch } from "react-icons/fa";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategory } from "../../../services/operations/admin";
import SearchBox from "./SearchBox";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { category } = useSelector((state) => state.news);
  const [categories, setCategories] = useState([]);

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await fetchCategory();
        console.log(categoriesData);

        // Filter out the "राज्य" category
        const filteredCategories =
          categoriesData?.categories.filter(
            (cat) => cat.name.trim() !== "राज्य"
          ) || [];

        setCategories(filteredCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (category.length !== 0) {
      // Filter out the "राज्य" category from existing data
      const filteredCategories = category.filter(
        (cat) => cat.name.trim() !== "राज्य"
      );

      setCategories(filteredCategories);
    } else {
      fetchCategories();
    }
  }, [category]);

  return (
    <nav className="bg-black lg:bg-red-600">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-2 px-4">
        <div className="flex">
          <Link to="/" className="text-white lg:mr-3">
            <FaHome size={22} />
          </Link>
          <div className="hidden lg:flex lg:mt-[2px]">
            {categories.map((link, index) => (
              <div key={index} className="group relative z-50">
                <Link
                  to={`/category/${link?._id}`}
                  className="text-white hover:bg-gray-100 text-[16px] font-bold hover:text-black px-3 py-4"
                  onClick={handleLinkClick}
                >
                  {link?.name}
                </Link>
                {link?.subCategories && link?.subCategories?.length > 0 && (
                  <div className="absolute left-0 top-8 text-[16px] font-bold bg-red-600 py-2 w-32 hidden group-hover:block text-start">
                    {link?.subCategories.map((sublink, subIndex) => (
                      <Link
                        key={subIndex}
                        to={`/subcategory/${sublink?._id}`}
                        className="block text-white hover:bg-gray-100 hover:text-black px-3 py-2"
                        onClick={handleLinkClick}
                      >
                        {sublink?.name}
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
            className="text-white bg-gray-200 rounded-md p-2 "
          >
            <FaSearch className="text-black" />
          </button>

          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              <FaBars size={24} />
            </button>
          </div>

          <SearchBox isOpen={isSearchOpen} toggleSearch={toggleSearch} />
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden">
          {categories.map((link, index) => (
            <div key={index} className="border-b border-gray-200">
              <div className="flex justify-between items-center px-4 py-2 cursor-pointer">
                <Link
                  to={`/category/${link?._id}`}
                  className="text-white"
                  onClick={handleLinkClick}
                >
                  {link?.name}
                </Link>
                {link.subCategories && link?.subCategories?.length > 0 && (
                  <>
                    {openDropdown === index ? (
                      <AiOutlineMinus
                        className="text-white cursor-pointer"
                        onClick={() =>
                          handleDropdownToggle(index, link.subCategories)
                        }
                      />
                    ) : (
                      <AiOutlinePlus
                        className="text-white cursor-pointer"
                        onClick={() =>
                          handleDropdownToggle(index, link.subCategories)
                        }
                      />
                    )}
                  </>
                )}
              </div>
              {openDropdown === index && link.subCategories && (
                <div className="bg-black pl-4">
                  {link.subCategories.map((sublink, subIndex) => (
                    <Link
                      key={subIndex}
                      to={`/subcategory/${sublink?._id}`}
                      className="block text-white px-4 py-2"
                      onClick={handleLinkClick}
                    >
                      {sublink.name}
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
