import Comment from "@/components/Comment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const Comments = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { posts } = useSelector((state) => state.post);
  const postComments = posts.find((post) => post._id === id);

  const dispatch = useDispatch();

  const handleComments = async (postId) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `https://instgram-clone-3yhc.onrender.com/api/post/comment/${postId}`,
        { text },
        { withCredentials: true }
      );
      if (res?.data?.success) {
        setText("");

        const updatedComments = posts.map((p) =>
          p._id === postId
            ? { ...p, comments: [...p.comments, res?.data?.comment] }
            : p
        );
        console.log(updatedComments, "check update d commets");

        dispatch(setPosts(updatedComments));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen ">
      <div className="flex items-center gap-x-3 px-4 pt-3 pb-3 border-b">
        <div>
          {postComments?.author?.profilePic ? (
            <div className="w-12 h-12  rounded-full instagram-gradient p-0.5">
              <img
                src={postComments?.author?.profilePic}
                alt="profile"
                className="w-full h-full rounded-full object-cover bg-white p-0.5"
              ></img>
            </div>
          ) : (
            <img
              src="/img/noavatar.jpg"
              alt="profile"
              className="w-14 h-14 rounded-full"
            ></img>
          )}
        </div>
        <p className="text-sm font-semibold">
          {postComments?.author?.username}
        </p>
        <p className="text-sm text-gray-500">
          {moment(postComments?.createdAt).fromNow()}
        </p>
      </div>
      <div className="flex-1 flex-col overflow-y-auto px-4 ">
        {postComments.comments.length > 0 ? (
          [...postComments?.comments]?.reverse().map((comment) => (
            <div className="my-6">
              <Comment key={comment._id} comment={comment}></Comment>
            </div>
          ))
        ) : (
          <div className="flex-1 h-full flex items-center justify-center">
            <p className="text-lg text-gray-500 font-semibold">
              No Comments ...
            </p>
          </div>
        )}
      </div>
      <div className="flex items-center gap-x-3 py-2 mb-2 px-3 ">
        <Input
          placeholder="comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className=" outline-none"
        ></Input>
        <Button
          onClick={() => handleComments(postComments?._id)}
          variant="outline"
          disabled={text.trim() === ""}
          className={"text-blue-500"}
        >
          {loading ? <ClipLoader size={18} color="blue"></ClipLoader> : "Post"}
        </Button>
      </div>
    </div>
  );
};

export default Comments;
