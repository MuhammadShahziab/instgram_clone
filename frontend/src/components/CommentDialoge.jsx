import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { Button } from "./ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useSelector } from "react-redux";
import Comment from "./Comment";
import { ClipLoader } from "react-spinners";

const CommentDialoge = ({
  open,
  setOpen,
  post,
  handleLikesAndDislikes,
  isLiked,
  handleComments,
  comment,
  setComment,
  handleDeletePost,
  commentLoading,
  handleBookmarkPost,
  isBookmarked,
  likesCounter,
}) => {
  const { user } = useSelector((state) => state.auth);
  const [comments, setComments] = useState([]);
  useEffect(() => {
    if (post) {
      setComments(post?.comments);
    }
  }, [post, post?.comments]);

  const handleCommentEvent = (e) => {
    const value = e.target.value;
    if (value.trim()) {
      setComment(value);
    } else {
      setComment("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="p-0 max-w-5xl flex flex-col max-h-[90vh] min-h-[90vh] "
        onInteraction={() => setOpen(false)}
        style={{ maxHeight: "90vh" }}
      >
        <div className="flex flex-1 max-md:flex-col  h-full">
          {/* Left Image/Carousel Section */}
          <div className=" md:w-1/2 flex items-start md:items-center max-md:max-h-[70vh]  md:min-h-[87vh]  ">
            {post?.images?.length === 1 ? (
              <img
                src={post?.images[0]}
                className=" w-full md:h-full h-[70vh] object-cover rounded-l-lg"
                alt="post"
                style={{ maxHeight: "90vh" }}
              />
            ) : (
              <Carousel
                opts={{ align: "start" }}
                className="w-full  flex items-center  h-full"
              >
                <CarouselContent className="p-0 m-0 h-full">
                  {post?.images.map((image, index) => (
                    <CarouselItem
                      key={index}
                      className="p-0 m-0 "
                      style={{ minHeight: "89vh" }}
                    >
                      <div className="w-full h-full">
                        <img
                          src={image}
                          alt="Selected Image"
                          className="w-full h-full object-cover rounded-l-lg"
                          style={{ maxHeight: "90vh" }}
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

          {/* Right Content Section */}
          <div className="md:w-1/2 py-2 flex flex-col justify-between  h-full">
            <div className="flex items-center justify-between max-md:hidden px-4 border-b-[0.5px] border-gray-300 pb-2 ">
              <div className="flex items-center gap-x-2">
                <Link to={"/profile"}>
                  <div className="w-11 h-11 rounded-full  instagram-gradient p-0.5">
                    {post?.author?.profilePic ? (
                      <img
                        src={post?.author?.profilePic}
                        alt="profile_pic"
                        className="roundful w-full h-full rounded-full bg-white p-0.5 object-cover"
                      />
                    ) : (
                      <img
                        src="/img/noavatar.jpg"
                        alt="avatar"
                        className="roundful w-full h-full rounded-full bg-white p-0.5 object-cover"
                      />
                    )}
                  </div>
                </Link>
                <Link to={"/profile"}>
                  <span className="text-sm font-medium ">
                    {post?.author?.username}
                  </span>
                </Link>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal
                    size={20}
                    className="cursor-pointer text-gray-800"
                  />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center p-0 gap-0  max-w-sm ">
                  <div className="text-red-500 cursor-pointer p-4 rounded-t-lg hover:bg-gray-100  font-bold border-b-[1px]  text-center w-full">
                    Unfollow
                  </div>
                  <div className=" border-b-[1px] cursor-pointer p-4 rounded-t-lg hover:bg-gray-100  text-center w-full text-md">
                    Add to favourites
                  </div>
                  <div className=" border-b-[1px] cursor-pointer p-4 rounded-t-lg hover:bg-gray-100 text-center w-full text-md">
                    About this account
                  </div>

                  {user?._id === post?.author?._id && (
                    <div
                      onClick={() => handleDeletePost(post._id)}
                      className=" text-red-500 font-bold cursor-pointer border-b-[1px]cursor-pointer p-4 rounded-t-lg hover:bg-gray-100 text-center w-full"
                    >
                      Delete
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            {/* Comment Section */}
            <div className="max-h-[50vh] min-h-[50vh] overflow-y-auto max-md:hidden flex flex-col gap-y-6  flex-1 p-4">
              {comments?.length > 0 ? (
                <>
                  {[...comments]?.reverse().map((comment) => (
                    <Comment key={comment._id} comment={comment} />
                  ))}
                </>
              ) : (
                <div className="flex flex-col items-center flex-1 justify-center gap-y-2 h-full">
                  <h1 className="font-bold text-2xl text-center">
                    No comments yet.
                  </h1>
                  <p className="text-center text-sm ">
                    Start the conversation.
                  </p>
                </div>
              )}
            </div>

            <hr />

            {/* Like, Comment, Bookmark */}
            <div className="flex items-center justify-between my-2 px-4 pt-2">
              <div className="flex items-center gap-x-2">
                {isLiked ? (
                  <FaHeart
                    size={22}
                    className="cursor-pointer text-red-600"
                    onClick={() => handleLikesAndDislikes(post?._id)}
                  />
                ) : (
                  <FaRegHeart
                    onClick={() => handleLikesAndDislikes(post?._id)}
                    size={22}
                    className="cursor-pointer hover:text-gray-600"
                  />
                )}
                <MessageCircle className="hover:text-gray-600 cursor-pointer"></MessageCircle>
                <Send className="cursor-pointer hover:text-gray-600"></Send>
              </div>

              {isBookmarked ? (
                <FaBookmark
                  onClick={() => handleBookmarkPost(post?._id)}
                  size={22}
                  className="cursor-pointer "
                ></FaBookmark>
              ) : (
                <FaRegBookmark
                  onClick={() => handleBookmarkPost(post?._id)}
                  size={22}
                  className="cursor-pointer hover:text-gray-600"
                />
              )}
            </div>

            {/* Comment Input */}
            <div className="px-4">
              <span className="font-medium mt-2 mb-0 block text-sm">
                {likesCounter} likes
              </span>
              <p className=" text-sm ">
                <span className="font-semibold mr-2 text-sm">
                  {post?.author?.username}
                </span>
                {post?.caption} 🍌🍎🍇
              </p>
            </div>

            <div className=" py-2 px-4 flex justify-between items-center">
              <input
                type="text"
                className="outline-none w-full text-sm"
                name="comment"
                value={comment}
                onChange={handleCommentEvent}
                placeholder="Add a comment..."
              />

              <div className="flex items-center gap-x-1">
                <Button
                  variant="outlined"
                  onClick={() => handleComments(post._id)}
                  disabled={comment.trim().length === 0}
                  className="text-[#0095F6] font-medium text-sm cursor-pointer"
                >
                  {commentLoading ? (
                    <ClipLoader size={18} color="blue"></ClipLoader>
                  ) : (
                    "Post"
                  )}
                </Button>

                <span>😊</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialoge;
