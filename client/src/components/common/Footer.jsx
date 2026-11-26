import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

import { useSelector } from "react-redux";
import logo from "../../assests/mplogo.png";
import { SITE_NAME, SITE_TAGLINE, SITE_DOMAIN } from "../../config/site";
const Footer = () => {
  const { token } = useSelector((state) => state.auth);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVisits: 0,
    totalNews: 0,
    totalCategories: 0,
    totalSubCategories: 0,
  });
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/dashboard`);
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard statistics', error);
      }
    };

    fetchStats();
  }, []);
  const links = [["देश", "/"], ["विदेश", "/"], ["राजनीति", "/"], ["खेल", "/"], ["वेब स्टोरीज़", "/web-stories"], ["वीडियो", "/video"], ["Live TV", "/live-tv"]];
  return (
    <footer className="mt-10 bg-black text-gray-300 border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="flex items-center gap-4">
          <img src={logo} alt={SITE_NAME} className="h-16 w-auto" />
          <p className="text-yellow-400 font-semibold">{SITE_TAGLINE}</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {links.map(([t, to]) => (
            <Link key={t} to={to} className="hover:text-white">{t}</Link>
          ))}
          <Link to={token ? "/admin/dashboard" : "/login"} className="hover:text-white">Admin Login</Link>
        </nav>
      </div>
      <div className="bg-neutral-950 text-center text-xs py-3 text-gray-500">
        © {new Date().getFullYear()} {SITE_DOMAIN} — सर्वाधिकार सुरक्षित · Visits: {stats.totalVisits}
      </div>
    </footer>
  );
};

export default Footer;
