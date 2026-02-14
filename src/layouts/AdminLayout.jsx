import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { LayoutDashboard, ShoppingCart, Package, Truck, CreditCard, Settings, LogOut, Menu, X, Bell, Search as SearchIcon } from 'lucide-react';

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { user, logout } = useAdmin();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/kashan/login');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/kashan/login');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/kashan', icon: LayoutDashboard },
        { name: 'Order', path: '/kashan/orders', icon: ShoppingCart },
        { name: 'Products', path: '/kashan/products', icon: Package },
        { name: 'Shipping', path: '/kashan/shipping', icon: Truck },
        { name: 'Payments', path: '/kashan/payments', icon: CreditCard },
        { name: 'Settings', path: '/kashan/settings', icon: Settings },
    ];

    const isActive = (path) => {
        if (path === '/kashan' && location.pathname === '/kashan') return true;
        if (path !== '/kashan' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <div className="flex min-h-screen bg-[#0F172A] text-white font-sans">
            {/* Sidebar */}
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0 w-64 bg-[#111827] border-r border-gray-800 flex flex-col shadow-2xl md:shadow-none`}
            >
                <div className="p-6 flex items-center justify-between md:justify-center border-b border-gray-800">
                    {/* Power Icon as Logo */}
                    <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                            <line x1="12" y1="2" x2="12" y2="12"></line>
                        </svg>
                    </div>
                    {/* Close button for mobile inside sidebar */}
                    <button
                        className="md:hidden text-gray-400 hover:text-white"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)} // Close on mobile click
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                                ? 'bg-[#FFD700] text-black font-semibold shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon size={20} />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors text-red-400 hover:text-white hover:bg-red-500/10"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-4 text-center">
                        <p className="text-xs text-gray-200 mb-2">Customer Support</p>
                        <button className="w-full bg-cyan-400 text-black text-xs font-bold py-2 rounded-lg hover:bg-cyan-300 transition-colors">
                            Connect Now
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 md:ml-64`}>
                {/* Header */}
                <header className="h-20 bg-[#0F172A] flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 border-b border-gray-800/50 backdrop-blur-xl bg-[#0F172A]/90">
                    <button className="md:hidden text-gray-400 hover:text-white p-2" onClick={() => setSidebarOpen(true)}>
                        <Menu size={24} />
                    </button>

                    <div className="flex-1 flex justify-start md:pl-8">
                        {/* Contextual Header Info could go here */}
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                        {/* Search Bar */}
                        <div className="relative hidden md:block">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search"
                                className="bg-[#1E293B] text-white pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFD700] w-64 text-sm"
                            />
                        </div>

                        <button className="relative text-yellow-400 hover:text-yellow-300">
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            <div className="w-5 h-5 bg-yellow-400 rounded-sm"></div> {/* Placeholder for chat bubble icon */}
                        </button>

                        <button className="text-yellow-400 hover:text-yellow-300">
                            <Bell size={20} />
                        </button>

                        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-600">
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
