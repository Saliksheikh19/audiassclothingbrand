import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../ui/Container';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black text-white pt-20 pb-10 text-sm">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* About */}
                    <div>
                        <h3 className="font-bold uppercase tracking-[0.15em] mb-8 text-xs">About AUDIASS</h3>
                        <ul className="space-y-3 text-gray-400 text-xs tracking-wide">
                            <li><a href="#" className="hover:text-white transition-colors">Who We Are</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Store Locator</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div>
                        <h3 className="font-bold uppercase tracking-[0.15em] mb-8 text-xs">Customer Service</h3>
                        <ul className="space-y-3 text-gray-400 text-xs tracking-wide">
                            <li><a href="#" className="hover:text-white transition-colors">Delivery Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Return & Exchange</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div>
                        <h3 className="font-bold uppercase tracking-[0.15em] mb-8 text-xs">Follow Us</h3>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-gray-300 transition-colors"><Facebook size={20} strokeWidth={1.5} /></a>
                            <a href="#" className="hover:text-gray-300 transition-colors"><Instagram size={20} strokeWidth={1.5} /></a>
                            <a href="#" className="hover:text-gray-300 transition-colors"><Youtube size={20} strokeWidth={1.5} /></a>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-bold uppercase tracking-[0.15em] mb-8 text-xs">Stay Connected</h3>
                        <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                            Subscribe to get notified about product launches, special offers and news.
                        </p>
                        <form className="flex flex-col gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-transparent border-b border-gray-700 py-2 focus:outline-none focus:border-white transition-colors placeholder-gray-600 text-white"
                            />
                            <button
                                type="submit"
                                className="text-left font-bold uppercase tracking-wider text-xs hover:text-gray-300 transition-colors mt-2"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-900 pt-8 text-center text-[10px] text-gray-600 uppercase tracking-wider">
                    <p>&copy; {new Date().getFullYear()} AUDIASS. All rights reserved.</p>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
