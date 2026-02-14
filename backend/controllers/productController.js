const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const User = require('../models/User');

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne(); // Fixed: .remove() is deprecated
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    // Temporary: Fetch first admin user since we don't have auth middleware yet
    const adminUser = await User.findOne({ isAdmin: true });

    console.log('createProduct req.body:', req.body); // DEBUG LOG

    const { name, price, image, images, category, description, countInStock, sizes } = req.body;

    const product = new Product({
        name: name || 'Sample name',
        price: price || 0,
        user: req.user ? req.user._id : adminUser._id,
        image: image || '/images/sample.jpg',
        images: images || [],
        brand: 'Generic',
        category: category || 'Sample category',
        countInStock: countInStock || 0,
        sizes: sizes || [],
        numReviews: 0,
        description: description || 'Sample description',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        images,
        category,
        countInStock,
        sizes
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.images = images || product.images;
        product.category = category || product.category;
        product.sizes = sizes || product.sizes;

        // Ensure countInStock has a value (default to 0 if missing in both req and db)
        if (countInStock !== undefined) {
            product.countInStock = countInStock;
        } else if (product.countInStock === undefined) {
            product.countInStock = 0;
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

module.exports = {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
};
