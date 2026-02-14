const dns = require('dns');
// Force IPv4 for DNS resolution to avoid IPv6 connection issues on some environments (like Render)
if (dns && dns.setDefaultResultOrder) {
    try {
        dns.setDefaultResultOrder('ipv4first');
        console.log('DNS resolution forced to IPv4');
    } catch (error) {
        console.error('Failed to set DNS result order:', error);
    }
}
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const productRoutes = require('./routes/productRoutes');

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5003;

console.log('Attempting to start server...');

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
