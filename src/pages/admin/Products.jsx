import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAdmin } from '../../context/AdminContext';
import { Edit2, Trash2, Plus, X, Upload } from 'lucide-react';
import axios from 'axios';

const Products = () => {
    const { products, categories, addProduct, updateProduct, deleteProduct } = useAdmin();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        countInStock: '',
        sizes: '',
        images: [],
        description: ''
    });

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                category: product.category,
                price: product.price,
                countInStock: product.countInStock || 0,
                sizes: product.sizes ? product.sizes.join(', ') : '',
                images: product.images && product.images.length > 0 ? product.images : [product.image],
                description: product.description || ''
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                category: '',
                price: '',
                countInStock: '',
                sizes: '',
                images: [],
                description: ''
            });
        }
        setIsModalOpen(true);
    };

    const uploadFileHandler = async (e) => {
        const files = Array.from(e.target.files);
        const formDataUpload = new FormData();
        files.forEach(file => {
            formDataUpload.append('images', file);
        });

        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await axios.post('/api/upload', formDataUpload, config);

            // data contains array of paths
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...data]
            }));

            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    const removeImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const productData = {
            ...formData,
            price: Number(formData.price),
            countInStock: Number(formData.countInStock),
            sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s !== ''),
            image: formData.images.length > 0 ? formData.images[0] : '/images/sample.jpg',
            images: formData.images
        };

        if (editingProduct) {
            updateProduct(editingProduct._id, productData);
            toast.success("Product updated successfully!");
        } else {
            addProduct(productData);
            toast.success("Product created successfully!");
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-white">Products</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-[#1E293B] rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-[#0F172A] text-gray-100 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-[#2D3B4E] transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                                            <img src={product.image} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <span className="font-medium text-white">{product.name}</span>
                                    </td>
                                    <td className="px-6 py-4">{product.category}</td>
                                    <td className="px-6 py-4 text-white font-bold">PKR {product.price.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${product.countInStock > 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                            {product.countInStock > 0 ? `In Stock (${product.countInStock})` : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => handleOpenModal(product)}
                                                className="text-blue-400 hover:text-blue-300 p-1 rounded-md hover:bg-blue-400/10"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="text-red-400 hover:text-red-300 p-1 rounded-md hover:bg-red-400/10"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-[#1E293B] rounded-2xl w-full max-w-lg shadow-2xl border border-gray-700 my-8">
                        <div className="flex justify-between items-center p-6 border-b border-gray-700">
                            <h2 className="text-xl font-bold text-white">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                                    <input
                                        type="text"
                                        list="category-suggestions"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                        placeholder="Select or Type New"
                                    />
                                    <datalist id="category-suggestions">
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.name} />
                                        ))}
                                    </datalist>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Price (PKR)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Quantity (Stock)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.countInStock}
                                        onChange={(e) => setFormData({ ...formData, countInStock: e.target.value })}
                                        className="w-full bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                        placeholder="e.g. 100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Sizes (comma separated)</label>
                                    <input
                                        type="text"
                                        value={formData.sizes}
                                        onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                                        className="w-full bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                        placeholder="e.g. S, M, L, XL"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Images</label>
                                <div className="space-y-3">
                                    <div className="flex gap-2 items-center">
                                        <label className="flex-1 cursor-pointer bg-[#0F172A] border border-gray-700 border-dashed rounded-lg px-4 py-3 text-center hover:bg-[#1E293B] transition-colors group">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Upload size={20} className="text-gray-400 group-hover:text-blue-400" />
                                                <span className="text-sm text-gray-400 group-hover:text-white">Click to upload images</span>
                                            </div>
                                            <input
                                                type="file"
                                                multiple
                                                onChange={uploadFileHandler}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    {/* Image Previews */}
                                    {formData.images.length > 0 && (
                                        <div className="grid grid-cols-4 gap-2">
                                            {formData.images.map((img, index) => (
                                                <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-700">
                                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {uploading && <p className="text-sm text-blue-400 animate-pulse">Uploading...</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                <textarea
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                ></textarea>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
                                >
                                    {editingProduct ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
