import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingBag, Menu, X, Heart, LogOut } from 'lucide-react';
import Container from '../ui/Container';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import logo from '../../assets/audiass-logo.png';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { cartCount, wishlist, user, logout } = useShop();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMobileMenuOpen(false);
    };

    const textColor = 'text-black';
    const logoColor = 'text-black';

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'
                    }`}
            >
                <Container>
                    <div className="flex items-center justify-between">
                        {/* Mobile Menu Trigger */}
                        <div className="lg:hidden flex items-center">
                            <button onClick={() => setIsMobileMenuOpen(true)}>
                                <Menu className={`w-6 h-6 ${textColor}`} />
                            </button>
                        </div>

                        {/* Logo */}
                        <div className="flex-1 lg:flex-none text-center lg:text-left">
                            <Link to="/" className="block">
                                <img
                                    src={logo}
                                    alt="AUDIASS"
                                    className={`h-16 w-auto object-contain mx-auto lg:mx-0 transition-all duration-300 ${isScrolled ? 'brightness-0' : ''}`}
                                />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center justify-center gap-10 flex-1">
                            {[
                                { name: 'New In', path: '/collections/new-in' },
                                { name: 'Apparel', path: '/collections/apparel' },
                                { name: 'Activewear', path: '/collections/activewear' },
                                { name: 'Accessories', path: '/collections/accessories' },
                                { name: 'Sale', path: '/collections/sale' }
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity ${textColor}`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Right Icons */}
                        <div className="flex items-center justify-end gap-6 text-sm">
                            <button className="hidden lg:block">
                                <Search className={`w-5 h-5 ${textColor}`} />
                            </button>

                            <Link to="/wishlist" className="hidden lg:block relative">
                                <Heart className={`w-5 h-5 ${textColor}`} />
                                {wishlist.length > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                                        {wishlist.length}
                                    </span>
                                )}
                            </Link>

                            {/* User Icon / Auth */}
                            {user ? (
                                <div className="hidden lg:flex items-center gap-2 group relative">
                                    <button className="flex items-center gap-2">
                                        <User className={`w-5 h-5 ${textColor}`} />
                                        <span className={`text-xs font-bold uppercase hidden xl:block ${textColor}`}>
                                            {user.name.split(' ')[0]}
                                        </span>
                                    </button>
                                    {/* Dropdown Logout */}
                                    <div className="absolute right-0 top-full pt-2 hidden group-hover:block w-32">
                                        <Link
                                            to="/my-orders"
                                            className="w-full bg-white shadow-lg border-b border-gray-100 py-2 px-4 text-xs font-bold uppercase hover:bg-gray-50 text-left flex items-center gap-2"
                                        >
                                            <ShoppingBag size={14} /> My Orders
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full bg-white shadow-lg border border-gray-100 py-2 px-4 text-xs font-bold uppercase hover:bg-gray-50 text-left flex items-center gap-2"
                                        >
                                            <LogOut size={14} /> Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login" className="hidden lg:block">
                                    <User className={`w-5 h-5 ${textColor}`} />
                                </Link>
                            )}

                            <Link to="/cart" className="relative">
                                <ShoppingBag className={`w-5 h-5 ${textColor}`} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </Container>
            </header>

            {/* Mobile Drawer */}
            <div
                className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onClick={() => setIsMobileMenuOpen(false)}
            >
                <div
                    className={`absolute top-0 left-0 w-[85%] max-w-sm h-full bg-white shadow-2xl transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center p-6 border-b">
                        <span className="text-xl font-bold tracking-widest">MENU</span>
                        <button onClick={() => setIsMobileMenuOpen(false)}>
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-6">
                        <nav className="flex flex-col gap-6">
                            {[
                                { name: 'Men', path: '/collections/men' },
                                { name: 'Women', path: '/collections/women' },
                                { name: 'Juniors', path: '/collections/juniors' },
                                { name: 'Teens', path: '/collections/teens' },
                                { name: 'Sale', path: '/collections/sale' }
                            ].map((item) => (
                                <div key={item.name} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                    <Link
                                        to={item.path}
                                        className="text-lg font-semibold uppercase tracking-wider"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                </div>
                            ))}
                        </nav>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gray-50 border-t space-y-4">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 text-sm font-semibold uppercase text-gray-500">
                                    <User className="w-5 h-5" /> Hi, {user.name}
                                </div>
                                <Link
                                    to="/my-orders"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full flex items-center justify-center gap-2 bg-gray-200 text-black py-3 text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                                >
                                    My Orders
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-center gap-3 w-full border border-black py-3 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                            >
                                <User className="w-5 h-5" /> Login / Register
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
