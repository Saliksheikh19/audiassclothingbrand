import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useShop } from '../context/ShopContext';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const { cart, cartTotal, clearCart, user } = useShop();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: user ? user.name : '',
        email: user ? user.email : '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Pakistan',
    });

    const [loading, setLoading] = useState(false);

    // Redirect if cart is empty
    if (cart.length === 0) {
        navigate('/cart');
        return null; // Don't render anything while redirecting
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const placeOrder = async (e) => {
        e.preventDefault();
        setLoading(true);

        const orderData = {
            orderItems: cart.map(item => ({
                name: item.name,
                qty: item.quantity,
                image: item.image,
                price: item.price,
                product: item.id || item._id, // Ensure we send the correct ID field
            })),
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            shippingAddress: {
                address: formData.address,
                city: formData.city,
                postalCode: formData.postalCode,
                country: formData.country,
            },
            paymentMethod: 'Cash on Delivery',
            itemsPrice: cartTotal,
            taxPrice: 0,
            shippingPrice: 0, // Free shipping for now logic
            totalPrice: cartTotal,
        };

        try {
            // For guest checkout (or authenticated), we need to handle user ID differently.
            // If we don't have a logged-in user in ShopContext yet, we might hit an issue with backend expecting req.user
            // However, based on the userController/orderController, protect middleware is used.
            // We need to implement guest checkout or basic user auth in ShopContext if not present.
            // Assuming for now we might need to login.
            // Let's check backend orderController.js -> addOrderItems uses req.user._id
            // If we are strictly "guest", we need a way.
            // But for now, let's assume we need to be logged in OR we adjust backend to allow guest.
            // Let's try to send it. If it fails due to auth, we'll know.
            // Actually, for a quick "Cash on Delivery" system without forced login, we should probably default to a specific "Guest" user ID on backend or modify backend.
            // BUT, modifying backend is better.

            // Wait... user wants "complete ordering system".
            // Let's first try sending it. We need a token.
            // If we don't have a token, we can't create an order with current backend logic (req.user._id).

            // Temporary fix for Guest Checkout flow without full auth rebuild: 
            // We can login as a 'guest' user behind the scenes or ask user to login.
            // Or simplest: Authenticate as a default guest user if no token found?
            // Actually, let's login user as guest first? No, that's complex.

            // Let's see if we can create a guest order endpoint? 
            // Better yet, let's just make the user log in or register simply? 
            // Or, let's make the orderController NOT require auth for this specific route if we want true guest checkout.

            // Let's assume there is a token for now or we will handle the 401.
            // Actually, looking at previous steps... there isn't a customer login flow yet, only admin.
            // So we MUST allow guest orders.

            const headers = {
                'Content-Type': 'application/json',
            };

            if (user && user.token) {
                headers['Authorization'] = `Bearer ${user.token}`;
            }

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(orderData)
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Order placed successfully!");
                clearCart();
                navigate('/order-success', { state: { orderId: data._id } });
            } else {
                alert(`Error: ${data.message || 'Something went wrong'}`);
                // If error is "Not authorized, no token", we need to fix backend.
            }
        } catch (error) {
            console.error(error);
            alert('Error placing order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
            <Container>
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Form */}
                    <div className="bg-white p-8 shadow-sm">
                        <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b pb-4">Shipping Details</h2>
                        <form onSubmit={placeOrder} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="text-sm text-gray-600 block mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-black"
                                        onChange={handleChange}
                                        value={formData.name}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600 block mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-black"
                                        onChange={handleChange}
                                        value={formData.email}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600 block mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-black"
                                        onChange={handleChange}
                                        value={formData.phone}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600 block mb-1">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        required
                                        className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-black"
                                        onChange={handleChange}
                                        value={formData.address}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-600 block mb-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            required
                                            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-black"
                                            onChange={handleChange}
                                            value={formData.city}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600 block mb-1">Postal Code</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            required
                                            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-black"
                                            onChange={handleChange}
                                            value={formData.postalCode}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Summary */}
                    <div className="bg-white p-8 shadow-sm h-fit sticky top-32">
                        <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b pb-4">Your Order</h2>
                        <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                            {cart.map((item) => (
                                <div key={`${item.id}-${item.size}`} className="flex gap-4 text-sm">
                                    <div className="w-16 h-20 bg-gray-100 flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold">{item.name}</p>
                                        <p className="text-gray-500">Size: {item.size} | Qty: {item.quantity}</p>
                                        <p className="font-semibold mt-1">PKR {(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-2 mb-6 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>PKR {cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                                <span>Total</span>
                                <span>PKR {cartTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="mb-6 p-4 bg-gray-50 border border-gray-200">
                            <p className="font-bold text-sm mb-1">Payment Method</p>
                            <p className="text-sm text-gray-600">Cash on Delivery (COD)</p>
                        </div>

                        <Button
                            className="w-full"
                            onClick={placeOrder}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                        </Button>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Checkout;
