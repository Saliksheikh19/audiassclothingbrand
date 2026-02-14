import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import ProductCarouselSection from '../components/home/ProductCarouselSection';
import { Heart, Minus, Plus, Star, Truck, ShieldCheck, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, addToCart, toggleWishlist, isInWishlist } = useShop();

    // State
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [mainImage, setMainImage] = useState('');
    const [isDescriptionOpen, setDescriptionOpen] = useState(true);
    const [isDeliveryOpen, setDeliveryOpen] = useState(false);

    // Fetch product details
    useEffect(() => {
        // Find product from context or fetch individually if not found
        // For now, relying on context products which are fetched on load
        if (products.length > 0) {
            const foundProduct = products.find(p => p._id === id || p.id === parseInt(id));
            if (foundProduct) {
                setProduct(foundProduct);
                setMainImage(foundProduct.image);
                // Set initial size if available
                if (foundProduct.sizes && foundProduct.sizes.length > 0) {
                    setSelectedSize(foundProduct.sizes[0]);
                }
            }
        }
    }, [id, products]);

    useEffect(() => {
        window.scrollTo(0, 0);
        setQuantity(1);
    }, [id]);

    if (!product) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    // Derived state
    const displayImages = product.images && product.images.length > 0
        ? product.images
        : [product.image];

    // Ensure we have at least 4 images for the grid look by repeating if necessary (just for visual if needed, but better to show what we have)
    // The design shows a grid. If we have multiple images, we show them.

    const inWishlist = isInWishlist(product._id || product.id);

    const handleQuantityChange = (delta) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    const handleAddToCart = () => {
        addToCart(product, quantity, selectedSize);
    };

    return (
        <div className="bg-white min-h-screen pt-[100px] pb-20">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* LEFT COLUMN: Image Grid (Total 7 cols) */}
                    <div className="lg:col-span-7">
                        <div className="grid grid-cols-2 gap-2">
                            {displayImages.map((img, index) => (
                                <div
                                    key={index}
                                    className={`relative bg-gray-100 cursor-pointer overflow-hidden group w-full ${
                                        // Make the first image span 2 columns if we have an odd number of images > 1, or just standard grid
                                        // Design reference shows a consistent grid. Let's stick to simple grid.
                                        "aspect-[3/4]"
                                        }`}
                                    onClick={() => setMainImage(img)}
                                >
                                    <img
                                        src={img}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Product Info (Total 5 cols) */}
                    <div className="lg:col-span-5 relative sticky top-[100px] h-fit pl-0 lg:pl-8">
                        {/* Title & Price */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-black uppercase tracking-tight mb-2 leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4">
                                <span className="text-xl font-bold">
                                    PKR {product.price.toLocaleString()}
                                </span>
                                {product.originalPrice && (
                                    <span className="text-lg text-gray-400 line-through">
                                        PKR {product.originalPrice.toLocaleString()}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Tax included.</p>
                        </div>

                        {/* Size Selection */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold uppercase tracking-wider">Size</span>
                                <div className="flex items-center gap-4">
                                    <span className={`text-xs font-bold ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.countInStock > 0 ? `In Stock: ${product.countInStock}` : 'Out of Stock'}
                                    </span>
                                    <button className="text-xs underline text-gray-500 hover:text-black">Size Guide</button>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL"]).map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        disabled={product.countInStock === 0}
                                        className={`w-14 h-10 flex items-center justify-center border text-sm font-medium transition-all
                                            ${product.countInStock === 0 ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400' : ''}
                                            ${selectedSize === size
                                                ? 'border-black bg-black text-white'
                                                : 'border-gray-200 text-gray-800 hover:border-black'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4 mb-10">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.countInStock === 0}
                                className={`w-full font-bold uppercase py-4 transition-colors flex items-center justify-center gap-2
                                    ${product.countInStock === 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-black text-white hover:bg-gray-900'}`}
                            >
                                {product.countInStock === 0 ? 'Out of Stock' : (
                                    <>Add to Cart <span className="w-1 h-1 bg-white rounded-full mx-1"></span> PKR {product.price.toLocaleString()}</>
                                )}
                            </button>

                            <div className="grid grid-cols-3 gap-2 text-xs text-center border-t border-gray-100 pt-4">
                                <div className="flex flex-col items-center gap-1 text-gray-500">
                                    <Truck size={16} />
                                    <span>Free Delivery</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 text-gray-500">
                                    <ShieldCheck size={16} />
                                    <span>Secure Payment</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 text-gray-500">
                                    <RefreshCw size={16} />
                                    <span>Easy Returns</span>
                                </div>
                            </div>
                        </div>

                        {/* Accordion Info */}
                        <div className="border-t border-gray-200">
                            {/* Description */}
                            <div className="border-b border-gray-200">
                                <button
                                    onClick={() => setDescriptionOpen(!isDescriptionOpen)}
                                    className="w-full py-4 flex items-center justify-between text-left group"
                                >
                                    <span className="font-bold uppercase text-xs tracking-wider">Product Description</span>
                                    {isDescriptionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                                {isDescriptionOpen && (
                                    <div className="pb-6 text-sm text-gray-600 leading-relaxed">
                                        <p>{product.description || "Designed for the modern individual, this piece combines premium materials with exceptional craftsmanship. A versatile addition to any wardrobe."}</p>
                                        {product.details && (
                                            <ul className="list-disc pl-4 mt-4 space-y-1">
                                                {product.details.map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Delivery & Returns */}
                            <div className="border-b border-gray-200">
                                <button
                                    onClick={() => setDeliveryOpen(!isDeliveryOpen)}
                                    className="w-full py-4 flex items-center justify-between text-left group"
                                >
                                    <span className="font-bold uppercase text-xs tracking-wider">Delivery & Returns</span>
                                    {isDeliveryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                                {isDeliveryOpen && (
                                    <div className="pb-6 text-sm text-gray-600 space-y-2">
                                        <p>Standard delivery: 3-5 working days.</p>
                                        <p>Free returns within 30 days of purchase.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                <div className="mt-24">
                    <ProductCarouselSection title="Detailed Recommendations" />
                </div>
            </Container>
        </div>
    );
};

export default ProductDetail;
