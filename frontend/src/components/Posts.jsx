import React from "react";
import Post from "./Post";
import { useSelector } from "react-redux";

const Posts = () => {
  const { posts } = useSelector((state) => state.post);

  return (
    <div className="">
      {posts?.map((item, index) => (
        <Post key={index} post={item}></Post>
      ))}
    </div>
  );
};

export default Posts;
