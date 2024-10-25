import Feed from "@/components/Feed";
import RightSideBar from "@/components/RightSideBar";
import getSuggestedUsers from "@/hooks/getSuggestedUsers";
import userGetAllPosts from "@/hooks/userGetAllPosts";
import React from "react";
import { Outlet } from "react-router-dom";

const Home = () => {
  userGetAllPosts();
  getSuggestedUsers();

  return (
    <div className="flex justify-between max-md:mt-14 ">
      <div className="flex-1 flex flex-col items-center">
        <Feed></Feed>
        <Outlet></Outlet>
      </div>
      <div className="w-[32%] hidden lg:block">
        <RightSideBar></RightSideBar>
      </div>
    </div>
  );
};

export default Home;
