import React from "react";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"; // Assuming you're using shadcn components

const Stories = () => {
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

  return (
    <div className="py-6 px-[5%] ">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-[600px]"
      >
        <CarouselContent>
          {stories.map((item, index) => (
            <CarouselItem
              key={index}
              className="md:basis-1/5 basis-1/5 lg:basis-1/6"
            >
              <div className="flex flex-col items-center">
                <div className="profile-border  instagram-gradient">
                  <img
                    src={item.img}
                    alt={`story-${index}`}
                    className="rounded-full w-full h-full bg-white p-0.5 object-cover"
                  />
                </div>
                <span className="text-xs text-center">{item.username}</span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-14 w-6 h-6 absolute top-9 -left-10" />
        <CarouselNext className="mr-[58px] w-6 h-6 absolute top-9 -right-10" />
      </Carousel>
    </div>
  );
};

export default Stories;
