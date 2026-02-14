import React from 'react';
import { useParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ui/ProductCard';
import Container from '../components/ui/Container';

const Category = () => {
    const { category } = useParams();
    const { products } = useShop();

    // Format category name for display (e.g., 'new-in' -> 'New In')
    const categoryTitle = category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const filteredProducts = products.filter(product => {
        const cat = category.toLowerCase();

        if (cat === 'new-in' || cat === 'apparel') return true;
        if (cat === 'sale') return product.discount;

        // Check if the product category string contains the requested category
        // e.g. "Men / T-Shirts" contains "men"
        if (!product.category) return false;
        return product.category.toLowerCase().includes(cat);
    });

    return (
        <div className="pt-24 pb-20 min-h-screen bg-gray-50">
            <Container>
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold tracking-widest uppercase mb-4">
                        {categoryTitle}
                    </h1>
                    <div className="h-1 w-20 bg-black mx-auto"></div>
                    <p className="mt-4 text-gray-500">
                        {filteredProducts.length} Products Found
                    </p>
                </div>

                {/* Product Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500 mb-4">No products found in this category.</p>
                        <button
                            onClick={() => window.history.back()}
                            className="bg-black text-white px-8 py-3 uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default Category;
