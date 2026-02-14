import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem('wishlist');
        return saved ? JSON.parse(saved) : [];
    });

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('userInfo'); // Reusing 'userInfo' key from Admin context might conflict if admin vs user logic differs, but standard is 'userInfo'
        return saved ? JSON.parse(saved) : null;
    });

    const [products, setProducts] = useState([]);

    // Fetch products from backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };
        fetchProducts();
    }, []);

    // --- Auth ---
    const login = async (email, password) => {
        const res = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (res.ok) {
            const data = await res.json();
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } else {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Invalid email or password');
        }
    };

    const register = async (name, email, password) => {
        const res = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (res.ok) {
            const data = await res.json();
            // Do NOT log the user in automatically
            // setUser(data);
            // localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } else {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Registration failed');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        // Optional: clear cart/wishlist on logout if desired
    };

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToCart = (product, quantity = 1, size = 'M') => {
        const productId = product._id || product.id;
        setCart(prev => {
            const existing = prev.find(item => (item.id === productId || item._id === productId) && item.size === size);
            if (existing) {
                return prev.map(item =>
                    (item.id === productId || item._id === productId) && item.size === size
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, id: productId, quantity, size }];
        });
        toast.success("Product added to cart!");
        setIsCartOpen(true);
    };

    const removeFromCart = (productId, size) => {
        setCart(prev => prev.filter(item => !((item.id === productId || item._id === productId) && item.size === size)));
    };

    const clearCart = () => {
        setCart([]);
    };

    const updateQuantity = (productId, size, delta) => {
        setCart(prev => prev.map(item => {
            if ((item.id === productId || item._id === productId) && item.size === size) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const toggleWishlist = (product) => {
        const productId = product._id || product.id;
        setWishlist(prev => {
            const exists = prev.find(item => (item.id === productId || item._id === productId));
            if (exists) {
                toast.info("Removed from wishlist!");
                return prev.filter(item => (item.id !== productId && item._id !== productId));
            }
            toast.success("Added to wishlist!");
            return [...prev, { ...product, id: productId }];
        });
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId || item._id === productId);
    };

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <ShopContext.Provider value={{
            user,
            login,
            register,
            logout,
            products,
            cart,
            wishlist,
            addToCart,
            removeFromCart,
            clearCart,
            updateQuantity,
            toggleWishlist,
            isInWishlist,
            cartTotal,
            cartCount,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </ShopContext.Provider>
    );
};
