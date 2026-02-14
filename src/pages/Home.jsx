import React from 'react';
import Navbar from '../components/layout/Navbar'; // Re-exporting Navbar in Home causes duplication if we also use Layout in App. Refactoring. 
// Actually in App.jsx I moved Navbar/Footer to a Layout component.
// So Home.jsx should only contain the specific page content.

import HeroSlider from '../components/home/HeroSlider';
import CategoryGrid from '../components/home/CategoryGrid';
import ProductCarouselSection from '../components/home/ProductCarouselSection';
import BannerSection from '../components/home/BannerSection';

const Home = () => {
    return (
        <div className="bg-white">
            <HeroSlider />
            <CategoryGrid />
            <ProductCarouselSection title="New Arrivals" />
            <BannerSection
                title="URBAN LAYERS"
                subtitle="The Ultimate Winter Collection"
                image="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
            />
            <ProductCarouselSection title="Trending Now" />
            <BannerSection
                title="DENIM EDIT"
                subtitle="Find Your Perfect Fit"
                image="https://images.unsplash.com/photo-1542272617-08f08630329e?q=80&w=2070&auto=format&fit=crop"
            />
        </div>
    );
};

export default Home;
