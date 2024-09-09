import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategory, getAllNews } from "./services/operations/admin";
import PrivateRoute from "./components/Admin/auth/PrivateRoute";
import AdminRoutes from "./routes/AdminRoutes";
import RegualerRoutes from "./routes/RegualerRoutes";
import Error from "./pages/Error";
import { saveCategory, setAds, setYT } from "./redux/newsSlice";
import axios from "axios";
import StatusSlider from "./pages/StatusSlider";

function App() {
  const { user } = useSelector((state) => state.auth);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const dispatch = useDispatch();

  const getAllAds = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/ads/getAll`);
      if (!response?.data?.success) {
       console.log("eeror")
      }
      dispatch(setAds(response?.data?.ads));
      // console.log(response?.data?.ads);
    } catch (error) {
      console.log(error);
    }
  };


  const getAllYt = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/yt/getAll`);
      if (!response?.data?.success) {
        console.log(response.data.message)
      }
      dispatch(setYT(response?.data?.videos));
      // console.log(response?.data?.ads);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await fetchCategory();
        dispatch(saveCategory(categoriesData?.categories || []));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const visitAdd = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/visit`);
        
      } catch (error) {
        console.error('Failed to add visit record dashboard ', error);
      }
    };
    fetchCategories();
    dispatch(getAllNews());
    visitAdd();
    getAllYt();

  }, []);


  return (
    <div className="">
    <Routes>
      {/* Regular routes accessible to everyone, including admins */}
      <Route path="/*" element={<RegualerRoutes />} />
      <Route path="/web-story/:id" element={<StatusSlider />} />



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
