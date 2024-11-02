import { Plus } from "lucide-react";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import upload from "@/utils/upload";
import axios from "axios";
import { setUserProfile } from "@/redux/authSlice";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import StoryViewer from "./StoryViewer";

const StoryHighLights = () => {
  const { userProfile, user } = useSelector((state) => state.auth);
  const [title, setTitle] = useState("");
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // For new highlight dialog
  const [storyViewDialogeOpen, setStoryViewDialogeOpen] = useState(false); // For story viewer dialog
  const [selectedStories, setSelectedStories] = useState([]);

  const imgRef = useRef();

  const dispatch = useDispatch();

  const handleImages = async (e) => {
    const files = e.target.files;
    const newImageUrls = [];
    for (const file of files) {
      try {
        setLoading(true);
        const url = await upload(file);
        newImageUrls.push(url);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    setStories((prevImages) => [...prevImages, ...newImageUrls]);
  };

  const handleStoryClick = (stories) => {
    setSelectedStories(stories);
    setStoryViewDialogeOpen(true); // Open the story viewer dialog
  };

  const handleSubmit = async () => {
    try {
      setUploadLoading(true);
      const res = await axios.post(
        "https://instgram-clone-3yhc.onrender.com/api/post/storyhighlight",
        {
          title,
          stories,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        const updateUserProfile = {
          ...userProfile,
          storyHighlights: res.data.storyHighlights,
        };
        setStories([]);
        setTitle("");
        dispatch(setUserProfile(updateUserProfile)); // Corrected dispatch
        setDialogOpen(false); // Close the dialog after success
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="flex items-center  gap-y-4 flex-nowrap overflow-x-scroll scrollbar-hide gap-x-4 lg:gap-x-12 px-5 md:pl-12">
      {userProfile?.storyHighlights.length > 0 &&
        userProfile?.storyHighlights.map((story, index) => (
          <div key={index} className="flex flex-col gap-y-2 items-center">
            <div
              onClick={() => handleStoryClick(story.stories)}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-gray-300 p-0.5"
            >
              {story.stories?.[0] ? (
                <img
                  src={story.stories[0]}
                  alt="profile_pic"
                  className="w-full h-full cursor-pointer rounded-full object-cover bg-white p-0.5"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200"></div>
              )}
            </div>
            <span className="text-sm font-medium">{story.title}</span>
          </div>
        ))}

      {user?._id === userProfile?._id && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <div className="flex flex-col gap-y-2 items-center">
              <div className="w-20 h-20 lg:w-24 lg:h-24 cursor-pointer rounded-full border border-gray-300 p-1">
                <div className="rounded-full bg-gray-100 flex justify-center items-center w-full h-full">
                  <Plus size={30} className="text-gray-700"></Plus>
                </div>
              </div>
              <span className="text-sm font-medium">New</span>
            </div>
          </DialogTrigger>
          <DialogContent className="py-3">
            <DialogHeader>
              <DialogTitle className="text-center border-b pb-3">
                New Highlight
              </DialogTitle>
              <DialogDescription className="py-5 flex flex-col gap-y-3">
                <Input
                  placeholder="Highlight Name"
                  name="title"
                  value={title}
                  className="w-full focus-visible:ring-transparent bg-gray-100 h-11"
                  onChange={(e) => setTitle(e.target.value)}
                ></Input>

                <input
                  ref={imgRef}
                  type="file"
                  className="hidden"
                  name="stories"
                  onChange={handleImages}
                  multiple
                />

                <div className="flex items-center gap-4 flex-wrap py-3">
                  <div
                    onClick={() => imgRef.current.click()}
                    className="flex justify-center cursor-pointer hover:bg-gray-100 items-center border rounded-xl w-24 h-24"
                  >
                    <p className="font-semibold"> Upload</p>
                  </div>
                  {loading ? (
                    <div className=" bg-gray-100 items-center border rounded-xl w-24 h-24 animate-pulse"></div>
                  ) : (
                    stories?.map((story, index) => (
                      <div
                        key={index}
                        className="flex justify-center cursor-pointer hover:bg-gray-100 items-center border rounded-xl w-24 h-24"
                      >
                        <img
                          src={story}
                          alt="profile_pic"
                          className="w-full h-full cursor-pointer rounded-xl object-cover bg-white p-0.5"
                        />
                      </div>
                    ))
                  )}
                </div>
                <div className="w-full flex justify-end">
                  <Button
                    onClick={handleSubmit}
                    className="text-blue-400 hover:text-blue-500 flex items-center gap-x-2 justify-end"
                    variant="outline"
                    disabled={
                      title.trim() === "" || loading || stories.length === 0
                    }
                  >
                    Done{" "}
                    {uploadLoading && (
                      <ClipLoader className="text-[#1876f2]" size={20} />
                    )}
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
      {/* Story Viewer */}
      {storyViewDialogeOpen && (
        <StoryViewer
          stories={selectedStories}
          isOpen={storyViewDialogeOpen} // Use correct dialog state
          onClose={() => setStoryViewDialogeOpen(false)} // Close the story viewer
        />
      )}
    </div>
  );
};

export default StoryHighLights;
