import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../assests/mplogo.png";
import { SITE_NAME, SITE_TAGLINE } from "../../../config/site";

function LogoSpace() {
  return (
    <header className="bg-gradient-to-b from-black via-neutral-950 to-red-950 border-b-4 border-yellow-400">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center lg:justify-between gap-6">
        <Link to="/" aria-label={`${SITE_NAME} होम`}>
          <img src={logo} alt={`${SITE_NAME} – ${SITE_TAGLINE}`} className="h-24 lg:h-32 w-auto" />
        </Link>
        <p className="hidden lg:block text-right text-yellow-400 text-2xl font-bold leading-snug">
          {SITE_TAGLINE}
          <span className="block text-sm font-medium text-gray-300">
            मध्य प्रदेश और देश-दुनिया की हर बड़ी खबर
          </span>
        </p>
      </div>
    </header>
  );
}

export default LogoSpace;
