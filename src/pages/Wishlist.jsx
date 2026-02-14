import React from 'react';
import { useShop } from '../context/ShopContext';
import Container from '../components/ui/Container';
import ProductCard from '../components/ui/ProductCard';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const { wishlist } = useShop();

    if (wishlist.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50">
                <h2 className="text-2xl font-bold mb-4 uppercase tracking-widest">Your Wishlist is Empty</h2>
                <p className="text-gray-500 mb-8">Save items you love to revisit later.</p>
                <Link to="/">
                    <Button>Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 bg-white min-h-screen">
            <Container>
                <h1 className="text-3xl font-bold uppercase tracking-widest mb-10 text-center">My Wishlist</h1>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlist.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </Container>
        </div>
    );
};

export default Wishlist;
