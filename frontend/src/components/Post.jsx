import React, { useState, useEffect } from "react";
import { MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FaHeart, FaRegBookmark } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import CommentDialoge from "./CommentDialoge";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaBookmark } from "react-icons/fa6";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import axios from "axios";
import { setPosts } from "@/redux/postSlice";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import HoverProfile from "./HoverProfile";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { setAuthUser } from "@/redux/authSlice";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [commentLoading, setCommentLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCounter, setLikesCounter] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false); // Initially false

  const [commentsCounter, setCommentsCounter] = useState(
    post?.comments?.length
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (user && post?.likes) {
      const hasLiked = post.likes.some((like) => like._id === user._id);
      setIsLiked(hasLiked);
      setLikesCounter(post?.likes?.length);
    }
  }, [post, user]);
  useEffect(() => {
    if (user && post) {
      const bookmarked = user?.bookmarks?.includes(post?._id);
      setIsBookmarked(bookmarked);
    }
  }, [user, post?._id]); // Ensure it runs when user or post data changes

  // Handle like and dislike logic
  const handleLikesAndDislikes = async (postId) => {
    const action = isLiked ? "dislike" : "like";
    try {
      const res = await axios.post(
        `https://instgram-clone-3yhc.onrender.com/api/post/${action}/${postId}`,
        {},
        { withCredentials: true }
      );
      setShowHeart(true); // Show heart when clicked

      if (res?.data?.success) {
        setTimeout(() => {
          setShowHeart(false);
        }, 1000);
        // Update the like state based on the action
        const updatedLikes = isLiked
          ? post.likes.filter((like) => like._id !== user._id) // Remove like
          : [...post.likes, { _id: user._id, username: user.username }]; // Add like

        // Update the state
        setLikesCounter(updatedLikes.length);
        setIsLiked(!isLiked);

        // Update post data in Redux store
        const updatedPostData = posts.map((p) =>
          p._id === postId ? { ...p, likes: updatedLikes } : p
        );
        dispatch(setPosts(updatedPostData));

        toast.success(res?.data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

        const updatedComments = posts.map((p) =>
          p._id === postId
            ? { ...p, comments: [...p.comments, res?.data?.comment] }
            : p
        );
        dispatch(setPosts(updatedComments));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCommentEvent = (e) => {
    const value = e.target.value;
    setComment(value.trim() ? value : "");
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
        toast.success(res?.data?.message);
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
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

        const updateUserBookmarks = isBookmarked
          ? user?.bookmarks?.filter((b) => b !== post?._id) // Remove post _id if already bookmarked
          : [...user?.bookmarks, post?._id]; // Add post _id if not bookmarked

        try {
          // Dispatching the updated user bookmarks
          dispatch(setAuthUser({ ...user, bookmarks: updateUserBookmarks }));
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

  return (
    <div className=" mb-8 mt-4 w-full md:max-w-lg md:mx-auto  ">
      {/* Post Header */}
      <div className="flex justify-between items-center max-md:px-1 ">
        <div className="flex items-center gap-x-1">
          <HoverCard className="min-w-[600px]">
            <HoverCardTrigger>
              <div className="flex items-center gap-x-3">
                <div className="w-11 h-11 md:w-11 md:h-11 rounded-full instagram-gradient p-0.5">
                  {post?.author?.profilePic ? (
                    <Link to={`/profile/${post?.author?._id}`}>
                      <img
                        src={post?.author?.profilePic}
                        alt="profile_pic"
                        className="w-full h-full rounded-full object-cover bg-white p-0.5"
                      />
                    </Link>
                  ) : (
                    <Link to={`/profile/${post?.author?._id}`}>
                      <img
                        src="/img/noavatar.jpg"
                        alt="profile"
                        className="w-full h-full rounded-full object-cover bg-white p-0.5"
                      />
                    </Link>
                  )}
                </div>

                <div className="flex items-center gap-x-1">
                  <Link to={`/profile/${post?.author?._id}`}>
                    <p className="font-semibold text-sm  cursor-pointer">
                      {post?.author?.username}
                    </p>
                  </Link>
                </div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="min-w-[350px]  p-0 pb-4">
              <HoverProfile user={post?.author}></HoverProfile>
            </HoverCardContent>
          </HoverCard>

          <span className="w-[3px] h-[3px] bg-gray-500 rounded-full"></span>
          <span className="text-[10px] lg:text-sm text-gray-500">
            {moment(post?.createdAt).fromNow()}
          </span>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal
              size={22}
              className="cursor-pointer text-gray-800"
            />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center p-0 gap-0 max-w-sm">
            {user?._id !== post?.author?._id &&
              user?.following?.includes(post?.author?._id.toString()) && (
                <div className="text-red-500 cursor-pointer p-4 rounded-t-lg hover:bg-gray-100 font-bold border-b-[1px] text-center w-full">
                  Unfollow
                </div>
              )}

            <div
              onClick={() => handleBookmarkPost(post?._id)}
              className="border-b-[1px] cursor-pointer p-4 rounded-t-lg hover:bg-gray-100 text-center w-full text-md"
            >
              Add to favourites
            </div>
            <div className="border-b-[1px] cursor-pointer p-4 rounded-t-lg hover:bg-gray-100 text-center w-full text-md">
              About this account
            </div>
            {user?._id === post?.author?._id && (
              <div
                onClick={() => handleDeletePost(post?._id)}
                className="text-red-500 font-bold border-b-[1px] cursor-pointer p-4 rounded-t-lg hover:bg-gray-100 text-center w-full"
              >
                Delete
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <div
        onDoubleClick={() => handleLikesAndDislikes(post?._id)}
        className="cursor-pointer relative"
      >
        {/* Heart icon animation */}
        {showHeart && (
          <img
            src="/img/heart.png"
            alt="like"
            className="absolute top-1/2 left-1/2 z-10 h-16 w-16 animate-heartBeat transform -translate-x-1/2 -translate-y-1/2 "
          />
        )}

        {/* Post Image(s) */}
        {post?.images.length === 1 ? (
          <img
            src={post?.images[0]}
            alt="post"
            className="w-full  my-3 border md:rounded-sm object-cover aspect-square"
          />
        ) : (
          <Carousel opts={{ align: "start" }} className="w-full my-3">
            <CarouselContent className="p-0 m-0">
              {post?.images.map((image, index) => (
                <CarouselItem
                  onClick={() => handleLikesAndDislikes(post?._id)}
                  key={index}
                  className="p-0 m-0"
                >
                  <div className="w-full h-full">
                    <img
                      src={image}
                      alt="Selected Image"
                      className="w-full h-auto aspect-square rounded-sm object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext className="absolute right-3"></CarouselNext>
            <CarouselPrevious className="absolute left-3"></CarouselPrevious>
          </Carousel>
        )}
      </div>
      {/* Like, Comment, and Save */}
      <div className="flex items-center justify-between my-2 max-md:px-2">
        <div className="flex items-center gap-x-4">
          {isLiked ? (
            <FaHeart
              size={26}
              className="cursor-pointer  text-red-600"
              onClick={() => handleLikesAndDislikes(post?._id)}
            />
          ) : (
            <FaRegHeart
              size={26}
              onClick={() => handleLikesAndDislikes(post?._id)}
              className="cursor-pointer  hover:text-gray-600"
            />
          )}
          <Link to={`/p/${post?._id}`} className="lg:hidden">
            <MessageCircle
              size={26}
              className="hover:text-gray-600    cursor-pointer"
            />
          </Link>

          <MessageCircle
            onClick={() => setOpen(true)}
            size={26}
            className="hover:text-gray-600 max-lg:hidden  cursor-pointer"
          />
          <Send size={24} className="cursor-pointer  hover:text-gray-600" />
        </div>
        {isBookmarked ? (
          <FaBookmark
            onClick={() => handleBookmarkPost(post?._id)}
            size={22}
            className="cursor-pointer hover:text-gray-600"
          ></FaBookmark>
        ) : (
          <FaRegBookmark
            onClick={() => handleBookmarkPost(post?._id)}
            size={22}
            className="cursor-pointer hover:text-gray-600"
          />
        )}
      </div>

      {/* Likes Counter */}
      <span className="font-medium mt-3 md:mt-2  mb-0 block text-sm  max-md:px-2">
        {likesCounter} likes
      </span>

      {/* Post Caption */}
      <p className="text-sm max-md:px-2">
        <span className="font-semibold mr-2 text-sm">
          {post?.author?.username}
        </span>
        {post?.caption} 🍌🍎🍇
      </p>

      {/* View Comments */}
      <span
        className="text-sm text-gray-500 cursor-pointer  max-md:px-2"
        onClick={() => setOpen(true)}
      >
        View all {commentsCounter} comments
      </span>

      <CommentDialoge
        open={open}
        setOpen={setOpen}
        post={post}
        isLiked={isLiked}
        handleLikesAndDislikes={handleLikesAndDislikes}
        handleComments={handleComments}
        comment={comment}
        setComment={setComment}
        handleDeletePost={handleDeletePost}
        commentLoading={commentLoading}
        handleBookmarkPost={handleBookmarkPost}
        isBookmarked={isBookmarked}
        likesCounter={likesCounter}
      />

      {/* Add Comment */}
      <div className="border-b-[1px] border-gray-300 my-3 pb-3 flex justify-between items-center max-md:px-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={handleCommentEvent}
          className="border-none text-gray-600 bg-transparent w-full focus:ring-0 outline-none text-sm"
        />
        <span
          onClick={() => handleComments(post._id)}
          className={`text-xs font-semibold cursor-pointer max-md:text-[14px] ${
            comment.trim() ? "text-blue-500" : "text-blue-300"
          }`}
        >
          {commentLoading ? <ClipLoader color="blue" size={18} /> : " Post"}
        </span>
      </div>
    </div>
  );
};

export default Post;
