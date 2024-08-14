import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchCategory } from '../../../services/operations/admin';
import { FaHome } from 'react-icons/fa';

function Navbar() {
  const [categories, setCategories] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { category } = useSelector((state) => state.news);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await fetchCategory();
        setCategories(categoriesData?.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (category.length !== 0) {
      setCategories(category);
    } else fetchCategories();
  }, [category]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Home Icon */}
        <div className="mr-4">
          <FaHome className="text-white text-2xl" />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              ></path>
            </svg>
          </button>
        </div>

        {/* Categories */}
        <ul className={`md:flex space-x-4 ${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
          {categories.map((cat) => (
            <li key={cat.name} className="relative group">
              <a
                href="#"
                className="block px-2 py-1 hover:text-gray-300 md:px-4"
                onClick={(e) => isMobileMenuOpen && e.preventDefault()}
              >
                {cat.name}
              </a>

              {/* Subcategories for Desktop */}
              {cat.subCategories && cat.subCategories.length > 0 && (
                <ul className="hidden md:absolute left-0 top-full mt-2 bg-gray-700 text-white group-hover:block">
                  {cat.subCategories.map((subCat) => (
                    <li key={subCat.name} className="px-4 py-2 hover:bg-gray-600">
                      <a href="#">{subCat.name}</a>
                    </li>
                  ))}
                </ul>
              )}

              {/* Subcategories for Mobile */}
              {isMobileMenuOpen && cat.subCategories && cat.subCategories.length > 0 && (
                <ul className="mt-1 bg-gray-700 text-white">
                  {cat.subCategories.map((subCat) => (
                    <li key={subCat.name} className="px-4 py-2 hover:bg-gray-600">
                      <a href="#">{subCat.name}</a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
