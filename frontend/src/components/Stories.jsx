import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const stories = [
  {
    id: 1,
    img: "/img/henry.jpg",
    username: "henry_cavile",
  },
  {
    id: 2,
    img: "/img/khushal.jpg",
    username: "khushhalK",
  },
  {
    id: 3,
    img: "/img/john.jpg",
    username: "john_Abrahum",
  },
  {
    id: 4,
    img: "/img/sara.jpg",
    username: "SaraKhan",
  },
  {
    id: 5,
    img: "/img/ramsha.jpg",
    username: "ramsha",
  },
  {
    id: 6,
    img: "/img/murshad.jpg",
    username: "imranKhan",
  },
  {
    id: 7,
    img: "/img/henry.jpg",
    username: "henry_cavile",
  },
  {
    id: 8,
    img: "/img/khushal.jpg",
    username: "khushhalK",
  },
  {
    id: 9,
    img: "/img/john.jpg",
    username: "john_Abrahum",
  },
  {
    id: 10,
    img: "/img/sara.jpg",
    username: "SaraKhan",
  },
  {
    id: 11,
    img: "/img/ramsha.jpg",
    username: "ramsha",
  },
  {
    id: 12,
    img: "/img/murshad.jpg",
    username: "imranKhan",
  },
];
const Stories = () => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= 150;
    }
  };
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += 150;
    }
  };

  return (
    <div className="lg:px-[2%] lg:max-w-xl  max-w-[360px] px-2 lg:mt-6 relative">
      <div
        ref={scrollRef}
        className="flex gap-x-2 overflow-auto scrollbar-hide scroll-smooth"
      >
        {stories.map((item, index) => (
          <div className="flex flex-col items-center ">
            <div className="profile-border max-lg:w-14 max-lg:h-14  instagram-gradient">
              <img
                src={item.img}
                alt={`story-${index}`}
                className="rounded-full w-full h-full bg-white p-0.5 object-cover"
              />
            </div>
            <span className="text-xs text-center">{item.username}</span>
          </div>
        ))}
      </div>
      <span
        onClick={scrollLeft}
        className="lg:w-6 lg:h-6 w-5 h-5 rounded-full flex items-center justify-center bg-white absolute top-1/3 -translate-y-1/3 cursor-pointer"
      >
        <ChevronLeft className="max-lg:w-4 max-lg:h-4"></ChevronLeft>
      </span>
      <span
        onClick={scrollRight}
        className="h-5 w-5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center bg-white absolute top-1/3 -translate-y-1/3 right-1 lg:right-5 cursor-pointer"
      >
        <ChevronRight className="max-lg:w-4 max-lg:h-4"></ChevronRight>
      </span>
    </div>
  );
};

export default Stories;
