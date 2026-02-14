import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null);

    // Initial Data Fetch
    useEffect(() => {
        fetchProducts();
        if (user && user.isAdmin) {
            fetchOrders();
        }
    }, [user]);

    // --- Auth ---
    const login = async (email, password) => {
        const res = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (res.ok) {
            const data = await res.json();
            if (!data.isAdmin) {
                throw new Error('Not authorized as admin');
            }
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
        } else {
            throw new Error('Invalid email or password');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        setOrders([]);
    };

    // --- Products ---
    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data);
            const uniqueCats = [...new Set(data.map(p => p.category))];
            setCategories(uniqueCats.map((name, index) => ({ id: index + 1, name })));
        } catch (error) {
            console.error(error);
        }
    };

    const addProduct = async (productData) => {
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify(productData)
            });
            if (res.ok) fetchProducts();
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const updateProduct = async (id, updatedData) => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify(updatedData)
            });
            if (res.ok) fetchProducts();
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const deleteProduct = async (id) => {
        if (!id) return;
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            if (res.ok) fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    // --- Orders ---
    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders', {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const updateOrderStatus = async (id, status) => {
        try {
            const res = await fetch(`/api/orders/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                fetchOrders();
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };



    // --- Categories ---
    const addCategory = (name) => {
        const newCategory = { id: Date.now(), name };
        setCategories(prev => [...prev, newCategory]);
    };

    const deleteCategory = (id) => {
        setCategories(prev => prev.filter(c => c.id !== id));
    };

    // --- Stats ---
    const totalRevenue = orders.reduce((acc, order) => {
        if (order.status !== 'Cancelled') {
            return acc + (Number(order.totalPrice) || 0);
        }
        return acc;
    }, 0);

    const totalOrders = orders.length;

    // Pending orders are strictly those with 'Pending' status
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;

    // Shipped (Delivered) orders
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;

    return (
        <AdminContext.Provider value={{
            user,
            login,
            logout,
            products,
            categories,
            orders,
            addProduct,
            updateProduct,
            deleteProduct,
            updateOrderStatus,
            addCategory,
            deleteCategory,
            stats: {
                totalRevenue,
                totalOrders,
                pendingOrders,
                deliveredOrders
            }
        }}>
            {children}
        </AdminContext.Provider>
    );
};
