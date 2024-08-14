import React from 'react'
import { Route, Routes } from "react-router-dom";

// admin
import Login from "../components/Admin/pages/Login";
import Layout from "../components/Admin/pages/Layout";
import PrivateRoute from "../components/Admin/auth/PrivateRoute";
import DashBoard from "../components/Admin/pages/Dashboard";
import AddNews from "../components/Admin/pages/AddNews";
import OpenRoute from "../components/Admin/auth/OpenRoute";
import AllNews from "../components/Admin/pages/AllNews";
import Category from "../components/Admin/pages/Category";
import Subcategory from "../components/Admin/pages/Subcategory";
import Livestreming from "../components/Admin/pages/Livestreming";
import Breaking from "../components/Admin/pages/Breaking";
import Poll from "../components/Admin/pages/Poll";
import CreateAdd from "../components/Admin/pages/CreateAdd";
import AdminManage from "../components/Admin/pages/ManageAdmin";
import CreateYtVideo from "../components/Admin/pages/CreateYtVideo";
import UsersTable from "../components/Admin/pages/AllUser";
import { useSelector } from 'react-redux';

function AdminRoutes() {
  const { user } = useSelector((state) => state.auth);

  return (
<Routes>

    <Route
    element={
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    }
  > 
{(user?.role === "Admin" || user?.role === "SuperAdmin") && (
      <>
        <Route path="/admin/dashboard" element={<DashBoard />} />
        <Route path="admin/addnews" element={<AddNews />} />
        <Route path="admin/addnews/:id" element={<AddNews />} />
        <Route path="admin/allnews" element={<AllNews />} />

        <Route path="admin/poll" element={<Poll />} />
        <Route path="admin/breaking" element={<Breaking />} />
        <Route path="admin/category" element={<Category />} />
        <Route path="admin/subcategory" element={<Subcategory />} />
        <Route path="admin/livestriming" element={<Livestreming />} />
        <Route path="admin/ads" element={<CreateAdd />} />
        <Route path="admin/yt" element={<CreateYtVideo />} />
        <Route path="admin/users" element={<UsersTable />} />

        {user?.role === "SuperAdmin" && (
          <Route path="admin/manageadmin" element={<AdminManage />} />
        )}
      </>
    )}
    </Route>
</Routes>

  )
}

export default AdminRoutes