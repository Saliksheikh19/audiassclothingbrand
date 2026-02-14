import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Truck, CheckCircle, Clock, Eye, X, Package, Phone, Mail, MapPin, Calendar, User, ChevronDown } from 'lucide-react';

const Orders = () => {
    const { orders, updateOrderStatus } = useAdmin();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'Confirmed': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'Processing': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'Cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        setIsUpdating(true);
        await updateOrderStatus(orderId, newStatus);
        setIsUpdating(false);
        // Update selected order status locally to reflect change immediately in modal if open
        if (selectedOrder && selectedOrder._id === orderId) {
            setSelectedOrder({ ...selectedOrder, status: newStatus, isDelivered: newStatus === 'Delivered' });
        }
    };

    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-white">Orders</h1>
            </div>

            <div className="bg-[#1E293B] rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-[#0F172A] text-gray-100 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Items</th>
                                <th className="px-6 py-4">Total Amount</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-[#2D3B4E] transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                    <td className="px-6 py-4 font-bold text-white">
                                        #{order._id.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-white">{order.guestInfo?.name || order.user?.name || 'Guest'}</span>
                                            <span className="text-xs text-gray-500">{order.guestInfo?.email || order.user?.email || 'No email'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.orderItems.length} items
                                    </td>
                                    <td className="px-6 py-4 font-bold text-white">
                                        PKR {(order.totalPrice || 0).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                            {order.status || (order.isDelivered ? 'Delivered' : 'Pending')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedOrder(order);
                                            }}
                                            className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        No orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-[#1E293B] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-700 flex flex-col" onClick={e => e.stopPropagation()}>

                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-[#0F172A]">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                    Order #{selectedOrder._id}
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(selectedOrder.status)}`}>
                                        {selectedOrder.status || (selectedOrder.isDelivered ? 'Delivered' : 'Pending')}
                                    </span>
                                </h2>
                                <p className="text-gray-400 text-sm mt-1">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                {/* Customer Details */}
                                <div className="space-y-6">
                                    <div className="bg-[#0F172A]/50 p-4 rounded-xl border border-gray-700/50">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <User size={16} /> Customer Details
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs text-gray-500">Name</label>
                                                <p className="text-white font-medium">{selectedOrder.guestInfo?.name || selectedOrder.user?.name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500">Email</label>
                                                <div className="flex items-center gap-2 text-white">
                                                    <Mail size={14} className="text-blue-400" />
                                                    {selectedOrder.guestInfo?.email || selectedOrder.user?.email || 'N/A'}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500">Phone</label>
                                                <div className="flex items-center gap-2 text-white">
                                                    <Phone size={14} className="text-green-400" />
                                                    {selectedOrder.guestInfo?.phone || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#0F172A]/50 p-4 rounded-xl border border-gray-700/50">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <MapPin size={16} /> Shipping Address
                                        </h3>
                                        <div className="text-white space-y-1 text-sm">
                                            <p>{selectedOrder.shippingAddress?.address}</p>
                                            <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
                                            <p>{selectedOrder.shippingAddress?.country}</p>
                                        </div>
                                    </div>

                                    {/* Status Management */}
                                    <div className="bg-[#0F172A]/50 p-4 rounded-xl border border-gray-700/50">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <CheckCircle size={16} /> Update Status
                                        </h3>
                                        <div className="space-y-2">
                                            {['Pending', 'Confirmed', 'Delivered', 'Cancelled'].map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => handleStatusUpdate(selectedOrder._id, status)}
                                                    disabled={isUpdating || selectedOrder.status === status}
                                                    className={`w-full py-2 px-3 rounded-lg text-left text-sm font-medium transition-all ${selectedOrder.status === status
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-[#1E293B] text-gray-400 hover:bg-[#2D3B4E] hover:text-white'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        {status}
                                                        {selectedOrder.status === status && <CheckCircle size={14} />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="md:col-span-2 space-y-6">
                                    <div className="bg-[#0F172A]/50 p-4 rounded-xl border border-gray-700/50">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <Package size={16} /> Order Items
                                        </h3>
                                        <div className="space-y-4">
                                            {selectedOrder.orderItems.map((item, index) => (
                                                <div key={index} className="flex items-center gap-4 bg-[#1E293B] p-3 rounded-lg border border-gray-700">
                                                    <div className="h-16 w-16 bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                                                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-white font-medium">{item.name}</h4>
                                                        <p className="text-gray-400 text-sm">Qty: {item.qty} × PKR {item.price.toLocaleString()}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-white font-bold">PKR {(item.qty * item.price).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center">
                                            <span className="text-gray-400">Total Amount</span>
                                            <span className="text-2xl font-bold text-white">PKR {selectedOrder.totalPrice.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Payment Info */}
                                    <div className="bg-[#0F172A]/50 p-4 rounded-xl border border-gray-700/50">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Payment Information</h3>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <label className="text-xs text-gray-500">Method</label>
                                                <p className="text-white font-medium">{selectedOrder.paymentMethod}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500">Payment Status</label>
                                                <p className={`font-bold ${selectedOrder.isPaid ? 'text-green-500' : 'text-yellow-500'}`}>
                                                    {selectedOrder.isPaid ? 'Paid' : 'Unpaid'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
