import { Button } from "@/components/ui/button";
import getUserProfile from "@/hooks/getUserProfile";
import {
  ArrowBigRight,
  ArrowRight,
  Bookmark,
  Grid,
  LockIcon,
  MoreHorizontal,
  PersonStandingIcon,
  PlaySquareIcon,
} from "lucide-react";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import ProfilePostCard from "@/components/ProfilePostCard";
import axios from "axios";
import {
  addFollower,
  addFollowing,
  removeFollower,
  removeFollowing,
} from "@/redux/authSlice";
import { toast } from "sonner";
import StoryHighLights from "@/components/StoryHighLights";

const Profile = () => {
  const params = useParams();
  const userid = params.id;
  const imgRef = useRef();
  const { userProfile, user } = useSelector((store) => store.auth);
  const [actionTab, setActionTab] = useState("posts");
  const [isFollowed, setIsFollowed] = useState(
    userProfile?.followers.some((f) => f._id === user?._id)
  );
  const [followRequestSent, setFollowRequestSent] = useState(
    userProfile?.followRequests.find((follower) => follower._id === user?._id)
  );
  getUserProfile(userid);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleTabChange = (tab) => {
    setActionTab(tab);
  };
  const displyedPosts =
    actionTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  useEffect(() => {
    if (userProfile) {
      const isFollowed = userProfile?.followers.some(
        (f) => f._id === user?._id
      );
      setIsFollowed(isFollowed);
      const followRequestSent = userProfile?.followRequests.find(
        (follower) => follower._id === user?._id
      );
      setFollowRequestSent(followRequestSent);
    }
  }, [userProfile, dispatch]);

  const handleFollowOrUnfollow = async () => {
    const action = isFollowed ? "unfollow" : "follow";
    try {
      const res = await axios.post(
        `https://instgram-clone-3yhc.onrender.com/api/user/${action}/${userProfile?._id}`,
        {},
        { withCredentials: true }
      );

      if (res?.data?.success) {
        // toast.success(res?.data?.message);

        if (isFollowed) {
          // Unfollow logic
          setIsFollowed(false);
          dispatch(removeFollower(user?._id));
          dispatch(removeFollowing(userProfile?._id));
        } else {
          // Follow logic for private accounts
          if (userProfile?.isPrivate && !isFollowed) {
            setFollowRequestSent(true); // Follow request sent for private accounts
          } else {
            // Regular follow action
            setIsFollowed(true);
            dispatch(addFollower(user));
            dispatch(addFollowing(userProfile?._id));
          }
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to follow or unfollow user"
      );
    }
  };
  const handleMessageConversation = async () => {
    try {
      const res = await axios.post(
        "https://instgram-clone-3yhc.onrender.com/api/conversation/create",
        {
          recipientId: userProfile?._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res?.data?.success) {
        navigate(`/direct/${res?.data?.conversation?._id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const isLoggedInUserProfile = userProfile?._id === user?._id;
  return (
    <div className="w-full lg:max-w-5xl lg:mx-auto my-9 lg:my-12 flex flex-col gap-8 lg:gap-12  ">
      <div className="flex flex-col gap-y-8 lg:gap-y-12 ">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Profile image & details row for mobile */}
          <div className="flex md:hidden px-5 gap-x-5 items-center mt-9 ">
            {/* Profile image */}
            <div className=" flex justify-start   ">
              <div className="w-20 h-20 rounded-full instagram-gradient  p-0.5">
                {userProfile?.profilePic ? (
                  <img
                    src={userProfile?.profilePic}
                    alt="profile_pic"
                    onClick={() => imgRef.current.click()}
                    className="w-full h-full cursor-pointer rounded-full object-cover bg-white p-0.5"
                  />
                ) : (
                  <img
                    src="/img/noavatar.jpg"
                    alt="profile"
                    onClick={() => imgRef.current.click()}
                    className="w-full h-full cursor-pointer rounded-full object-cover bg-white p-0.5"
                  />
                )}
              </div>
            </div>

            {/* Username, follow button & message button */}
            <div className="flex flex-col  ">
              <span className="font-semibold">{userProfile?.username}</span>
              <div className="flex gap-x-2 mt-2">
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/accounts/edit">
                      <Button
                        variant="secondary"
                        className="h-8 hover:bg-gray-200 font-semibold"
                      >
                        Edit profile
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="h-8 hover:bg-gray-200 font-semibold"
                    >
                      View archive
                    </Button>
                    <Button
                      variant="secondary"
                      className="h-8 hover:bg-gray-200 max-md:hidden font-semibold"
                    >
                      Add tools
                    </Button>
                  </>
                ) : (
                  <>
                    {isFollowed ? (
                      <Button
                        onClick={handleFollowOrUnfollow}
                        variant="outline"
                        className="h-8"
                      >
                        Unfollow
                      </Button>
                    ) : followRequestSent ? (
                      <Button
                        variant="secondary"
                        className="h-8 font-semibold flex items-center gap-x-2"
                      >
                        Request Sent <ArrowRight size={14} />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleFollowOrUnfollow}
                        className="h-8 bg-[#0095f6] hover:bg-[#0094f6e8] font-semibold text-white"
                      >
                        Follow
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      onClick={handleMessageConversation}
                      className="h-8 hover:bg-gray-200 font-semibold"
                    >
                      Message
                    </Button>
                  </>
                )}
              </div>
              {/* Posts, Followers, Following */}
              <div className="flex items-center gap-x-6 mt-3 ">
                <p className="font-semibold  text-sm flex flex-col items-center">
                  {userProfile?.posts?.length}{" "}
                  <span className="font-normal ">Posts</span>
                </p>
                <p className="font-semibold text-sm flex flex-col items-center">
                  {userProfile?.followers?.length}{" "}
                  <span className="font-normal ">Followers</span>
                </p>
                <p className="font-semibold text-sm flex flex-col items-center">
                  {userProfile?.following?.length}{" "}
                  <span className="font-normal ">Following</span>
                </p>
              </div>
            </div>
          </div>

          {/* Full name, bio & hobbies row for mobile */}
          <div className="md:hidden mt-1 flex flex-col gap-y-1 px-5 text-sm ">
            <p className="font-medium">{userProfile?.fullName}</p>
            <span>{userProfile?.bio || "Bio here..."}</span>
            <div className="flex flex-col gap-y-1">
              {userProfile?.hobbies?.map((hobby, index) => (
                <span className="text-gray-500" key={index}>
                  {hobby}
                </span>
              ))}
            </div>
          </div>

          {/* Large screen layout */}
          <div className="hidden md:flex flex-row gap-4 w-full">
            {/* Profile image */}
            <div className="flex justify-end w-[30%] pr-12">
              <div className="w-24 h-24 lg:w-36 lg:h-36 rounded-full instagram-gradient p-0.5">
                {userProfile?.profilePic ? (
                  <img
                    src={userProfile?.profilePic}
                    alt="profile_pic"
                    onClick={() => imgRef.current.click()}
                    className="w-full h-full cursor-pointer rounded-full object-cover bg-white p-0.5"
                  />
                ) : (
                  <img
                    src="/img/noavatar.jpg"
                    alt="profile"
                    onClick={() => imgRef.current.click()}
                    className="w-full h-full cursor-pointer rounded-full object-cover bg-white p-0.5"
                  />
                )}
              </div>
            </div>

            {/* User details */}
            <div className="flex flex-col gap-y-5 ">
              <div className="flex items-center gap-x-3">
                <span className="font-semibold">{userProfile?.username}</span>

                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/accounts/edit">
                      <Button
                        variant="secondary"
                        className="h-8 hover:bg-gray-200 font-semibold ml-3"
                      >
                        Edit profile
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="h-8 hover:bg-gray-200 font-semibold"
                    >
                      View archive
                    </Button>
                    <Button
                      variant="secondary"
                      className="h-8 hover:bg-gray-200  font-semibold"
                    >
                      Add tools
                    </Button>
                  </>
                ) : (
                  <>
                    {isFollowed ? (
                      <Button
                        onClick={handleFollowOrUnfollow}
                        variant="outline"
                        className="h-8"
                      >
                        Unfollow
                      </Button>
                    ) : followRequestSent ? (
                      <Button
                        variant="secondary"
                        className="h-8 font-semibold flex items-center gap-x-2"
                      >
                        Request Sent <ArrowRight size={14} />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleFollowOrUnfollow}
                        className="h-8 bg-[#0095f6] hover:bg-[#0094f6e8] font-semibold text-white"
                      >
                        Follow
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      onClick={handleMessageConversation}
                      className="h-8 hover:bg-gray-200 font-semibold"
                    >
                      Message
                    </Button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-x-16">
                <p className="font-semibold">
                  {userProfile?.posts?.length}{" "}
                  <span className="font-normal">Posts</span>
                </p>
                <p className="font-semibold">
                  {userProfile?.followers?.length}{" "}
                  <span className="font-normal">Followers</span>
                </p>
                <p className="font-semibold">
                  {userProfile?.following?.length}{" "}
                  <span className="font-normal">Following</span>
                </p>
              </div>

              <div>
                <p className="font-medium">{userProfile?.fullName}</p>
                <span>{userProfile?.bio || "Bio here..."}</span>
                <div className="flex flex-col gap-y-1">
                  {userProfile?.hobbies?.map((hobby, index) => (
                    <span className="text-gray-500 mr-1" key={index}>
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <StoryHighLights />
      </div>

      <div className="border-t w-full max-lg:max-w-3xl mx-auto  mb-10">
        {userProfile?.isPrivate &&
        userProfile?._id !== user?._id &&
        !userProfile?.followers?.find((u) => u._id === user?._id) ? (
          <div className="w-full flex justify-center mt-8">
            <div className="flex gap-x-8 items-center p-4">
              <span className="flex items-center justify-center w-12 h-12 border border-black rounded-full">
                <LockIcon></LockIcon>{" "}
              </span>
              <div className="flex flex-col ">
                <p className="text-sm font-semibold">This account is private</p>
                <p className="text-sm text-gray-500">
                  Follow to see their photos
                </p>
                {followRequestSent ? (
                  <Button
                    variant="secondary"
                    onClick={handleFollowOrUnfollow}
                    className="mt-4  font-semibold  h-8"
                  >
                    request sent
                  </Button>
                ) : (
                  <Button
                    onClick={handleFollowOrUnfollow}
                    className="bg-[#0095f6] mt-4 hover:bg-[#0094f6e8] font-semibold text-white h-8"
                  >
                    Follow
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex  justify-between lg:justify-center max-lg:px-4 text-sm  gap-x-3">
              <span
                onClick={() => handleTabChange("posts")}
                className={`flex items-center gap-x-1   px-2 lg:px-5 py-4 ${
                  actionTab === "posts" ? "border-t-2 border-black" : ""
                } cursor-pointer `}
              >
                <Grid size={17}></Grid> POSTS
              </span>

              {userProfile?._id === user?._id && (
                <span
                  onClick={() => handleTabChange("saved")}
                  className={`flex items-center gap-x-1  px-2 lg:px-5 py-4 ${
                    actionTab === "saved" ? "border-t-2 border-black" : ""
                  } cursor-pointer `}
                >
                  <Bookmark size={17}></Bookmark> SAVED
                </span>
              )}

              <span className="flex items-center gap-x-1 px-2 lg:px-5 py-4 cursor-pointer">
                <PlaySquareIcon size={17}></PlaySquareIcon>REELS
              </span>
              <span className="flex max-lg:hidden items-center gap-x-1 px-2 lg:px-5 py-4 cursor-pointer">
                <PersonStandingIcon size={17}></PersonStandingIcon>TAGGED
              </span>
            </div>

            {displyedPosts?.length > 0 ? (
              <div className="grid grid-cols-3  max-md:w-full gap-1 mt-5">
                {[...displyedPosts]?.reverse().map((post, index) => (
                  <ProfilePostCard
                    key={post?._id}
                    post={post}
                  ></ProfilePostCard>
                ))}
              </div>
            ) : (
              <div className="w-full  flex justify-center mt-11 ">
                <img
                  src="/img/nopost.jpg"
                  className="w-[150px] object-contain"
                  alt="empty_img"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
