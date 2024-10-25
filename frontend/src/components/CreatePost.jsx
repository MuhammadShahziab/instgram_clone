import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import upload from "@/utils/upload";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { MoveLeft } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { FadeLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";
import { setUserProfile } from "@/redux/authSlice";

const CreatePost = ({ open, setOpen }) => {
  const imgRef = useRef();
  const [step, setStep] = useState(1);
  const [selectedImages, setSelectedImages] = useState([]);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false); // Loader state

  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.post);
  const { userProfile } = useSelector((state) => state.auth);
  const handleImageSelect = async (e) => {
    const files = e.target.files; // Get selected files
    const newImageUrls = []; // Array to hold the new image URLs

    // Upload each selected file
    for (const file of files) {
      try {
        setLoading(true); // Show loader
        const url = await upload(file); // Upload file and get URL
        newImageUrls.push(url); // Add URL to array
        setStep(2); // Move to step 2 after successful upload
      } catch (error) {
        console.log(error); // Handle upload error
      } finally {
        setLoading(false); // Hide loader after upload
      }
    }

    // Update state with newly uploaded image URLs
    setSelectedImages((prevImages) => [...prevImages, ...newImageUrls]);
  };

  const handleBackStep = () => {
    if (step === 2) {
      setStep(1);
      setSelectedImages([]);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3); // Move to step 3 to show image and caption
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/post/create",
        {
          caption,
          images: selectedImages,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res, "check res");

      if (res?.data?.success) {
        setOpen(false);
        toast.success(res?.data?.message);
        dispatch(setPosts([res?.data?.post, ...posts]));

        const updateUserProfile = {
          ...userProfile,
          posts: [res?.data?.post, ...userProfile?.posts],
        };
        dispatch(setUserProfile(updateUserProfile));
        setSelectedImages([]);
        setCaption("");
        setStep(1);
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog className="" open={open} setOpen={setOpen}>
      <DialogContent
        className="px-0 py-0"
        style={{
          minHeight: "400px",
          maxHeight: "400px",
          minWidth: step === 3 ? "800px" : "400px", // Extend width on step 3
          transition: "min-width 0.3s ease",
        }}
        onInteractOutside={() => setOpen(false)}
      >
        <DialogHeader>
          <DialogTitle
            className={`flex items-center ${
              step === 1 ? "justify-center" : "justify-between"
            } px-4 border-b-[0.5px]`}
          >
            {selectedImages.length > 0 && (
              <MoveLeft
                onClick={handleBackStep}
                size={22}
                className="cursor-pointer"
              ></MoveLeft>
            )}

            <h1 className="text-center font-medium py-3 pb-4 border-gray-300">
              Create new post
            </h1>
            {selectedImages.length > 0 && step > 2 && (
              <span
                onClick={handleSubmit}
                className="text-[16px] text-[#0095f6] cursor-pointer"
              >
                Share{" "}
              </span>
            )}
            {selectedImages.length > 0 && step < 3 && (
              <span
                onClick={handleNextStep}
                className="text-[16px] text-[#0095f6] cursor-pointer"
              >
                Next{" "}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Show loader if uploading */}
        {loading ? (
          <div className="flex justify-center items-center h-[calc(413px-4rem)]">
            <FadeLoader color="#DBDBDB" size={20} />
          </div>
        ) : step === 1 && selectedImages.length === 0 ? (
          <div className="flex flex-col gap-y-5 items-center relative -top-10">
            <img src="/img/createpost.jpg" alt="create-post" className="w-44" />
            <p className="absolute top-[140px] left-1/2 -translate-x-1/2 ">
              Drag photos and videos here
            </p>
            <input
              onChange={handleImageSelect}
              ref={imgRef}
              className="hidden"
              type="file"
              multiple // Allow multiple file selection
            />
            <Button
              onClick={() => imgRef.current.click()}
              className="bg-[#0095f6] outline-none hover:bg-[#2992d8]"
            >
              Select from computer
            </Button>
          </div>
        ) : step === 2 &&
          selectedImages.length > 0 &&
          selectedImages.length === 1 ? (
          <div className="relative -top-3.5 w-full h-[calc(413px-4rem)]">
            <img
              src={selectedImages[0]}
              alt="Selected Image"
              className="w-full h-full rounded-b-lg object-cover"
            />
          </div>
        ) : step === 3 ? (
          <div className="flex w-full h-full">
            <div className="w-1/2 relative -top-3.5 h-[calc(410px-4rem)]">
              {selectedImages.length === 1 ? (
                <img
                  src={selectedImages[0]}
                  alt="Selected Image"
                  className="w-full h-full object-cover rounded-b-lg"
                />
              ) : (
                <Carousel opts={{ align: "start" }} className="w-full p-0 m-0">
                  <CarouselContent className="p-0 m-0">
                    {selectedImages.map((image, index) => (
                      <CarouselItem key={index} className="p-0 m-0">
                        <div className="w-full h-[calc(413px-4rem)]">
                          <img
                            src={image}
                            alt="Selected Image"
                            className="w-full h-full object-cover rounded-b-lg"
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

            <div className="w-1/2 p-4 relative -top-3.5">
              <textarea
                className="w-full h-full border outline-none border-gray-300 rounded-lg p-2"
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <Carousel
            opts={{ align: "start" }}
            className="w-full relative -top-3.5 p-0 m-0 max-w-[600px]"
          >
            <CarouselContent className="p-0 m-0">
              {selectedImages.map((image, index) => (
                <CarouselItem key={index} className="p-0 m-0">
                  <div className="w-full h-[calc(413px-4rem)]">
                    <img
                      src={image}
                      alt="Selected Image"
                      className="w-full h-full rounded-b-lg object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext className="absolute right-3"></CarouselNext>
            <CarouselPrevious className="absolute left-3"></CarouselPrevious>
          </Carousel>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
``;
