import React from "react";
import Stories from "./Stories";
import Posts from "./Posts";
const Feed = () => {
  return (
    <div className="flex-1 flex flex-col ">
      <Stories></Stories>

      <Posts></Posts>
    </div>
  );
};

export default Feed;
