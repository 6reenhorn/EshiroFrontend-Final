import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";

const HeroSection: React.FC = () => {
  return (
    <div className="relative w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000 }} // Adjust autoplay delay as needed
        pagination={{ clickable: true }}
        className="absolute top-0 left-0 w-full h-[70vh] -z-10"
      >
        {/* Slide 1: Video */}
        <SwiperSlide>
          <video
            className="w-full h-full object-cover"
            src="https://res.cloudinary.com/dbzoophuc/video/upload/v1740298739/jlwfz1sbsdxjhaarjpzh.mp4"
            autoPlay
            loop
            muted
          ></video>
        </SwiperSlide>

        {/* Slide 2: Video */}
        <SwiperSlide>
          <video
            className="w-full h-full object-cover"
            src="https://res.cloudinary.com/dbzoophuc/video/upload/v1740299380/s4tx7squhst0eblkcmt4.mp4"
            autoPlay
            loop
            muted
          ></video>
        </SwiperSlide>

        {/* Slide 3: Video */}
        <SwiperSlide>
          <video
            className="w-full h-full object-cover"
            src="https://res.cloudinary.com/dbzoophuc/video/upload/v1740299539/js0qtzrh8lovdgnyd9df.mp4"
            autoPlay
            loop
            muted
          ></video>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default HeroSection;