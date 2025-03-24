'use client';

import Image from 'next/image';
import Link from 'next/link';
import 'swiper/css/bundle';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const HeroSlider = ({ heroes }) => {
  if (!heroes?.length) {
    return (
      <div className="w-full h-[220px] lg:h-[370px] bg-gray-200 animate-pulse mb-10"></div>
    );
  }

  return (
    <div
      id="hero"
      className="hero"
    >
      <div className="hero-area">
        <div className="hero-slider-container">
          <Swiper
            spaceBetween={0}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            effect={'fade'}
            pagination={{
              clickable: true,
            }}
            modules={[EffectFade, Navigation, Pagination, Autoplay]}
            className="mySwiper"
          >
            {heroes.map((hero, index) => (
              <SwiperSlide key={hero._id}>
                <Link
                  href={hero.link}
                  aria-label={`View details for ${hero.title}`}
                >
                  <div className="relative w-full h-[100px] md:h-[220px] lg:h-[600px]">
                    <Image
                      src={hero.image}
                      alt={hero.title}
                      width={1920}
                      height={700}
                      className="w-full h-full"
                      priority={index === 0}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      quality={100}
                    />
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
