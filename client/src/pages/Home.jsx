import React from "react";
import LatestNews from "../components/core/Home/LatestNews";
import CategoryWise from "../components/core/Home/CategoryWise";
import PolllAns from "./PollAns";
import ButtomAdd from "../components/core/Home/ButtomAdd";

function Home() {
  return (
    <div className=" max-w-7xl p-4 mx-auto">

      <LatestNews />
      <CategoryWise />
      <ButtomAdd />
      <PolllAns />
    </div>
  );
}

export default Home;
