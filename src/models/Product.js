const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productImage: { type: String, required: true },
  productPrice: { type: Number, required: true },
  categories: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  subCategories: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  description: { type: String, required: true },
});

module.exports = mongoose.model("Product", productSchema);
