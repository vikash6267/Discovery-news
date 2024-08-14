import { Route, Routes } from "react-router-dom";

import Navbar from "./components/common/Navbar/Navbar";
import Home from "./pages/Home";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllNews } from "./services/operations/admin";

function App() {
  const dispatch = useDispatch();

  useEffect(()=>{

    dispatch(getAllNews());

  },[])
  return (
    <div className="App">
    
   <Navbar />
   <Routes>
   <Route path="/" element={<Home />} />


</Routes>
    </div>
  );
}

export default App;
