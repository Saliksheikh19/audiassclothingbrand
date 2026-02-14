import React from 'react';
import { ShoppingBag, Eye, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';

const ProductCard = ({ product }) => {
    const { addToCart, toggleWishlist, isInWishlist } = useShop();
    const inWishlist = isInWishlist(product._id || product.id);

    return (
        <div className="group cursor-pointer relative">
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                {/* Wishlist Button - Top Right */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product);
                    }}
                    className="absolute top-2 right-2 z-20 p-2 rounded-full bg-white/80 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                >
                    <Heart size={16} className={inWishlist ? "fill-red-500 text-red-500" : "text-black"} />
                </button>

                {/* Main Image */}
                <Link to={`/product/${product._id || product.id}`}>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0"
                    />
                    {/* Hover Image */}
                    <img
                        src={product.hoverImage || product.image}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
                    />
                </Link>

                {/* Actions Overlay */}
                {product.countInStock > 0 ? (
                    <div className="absolute inset-x-4 bottom-4 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                addToCart(product);
                            }}
                            className="flex-1 bg-white text-black py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                        >
                            Add to Cart
                        </button>
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                        <span className="bg-black text-white text-xs font-bold uppercase px-4 py-2 tracking-widest">
                            Sold Out
                        </span>
                    </div>
                )}

                {/* Badge */}
                {product.discount && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-1 tracking-wider">
                        -{product.discount}%
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <h3 className="text-xs font-semibold uppercase tracking-wide truncate group-hover:text-gray-600 transition-colors">
                    {product.name}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">PKR {product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">PKR {product.originalPrice.toLocaleString()}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
