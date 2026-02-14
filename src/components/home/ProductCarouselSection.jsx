import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation as SwiperNavigation } from 'swiper/modules'; // Renamed to avoid alias conflict if any, though likely safe
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCard from '../ui/ProductCard';
import Container from '../ui/Container';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useShop } from '../../context/ShopContext';

const ProductCarouselSection = ({ title = "New Arrivals" }) => {
    const { products } = useShop();

    return (
        <section className="py-20 bg-white">
            <Container>
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-bold tracking-widest uppercase">{title}</h2>
                    <div className="flex gap-2">
                        <button className="swiper-prev-custom p-2 border border-black hover:bg-black hover:text-white transition-colors">
                            <ChevronLeft size={24} />
                        </button>
                        <button className="swiper-next-custom p-2 border border-black hover:bg-black hover:text-white transition-colors">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                <Swiper
                    modules={[SwiperNavigation]}
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation={{
                        prevEl: '.swiper-prev-custom',
                        nextEl: '.swiper-next-custom'
                    }}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                    }}
                    className="w-full"
                >
                    {products.map((product) => (
                        <SwiperSlide key={product.id || product._id}>
                            <ProductCard product={product} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Container>
        </section>
    );
};

export default ProductCarouselSection;
