const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true },
  order: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  tableStatus: { type: String, enum: ['reserved', 'not reserved'], required: true }
}, {
  timestamps: true // Activer les horodatages automatiques
});
 
module.exports = mongoose.model("Table", tableSchema);
