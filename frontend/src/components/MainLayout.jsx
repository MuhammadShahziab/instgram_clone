import React from "react";
import { Outlet } from "react-router-dom";
import LeftSideBar from "./LeftSideBar";
import userGetAllPosts from "@/hooks/userGetAllPosts";
import BottomNavigation from "./BottomNavigation";
import Header from "./Header";

const MainLayout = () => {
  const { loading } = userGetAllPosts(); // Get the loading state here

  if (loading) {
    return (
      <div className="relative flex flex-col justify-center items-center h-screen bg-white">
        <img src="/img/logo.jpg" className="lg:w-32 w-24" alt="logo" />
        {/* Optional loading text */}
        <div className="flex flex-col items-center  absolute bottom-10">
          <p className="text-gray-600 max-lg:text-sm">from</p>
          <div className="flex items-center">
            <img src="/img/meta.png" className="lg:w-32 w-24" alt="meta" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header></Header>
      <LeftSideBar />
      <div className="  lg:w-[82%] w-full  md:ml-[9%] lg:ml-[18%]">
        <Outlet></Outlet>
      </div>

      <BottomNavigation></BottomNavigation>
    </div>
  );
};

export default MainLayout;
