import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const slides = [
    {
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
        title: "WINTER '25",
        subtitle: "UNAPOLOGETICALLY BOLD",
        buttonText: "SHOP COLLECTION"
    },
    {
        image: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=1974&auto=format&fit=crop",
        title: "URBAN LEGENDS",
        subtitle: "STREETWEAR EVOLVED",
        buttonText: "EXPLORE DENIM"
    },
    {
        image: "https://images.unsplash.com/photo-1549488347-1941d4f40f29?q=80&w=2670&auto=format&fit=crop",
        title: "FOOTWEAR",
        subtitle: "STEP UP YOUR GAME",
        buttonText: "SHOP NOW"
    }
];

const HeroSlider = () => {
    return (
        <section className="relative h-screen w-full overflow-hidden">
            <Swiper
                modules={[Autoplay, EffectFade, Pagination]}
                effect="fade"
                speed={1500}
                loop={true}
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                pagination={{
                    clickable: true,
                    bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !opacity-100',
                    bulletClass: 'swiper-pagination-bullet !bg-white/50 !opacity-50 !w-2 !h-2 !mx-1 transition-all duration-300'
                }}
                className="h-full w-full"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        {({ isActive }) => (
                            <div className="relative h-full w-full">
                                {/* Dark Overlay */}
                                <div className="absolute inset-0 bg-black/20 z-10" />

                                {/* Background Image with Zoom Effect */}
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className={`h-full w-full object-cover transform transition-transform duration-[8000ms] ease-out ${isActive ? 'scale-110' : 'scale-100'}`}
                                />

                                {/* Content */}
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white p-4">
                                    <span className={`text-sm md:text-lg font-bold tracking-[0.3em] mb-4 uppercase transition-all duration-1000 delay-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                                        {slide.subtitle}
                                    </span>
                                    <h2 className={`text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter mb-8 uppercase transition-all duration-1000 delay-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                                        {slide.title}
                                    </h2>
                                    <button className={`px-10 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-1000 delay-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                                        {slide.buttonText}
                                    </button>
                                </div>
                            </div>
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Styles overrides for Swiper Pagination */}
            <style>{`
        .swiper-pagination {
          bottom: 40px !important;
        }
      `}</style>
        </section>
    );
};

export default HeroSlider;
