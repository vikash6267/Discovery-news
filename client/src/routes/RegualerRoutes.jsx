import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../components/Admin/pages/Login";
import OpenRoute from "../components/Admin/auth/OpenRoute";
import Navbar from "../components/common/Navbar/Navbar";
import Home from "../pages/Home";
import SubNavbar from "../components/common/Navbar/SubNavbar";
import BreakingNews from "../components/core/Home/BreakingNews";

import Error from "../pages/Error";
import ScrollToTop from "../components/common/ScrollToTop";
import Whatsapp from "../components/common/Whatsapp";
import Footer from "../components/common/Footer";
import SingleNews from "../pages/SingleNews";
import CategoryPage from "../pages/CategoryDetails";
import SubCategoryPage from "../pages/SubcategoryDetails";
import LogoSpace from "../components/common/Navbar/LogoSpace";
import StateSubcategories from "../components/common/Navbar/StateSubcategories";
import PolllAns from "../pages/PollAns";
import AddSlideBar from "../components/core/Home/AddSlideBar";
import Videos from "../pages/Videos";
import Live from "../pages/LiveTV";
import Stories from "../pages/Stories";

function RegualerRoutes() {
  return (
    <>
      <SubNavbar />
      <LogoSpace />
      <Navbar />
      <StateSubcategories />
      <br />
      <BreakingNews />
      <AddSlideBar />
      {/* <div className="h-screen w-screen bg-white"></div> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/polls" element={<PolllAns />} />
        <Route path="/video" element={<Videos />} />
        <Route path="/live-tv" element={<Live />} />
        <Route path="*" element={<Error />} />
        <Route path="/:id" element={<SingleNews />} />
     
        <Route path="category/:id" element={<CategoryPage />} />
        <Route path="subcategory/:id" element={<SubCategoryPage />} />
        <Route path="/web-stories" element={<Stories />} />

        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
      </Routes>
      <Footer />
      <Whatsapp />
      <ScrollToTop />
    </>
  );
}

export default RegualerRoutes;
