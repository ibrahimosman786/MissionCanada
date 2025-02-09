// api.js
const API_BASE_URL = 'http://localhost:5000/api';

export const ProductAPI = {
    async getProductByBarcode(barcode) {
        try {
            const response = await fetch(`${API_BASE_URL}/product/${barcode}`);
            if (!response.ok) {
                throw new Error('Product not found');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },

    async validateBarcode(barcode) {
        // Basic barcode validation
        return /^\d{12,13}$/.test(barcode);
    }
};