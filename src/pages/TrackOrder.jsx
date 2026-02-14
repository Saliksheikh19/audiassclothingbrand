import React, { useState } from 'react';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { Search, Package, MapPin, Calendar, AlertCircle, CheckCircle, Truck, Clock } from 'lucide-react';

const TrackOrder = () => {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setOrder(null);

        try {
            const res = await fetch('/api/orders/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId, email }),
            });

            const data = await res.json();

            if (res.ok) {
                setOrder(data);
            } else {
                setError(data.message || 'Order not found or details mismatch');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStep = (status) => {
        const steps = ['Pending', 'Confirmed', 'Delivered'];
        const index = steps.indexOf(status);
        // If status is Cancelled, handle separately or just show basic
        if (status === 'Cancelled') return -1;
        return index !== -1 ? index : 0;
    };

    const currentStep = order ? getStatusStep(order.status) : 0;
    const isCancelled = order?.status === 'Cancelled';

    return (
        <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
            <Container>
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold uppercase tracking-widest mb-4">Track Your Order</h1>
                        <p className="text-gray-600">Enter your Order ID and Email to see the current status of your shipment.</p>
                    </div>

                    <div className="bg-white p-8 shadow-md rounded-xl mb-8">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-2">Order ID</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="e.g. 64f1b2c..."
                                        className="w-full border border-gray-300 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                                        value={orderId}
                                        onChange={(e) => setOrderId(e.target.value)}
                                        required
                                    />
                                    <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-2">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="Enter the email used for checkout"
                                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <Button className="w-full py-3 rounded-lg mt-4" disabled={loading}>
                                {loading ? 'Tracking...' : 'Track Order'}
                            </Button>
                        </form>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3 mb-8 animate-fade-in">
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    {order && (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in-up">
                            {/* Header */}
                            <div className="bg-gray-900 text-white p-6 flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-bold">Order #{order._id.substring(0, 8)}...</h2>
                                    <p className="text-gray-400 text-sm">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${isCancelled ? 'bg-red-500 text-white' :
                                    order.isDelivered ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                                    }`}>
                                    {order.status}
                                </div>
                            </div>

                            <div className="p-8">
                                {/* Progress Bar */}
                                {!isCancelled && (
                                    <div className="mb-10 relative">
                                        <div className="h-2 bg-gray-200 rounded-full mb-8">
                                            <div
                                                className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${(currentStep / 3) * 100}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between relative">
                                            {['Pending', 'Confirmed', 'Delivered'].map((step, index) => (
                                                <div key={step} className="flex flex-col items-center relative z-10">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors duration-500 ${index <= currentStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                                                        }`}>
                                                        {index <= currentStep ? <CheckCircle size={16} /> : <div className="w-3 h-3 bg-current rounded-full" />}
                                                    </div>
                                                    <span className={`text-xs font-bold uppercase ${index <= currentStep ? 'text-green-600' : 'text-gray-400'
                                                        }`}>{step}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {isCancelled && (
                                    <div className="text-center py-8 mb-8 bg-red-50 rounded-xl">
                                        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                                        <h3 className="text-xl font-bold text-gray-800">Order Cancelled</h3>
                                        <p className="text-gray-500">This order has been cancelled.</p>
                                    </div>
                                )}

                                {/* Order Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-8">
                                    {/* Items */}
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <Package size={16} /> Items
                                        </h3>
                                        <div className="space-y-4">
                                            {order.orderItems.map((item, index) => (
                                                <div key={index} className="flex gap-4">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                                                        <p className="text-gray-500 text-xs">Qty: {item.qty} × PKR {item.price.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                            <span className="font-bold">Total</span>
                                            <span className="font-bold text-lg">PKR {(order.totalPrice || 0).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Shipping */}
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <MapPin size={16} /> Delivery Details
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded-xl space-y-3 text-sm">
                                            <div>
                                                <label className="text-xs text-gray-500 block mb-1">Shipping Address</label>
                                                <p className="font-medium text-gray-800">
                                                    {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 block mb-1">Contact</label>
                                                <p className="font-medium text-gray-800">{order.guestInfo?.phone || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
};

export default TrackOrder;
