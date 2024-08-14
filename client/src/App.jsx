import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllNews } from "./services/operations/admin";
import PrivateRoute from "./components/Admin/auth/PrivateRoute";
import AdminRoutes from "./routes/AdminRoutes";
import RegualerRoutes from "./routes/RegualerRoutes";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllNews());
  }, []);
  return (
    <div className="">
 
      <Routes>
        {/* <Route path="/" element={<H />}  /> */}
        <Route path="/*" element={<RegualerRoutes />} />

        <Route
          path="/*"
          element={
            <PrivateRoute>
              <AdminRoutes />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
