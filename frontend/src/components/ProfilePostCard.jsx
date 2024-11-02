import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { BiSolidMessageRounded } from "react-icons/bi";
import { IoCopy } from "react-icons/io5";
import { setAuthUser, setUserProfile } from "@/redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import CommentDialoge from "./CommentDialoge";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";

const ProfilePostCard = ({ post, explore }) => {
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);

  const [commentLoading, setCommentLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCounter, setLikesCounter] = useState(0);
  const [commentsCounter, setCommentsCounter] = useState(
    post?.comments?.length || 0
  );

  const { userProfile } = useSelector((store) => store.auth);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [isBookmarked, setIsBookmarked] = useState(false); // Initially false

  const dispatch = useDispatch();

  useEffect(() => {
    if (post && post.likes && user) {
      const hasLiked = post.likes.some((like) => like._id === user._id);

      setIsLiked(hasLiked);
      setLikesCounter(post?.likes?.length);
    }
  }, [post, user]);
  useEffect(() => {
    if (user && post) {
      const bookmarked = userProfile?.bookmarks?.some(
        (b) => b._id === post?._id
      );
      setIsBookmarked(bookmarked);
    }
  }, [user, post?._id]); // Ensure it runs when user or post data changes

  const handleComments = async (postId) => {
    try {
      setCommentLoading(true);
      const res = await axios.post(
        `https://instgram-clone-3yhc.onrender.com/api/post/comment/${postId}`,
        { text: comment },
        { withCredentials: true }
      );
      if (res?.data?.success) {
        setComment("");
        setCommentsCounter(commentsCounter + 1);

        const updatedComments = userProfile?.posts.map((p) =>
          p._id === post?._id
            ? { ...p, comments: [...p.comments, res?.data?.comment] }
            : p
        );

        const updateData = { ...userProfile, posts: updatedComments };
        dispatch(setUserProfile(updateData));
        // Update the post in the global posts slice

        const updatedPost = posts.map((p) =>
          p._id === postId
            ? { ...p, comments: [...p.comments, res?.data?.comment] }
            : p
        );

        dispatch(setPosts(updatedPost));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCommentLoading(false);
    }
  };
  const handleLikesAndDislikes = async (postId) => {
    const action = isLiked ? "dislike" : "like";
    try {
      const res = await axios.post(
        `https://instgram-clone-3yhc.onrender.com/api/post/${action}/${postId}`,
        {},
        { withCredentials: true }
      );

      if (res?.data?.success) {
        // Update the like state based on the action
        const updatedLikes = isLiked
          ? post.likes.filter((like) => like._id !== user._id) // Remove like
          : [...post.likes, { _id: user._id, username: user.username }]; // Add like
        // Update the state
        setLikesCounter(updatedLikes.length);
        setIsLiked(!isLiked);

        // Update post data in Redux store fro user profile

        const updatedPostData = userProfile?.posts.map((p) =>
          p._id === postId ? { ...p, likes: updatedLikes } : p
        );

        const update = { ...userProfile, posts: updatedPostData };
        dispatch(setUserProfile(update));

        // Dispatch the updated posts to the posts slice

        const updatedPosts = posts.map((p) =>
          p._id === postId ? { ...p, likes: updatedLikes } : p
        );

        dispatch(setPosts(updatedPosts));

        toast.success(res?.data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleBookmarkPost = async (postId) => {
    try {
      const res = await axios.post(
        `https://instgram-clone-3yhc.onrender.com/api/post/bookmark/${postId}`,
        {},
        { withCredentials: true }
      );

      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setOpen(false);
        const updateUserBookmarks = isBookmarked
          ? userProfile?.bookmarks?.filter((b) => b._id !== post?._id) // Remove post _id if already bookmarked
          : [...userProfile?.bookmarks, post]; // Add post _id if not bookmarked

        try {
          // Dispatching the updated user bookmarks
          dispatch(setAuthUser({ ...user, bookmarks: updateUserBookmarks }));
          dispatch(
            setUserProfile({ ...userProfile, bookmarks: updateUserBookmarks })
          );
        } catch (dispatchError) {
          console.error("Dispatch failed:", dispatchError);
        }

        setIsBookmarked(!isBookmarked);
      }
    } catch (error) {
      console.error("Error in handleBookmarkPost:", error); // Log the error to check what went wrong
      toast.error("Failed to update bookmark status");
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const res = await axios.delete(
        `https://instgram-clone-3yhc.onrender.com/api/post/delete/${postId}`,
        { withCredentials: true }
      );
      if (res?.data?.success) {
        const updatedPosts = posts.filter((p) => p._id !== postId);
        dispatch(setPosts(updatedPosts));

        const udpateUserProfile = userProfile?.posts.filter(
          (p) => p._id !== postId
        );
        dispatch(setUserProfile({ ...userProfile, posts: udpateUserProfile }));

        toast.success(res?.data?.message);
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <>
      <div
        key={post?._id}
        className="relative group cursor-pointer"
        onClick={() => setOpen(true)}
      >
        {/* Ensure that post?.images exists and is not empty before rendering */}
        {post?.images?.length > 0 ? (
          <img
            src={post?.images[0]}
            style={{ width: "100%" }}
            className={`${
              explore ? "" : "h-full w-full object-cover aspect-square"
            } `}
            alt="post_image"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-200">
            <p>No Image Available</p>
          </div>
        )}
        <div className="absolute flex justify-center items-center bg-black/40 top-0 bottom-0 right-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {post?.images?.length > 1 && (
            <IoCopy className="absolute top-3 right-3 text-white" />
          )}
          <div className="flex items-center gap-x-6">
            <p className="flex items-center gap-x-2 text-white font-bold">
              <FaHeart className="text-white text-lg" />
              {post?.likes?.length}
            </p>
            <p className="flex items-center gap-x-2 text-white font-bold text-lg">
              <BiSolidMessageRounded className="text-white" />
              {post?.comments?.length}
            </p>
          </div>
        </div>
      </div>

      <CommentDialoge
        open={open}
        setOpen={setOpen}
        post={post}
        isLiked={isLiked}
        handleLikesAndDislikes={handleLikesAndDislikes}
        handleComments={handleComments}
        comment={comment}
        setComment={setComment}
        likesCounter={likesCounter}
        handleDeletePost={handleDeletePost}
        commentLoading={commentLoading}
        handleBookmarkPost={handleBookmarkPost}
        isBookmarked={isBookmarked}
      />
    </>
  );
};

export default ProfilePostCard;
