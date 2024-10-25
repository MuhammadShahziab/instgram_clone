import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button"; // Assuming you're using a custom Button component
import { ArrowLeft, ArrowRight } from "lucide-react";

const StoryViewer = ({ stories, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef();

  // Move to the next story after 5 seconds
  useEffect(() => {
    if (isOpen) {
      timerRef.current = setInterval(() => {
        setProgress((prev) => prev + 20); // increment the progress every second (20 = 100/5)
      }, 1000);

      return () => {
        clearInterval(timerRef.current);
      };
    }
  }, [isOpen]);

  // Reset progress and switch to the next image when progress completes
  useEffect(() => {
    if (progress >= 100) {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setProgress(0);
      } else {
        onClose(); // Close the viewer after the last story
      }
    }
  }, [progress, currentIndex, stories, onClose]);

  const handleNextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setProgress(0);
    }
  };

  if (!isOpen) return null; // Return nothing if not open

  return (
    <div className="fixed inset-0 bg-[#1A1A1A] z-50 flex items-center justify-center">
      <Button
        onClick={onClose}
        variant="outline"
        className="absolute top-8 right-4 z-50"
      >
        Close
      </Button>
      <div className="relative w-full h-full max-w-screen-md max-h-screen-md">
        {/* Display current image, centered */}
        <img
          src={stories[currentIndex]}
          alt="story"
          className="w-full h-full object-contain"
        />
        {/* Progress bar container */}
        <div className="absolute top-0 left-0 right-0 flex space-x-1 p-4">
          {stories.map((_, index) => (
            <div key={index} className="h-1 flex-1 bg-gray-600">
              <div
                className="h-1 bg-white"
                style={{
                  width:
                    index < currentIndex
                      ? "100%" // Completed stories have 100% progress
                      : index === currentIndex
                      ? `${progress}%` // Active story progress
                      : "0%", // Future stories have 0% progress
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Left and right click for manual navigation */}
        <div className="absolute inset-0 flex justify-between items-center">
          <div
            onClick={handlePrevStory}
            className="w-16 h-16 rounded-full cursor-pointer flex justify-center items-center bg-white/80"
          >
            <ArrowLeft />
          </div>
          <div
            onClick={handleNextStory}
            className="w-16 h-16 rounded-full cursor-pointer flex justify-center items-center bg-white/80"
          >
            <ArrowRight />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
