import React from 'react';
import { useShop } from '../context/ShopContext';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useShop();

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50">
                <h2 className="text-2xl font-bold mb-4 uppercase tracking-widest">Your Bag is Empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything to your bag yet.</p>
                <Link to="/">
                    <Button>Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
            <Container>
                <h1 className="text-3xl font-bold uppercase tracking-widest mb-10 text-center">Shopping Bag</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {cart.map((item) => (
                            <div key={`${item.id}-${item.size}`} className="bg-white p-6 flex gap-6 shadow-sm">
                                <div className="w-24 h-32 flex-shrink-0 bg-gray-100 overflow-hidden">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold uppercase tracking-wide mb-1">{item.name}</h3>
                                            <p className="text-sm text-gray-500 mb-1">{item.category}</p>
                                            <p className="text-sm text-gray-500">Size: <span className="text-black font-semibold">{item.size}</span></p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id, item.size)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center border border-gray-200">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.size, -1)}
                                                className="p-2 hover:bg-gray-100 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.size, 1)}
                                                className="p-2 hover:bg-gray-100 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <p className="font-bold">PKR {(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 shadow-sm sticky top-32">
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 border-b pb-4">Order Summary</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold">PKR {cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping Estimate</span>
                                    <span className="text-gray-500">Calculated at checkout</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-lg font-bold border-t pt-4 mb-8">
                                <span>Total</span>
                                <span>PKR {cartTotal.toLocaleString()}</span>
                            </div>

                            <Link to="/checkout">
                                <Button className="w-full justify-between group">
                                    Checkout
                                    <ArrowRight size={18} className="transform transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>

                            <div className="mt-6 text-xs text-gray-500 text-center">
                                Secure Checkout - SSL Encrypted
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Cart;
