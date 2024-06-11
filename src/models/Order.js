const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, required: true },
            totalPrice: { type: Number, required: true }
        }
    ],
    total: { type: Number, default: 0 }, // Total de la commande
    status: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' }, 
    paymentMethod: { type: String, enum: ['cash', 'card'], required: true }  
}, {
    timestamps: true 
});

module.exports = mongoose.model('Order', orderSchema);
