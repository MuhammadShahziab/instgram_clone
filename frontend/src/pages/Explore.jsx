import ProfilePostCard from "@/components/ProfilePostCard";
import React from "react";

import { useSelector } from "react-redux";

const ExplorePage = () => {
  const { posts } = useSelector((store) => store.post);

  return (
    <div className="explore-page max-md:my-12 mb-32   mt-9 max-md:mt-[60px] max-w-[95%] mx-auto">
      {posts &&
        posts.map((item) => (
          <div className="post relative group" key={item._id}>
            <ProfilePostCard post={item} explore={true} />
          </div>
        ))}
    </div>
  );
};

export default ExplorePage;
