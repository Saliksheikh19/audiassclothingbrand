import React, { useEffect, useState } from 'react';
import { useShop } from '../context/ShopContext';
import Container from '../components/ui/Container';
import { Package, Clock, CheckCircle, Truck, XCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
    const { user } = useShop();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders/myorders', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                } else {
                    setError('Failed to fetch orders');
                }
            } catch (err) {
                setError('An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'text-green-600 bg-green-50 border-green-200';
            case 'Confirmed': return 'text-purple-600 bg-purple-50 border-purple-200';
            case 'Cancelled': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return <CheckCircle size={16} />;
            case 'Confirmed': return <Package size={16} />;
            case 'Cancelled': return <XCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    if (loading) {
        return (
            <div className="pt-32 pb-20 min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
            <Container>
                <h1 className="text-2xl font-bold uppercase tracking-widest mb-8">My Orders</h1>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                        <Package size={48} className="mx-auto text-gray-300 mb-4" />
                        <h2 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-black text-white px-6 py-2 rounded-lg font-bold uppercase text-sm hover:bg-gray-800 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order) => {
                            const steps = ['Pending', 'Confirmed', 'Delivered'];
                            let currentStep = steps.indexOf(order.status || 'Pending');
                            if (order.status === 'Cancelled') currentStep = -1;
                            // Fallback if status doesn't match predefined steps exactly
                            if (currentStep === -1 && order.status !== 'Cancelled') currentStep = 0;
                            const isCancelled = order.status === 'Cancelled';

                            return (
                                <div key={order._id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                                    {/* Order Header */}
                                    <div className="bg-[#0F172A] text-white p-6 flex flex-wrap justify-between items-center">
                                        <div>
                                            <h2 className="text-lg font-bold flex items-center gap-2">
                                                Order #{order._id.substring(0, 8)}...
                                            </h2>
                                            <p className="text-gray-400 text-sm mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${isCancelled ? 'bg-red-500 text-white' :
                                            order.isDelivered ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                                            }`}>
                                            {order.status || 'Pending'}
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        {/* Progress Bar */}
                                        {!isCancelled ? (
                                            <div className="mb-10 relative">
                                                <div className="h-2 bg-gray-200 rounded-full mb-8">
                                                    <div
                                                        className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out"
                                                        style={{ width: `${(currentStep / 3) * 100}%` }}
                                                    />
                                                </div>
                                                <div className="flex justify-between relative">
                                                    {steps.map((step, index) => (
                                                        <div key={step} className="flex flex-col items-center relative z-10 w-24 text-center">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors duration-500 ${index <= currentStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                                                                }`}>
                                                                {index <= currentStep ? <CheckCircle size={16} /> : <div className="w-3 h-3 bg-current rounded-full" />}
                                                            </div>
                                                            <span className={`text-[10px] sm:text-xs font-bold uppercase ${index <= currentStep ? 'text-green-600' : 'text-gray-400'
                                                                }`}>{step}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 mb-8 bg-red-50 rounded-xl border border-red-100">
                                                <XCircle size={32} className="mx-auto text-red-500 mb-2" />
                                                <h3 className="text-lg font-bold text-gray-800">Order Cancelled</h3>
                                            </div>
                                        )}

                                        {/* Order Details Grid */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t pt-8">
                                            {/* Items */}
                                            <div>
                                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                                                    <Package size={14} /> Items
                                                </h3>
                                                <div className="space-y-4">
                                                    {order.orderItems.map((item, index) => (
                                                        <div key={index} className="flex gap-4 items-center">
                                                            <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                                                                <p className="text-xs text-gray-500 mt-1">Qty: {item.qty} × PKR {item.price.toLocaleString()}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-bold text-sm">PKR {(item.qty * item.price).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-6 pt-4 border-t flex justify-between items-center">
                                                    <span className="font-bold text-sm">Total</span>
                                                    <span className="font-bold text-xl">PKR {(order.totalPrice || 0).toLocaleString()}</span>
                                                </div>
                                            </div>

                                            {/* Delivery Details */}
                                            <div>
                                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                                                    <Truck size={14} /> Delivery Details
                                                </h3>
                                                <div className="bg-gray-50 p-6 rounded-xl space-y-4 text-sm border border-gray-100">
                                                    <div>
                                                        <label className="text-xs text-gray-500 block mb-1 font-semibold uppercase">Shipping Address</label>
                                                        <p className="font-medium text-gray-800">
                                                            {order.shippingAddress.address}
                                                            <br />
                                                            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                                            <br />
                                                            {order.shippingAddress.country}
                                                        </p>
                                                    </div>
                                                    {order.guestInfo?.phone && (
                                                        <div>
                                                            <label className="text-xs text-gray-500 block mb-1 font-semibold uppercase">Contact</label>
                                                            <p className="font-medium text-gray-800">{order.guestInfo.phone}</p>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <label className="text-xs text-gray-500 block mb-1 font-semibold uppercase">Payment Method</label>
                                                        <p className="font-medium text-gray-800">{order.paymentMethod}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Container>
        </div>
    );
};

export default MyOrders;
