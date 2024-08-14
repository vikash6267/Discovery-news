import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../components/Admin/pages/Login";
import OpenRoute from "../components/Admin/auth/OpenRoute";
import Navbar from "../components/common/Navbar/Navbar";
import Home from "../pages/Home";
import SubNavbar from "../components/common/Navbar/SubNavbar";
import BreakingNews from "../components/core/Home/BreakingNews";

function RegualerRoutes() {
  return (
    <>
      <SubNavbar />
      <Navbar />
      <BreakingNews />
      {/* <div className="h-screen w-screen bg-white"></div> */}
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
      </Routes>
    </>
  );
}

export default RegualerRoutes;
