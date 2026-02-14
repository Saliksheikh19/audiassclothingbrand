import React from 'react';
import Container from '../ui/Container';
import { Link } from 'react-router-dom';

const categories = [
    {
        id: 1,
        name: "MEN",
        image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80",
        colSpan: "md:col-span-1",
        aspect: "aspect-[3/4]"
    },
    {
        id: 2,
        name: "WOMEN",
        image: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800&q=80",
        colSpan: "md:col-span-1",
        aspect: "aspect-[3/4]"
    },
    {
        id: 3,
        name: "JUNIORS",
        image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80",
        colSpan: "md:col-span-1",
        aspect: "aspect-[3/4]"
    },
    {
        id: 4,
        name: "ACCESSORIES",
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
        colSpan: "md:col-span-1",
        aspect: "aspect-[3/4]" // Changed to consistent sizing for a cleaner grid
    },
];

const CategoryGrid = () => {
    return (
        <section className="py-20">
            <Container>
                <div className="flex flex-col items-center mb-12">
                    <h2 className="text-3xl font-bold tracking-widest uppercase mb-2">Categories In Focus</h2>
                    <div className="w-20 h-1 bg-black"></div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {categories.map((cat) => (
                        <Link
                            to={`/collections/${cat.name.toLowerCase()}`}
                            key={cat.id}
                            className={`group relative overflow-hidden cursor-pointer ${cat.colSpan} ${cat.aspect}`}
                        >
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                            <div className="absolute bottom-6 left-6">
                                <h3 className="text-white text-2xl font-bold uppercase tracking-widest drop-shadow-lg">{cat.name}</h3>
                                <span className="inline-block mt-2 text-white border-b-2 border-white text-xs font-bold tracking-wider opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                                    SHOP NOW
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default CategoryGrid;
