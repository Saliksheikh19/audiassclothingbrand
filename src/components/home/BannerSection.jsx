import React from 'react';

const BannerSection = ({
    image = "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop",
    title = "THE WINTER EDIT",
    subtitle = "Layer up in style this season"
}) => {
    return (
        <section className="relative h-[600px] w-full overflow-hidden my-12">
            <div className="absolute inset-0 bg-black/10 transition-colors hover:bg-black/20" />
            <img src={image} alt={title} className="h-full w-full object-cover attachment-fixed" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
                <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-[0.2em] mb-6 drop-shadow-md">{title}</h2>
                <p className="text-lg md:text-2xl tracking-[0.15em] mb-10 font-light">{subtitle}</p>
                <button className="px-12 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105">
                    Check It Out
                </button>
            </div>
        </section>
    );
};

export default BannerSection;
