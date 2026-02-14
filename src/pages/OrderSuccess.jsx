import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { CheckCircle, Copy } from 'lucide-react';

const OrderSuccess = () => {
    const location = useLocation();
    const { orderId } = location.state || {};

    const copyToClipboard = () => {
        if (orderId) {
            navigator.clipboard.writeText(orderId);
            alert('Order ID copied to clipboard!');
        }
    };

    if (!orderId) {
        return (
            <div className="pt-32 pb-20 min-h-screen flex items-center justify-center">
                <Container>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">No Order Found</h1>
                        <Link to="/">
                            <Button>Continue Shopping</Button>
                        </Link>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 min-h-screen bg-gray-50 flex items-center justify-center">
            <Container>
                <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg text-center animate-fade-in-up">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                        <CheckCircle size={40} strokeWidth={3} />
                    </div>

                    <h1 className="text-3xl font-bold uppercase tracking-wider mb-2 text-gray-900">Order Confirmed!</h1>
                    <p className="text-gray-500 mb-8">Thank you for your purchase. Your order has been placed successfully.</p>

                    <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-100">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Order ID</p>
                        <div className="flex items-center justify-center gap-3">
                            <code className="text-xl font-mono font-bold text-gray-800">{orderId}</code>
                            <button
                                onClick={copyToClipboard}
                                className="p-2 hover:bg-gray-200 rounded-md transition-colors text-gray-500 hover:text-black"
                                title="Copy Order ID"
                            >
                                <Copy size={18} />
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Save this ID to track your order status.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/track-order" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full">Track Order</Button>
                        </Link>
                        <Link to="/" className="w-full sm:w-auto">
                            <Button className="w-full">Continue Shopping</Button>
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default OrderSuccess;
