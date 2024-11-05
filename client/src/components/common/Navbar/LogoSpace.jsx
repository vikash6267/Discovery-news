import React from "react";
import banner from "../../../assests/banner.png";
import logo from "../../../assests/newlogo.jpg"
function LogoSpace() {
  return (
    <div className=" max-w-7xl p-4 mx-auto  ">
      <div className=" flex justify-center mb-8 ">
        <img src={logo} alt=""  className="lg:max-h-[150px] max-h-[100px]"
        />
      </div>
      <div className=" flex justify-center ">
        <img src={banner} alt="" />
      </div>
    </div>
  );
}

export default LogoSpace;
