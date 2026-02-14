const asyncHandler = require('express-async-handler');
const Product = require('../models/Product'); // Import Product model
const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
        return;
    } else {
        // Check stock and update product quantities
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                res.status(404);
                throw new Error(`Product not found: ${item.name}`);
            }
            // Deduct stock
            const orderQty = Number(item.qty);
            const currentStock = Number(product.countInStock);

            if (currentStock < orderQty) {
                res.status(400);
                throw new Error(`Not enough stock for ${item.name}`);
            }

            product.countInStock = currentStock - orderQty;
            await product.save();
        }

        const order = new Order({
            orderItems,
            user: req.user ? req.user._id : null,
            guestInfo: req.user ? { name: req.user.name, email: req.user.email, phone: req.body.phone } : { name: req.body.name, email: req.body.email, phone: req.body.phone },
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            status: 'Pending'
        });


        const createdOrder = await order.save();

        // Send Order Confirmation Email
        try {
            const customerEmail = req.user ? req.user.email : req.body.email;
            const customerName = req.user ? req.user.name : req.body.name;

            await sendEmail({
                email: customerEmail,
                subject: 'Order Confirmation - AUDIASS',
                message: `
                    <h1>Thank you for your order, ${customerName}!</h1>
                    <p>We have received your order #${createdOrder._id}.</p>
                    <p>Total Amount: PKR ${totalPrice}</p>
                    <p>We will notify you when it ships.</p>
                `
            });
        } catch (error) {
            console.error('Order email send failed:', error);
        }

        res.status(201).json(createdOrder);
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    const { status } = req.body;

    if (order) {
        order.status = status;

        if (status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        } else {
            order.isDelivered = false;
            order.deliveredAt = null;
        }

        const updatedOrder = await order.save();

        // Send Status Update Email
        try {
            const customerEmail = updatedOrder.guestInfo?.email || updatedOrder.user?.email || (await updatedOrder.populate('user')).user?.email;
            const customerName = updatedOrder.guestInfo?.name || updatedOrder.user?.name || (await updatedOrder.populate('user')).user?.name || 'Customer';

            if (customerEmail) {
                await sendEmail({
                    email: customerEmail,
                    subject: `Order Status Update - #${updatedOrder._id}`,
                    message: `
                        <h1>Order Update</h1>
                        <p>Hi ${customerName},</p>
                        <p>Your order #${updatedOrder._id} status has been updated to: <strong>${status}</strong>.</p>
                        <p>Thank you for shopping with AUDIASS.</p>
                    `
                });
            }
        } catch (error) {
            console.error('Status update email failed:', error);
        }

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({
        $or: [
            { user: req.user._id },
            { 'guestInfo.email': req.user.email }
        ]
    }).sort({ createdAt: -1 }); // Added sort to show newest first
    res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name email');
    res.json(orders);
});

// @desc    Track order by ID and Email/Phone
// @route   POST /api/orders/track
// @access  Public
const trackOrder = asyncHandler(async (req, res) => {
    const { orderId, email, phone } = req.body;

    if (!orderId) {
        res.status(400);
        throw new Error('Order ID is required');
    }

    // Try to find the order
    let order;
    try {
        order = await Order.findById(orderId).populate('user', 'name email');
    } catch (error) {
        // If ID is invalid format
        res.status(404);
        throw new Error('Order not found');
    }

    if (order) {
        // Check if email or phone matches guestInfo OR registered user info
        const orderEmail = order.guestInfo?.email || order.user?.email;
        const orderPhone = order.guestInfo?.phone; // Phone might not be on user model directly unless added, so rely on guestInfo or custom check if needed.

        let isMatch = false;

        if (email && orderEmail && email.toLowerCase() === orderEmail.toLowerCase()) {
            isMatch = true;
        }

        // If checking by phone
        if (phone && orderPhone && phone === orderPhone) {
            isMatch = true;
        }

        if (isMatch) {
            res.json(order);
        } else {
            res.status(401);
            throw new Error('Invalid verification details');
        }
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderStatus,
    getMyOrders,
    getOrders,
    trackOrder,
};
