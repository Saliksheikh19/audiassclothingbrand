const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    images: [String],
    hoverImage: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    details: [String],
    sizes: [String],
    price: {
        type: Number,
        required: true,
        default: 0
    },
    originalPrice: {
        type: Number,
        required: false
    },
    discount: {
        type: Number,
        required: false,
        default: 0
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
