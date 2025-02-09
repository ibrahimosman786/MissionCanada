// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mission-canada', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Product Schema
const productSchema = new mongoose.Schema({
    barcode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    manufacturer: String,
    country: String,
    category: String,
    isCanadian: Boolean
});

const Product = mongoose.model('Product', productSchema);

// API Routes
app.get('/api/product/:barcode', async (req, res) => {
    try {
        const product = await Product.findOne({ barcode: req.params.barcode });
        if (!product) {
            // If product not found in database, fetch from external API
            const externalData = await fetchExternalProductData(req.params.barcode);
            return res.json(externalData);
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching product data' });
    }
});

// External API service (example)
async function fetchExternalProductData(barcode) {
    // In production, you would integrate with a real product database API
    // This is a mock implementation
    return {
        barcode,
        name: 'Sample Product',
        manufacturer: 'Sample Company',
        country: Math.random() > 0.5 ? 'Canada' : 'USA',
        category: 'General',
        isCanadian: Math.random() > 0.5
    };
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});