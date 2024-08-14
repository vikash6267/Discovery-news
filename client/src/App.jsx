import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllNews } from "./services/operations/admin";
import PrivateRoute from "./components/Admin/auth/PrivateRoute";
import AdminRoutes from "./routes/AdminRoutes";
import RegualerRoutes from "./routes/RegualerRoutes";
import Error from "./pages/Error";

function App() {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllNews());
  }, []);
  return (
    <div className="">
    <Routes>
      {/* Regular routes accessible to everyone, including admins */}
      <Route path="/*" element={<RegualerRoutes />} />

      {/* Admin-specific routes protected by PrivateRoute */}
      {(user?.role === "Admin" || user?.role === "SuperAdmin") && (
        <Route
          path="/admin/*"
          element={
            <PrivateRoute>
              <AdminRoutes />
            </PrivateRoute>
          }
        />
      )}

      {/* Catch-all route for unmatched paths (404) */}
      <Route path="*" element={<Error />} />
    </Routes>
  </div>

  );
}

export default App;
