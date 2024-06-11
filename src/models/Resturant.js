const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    logoRestaurant: { type: String, required: true },
    nameRestaurant: { type: String, required: true },
    backgoundColorDashboard: { type: String, required: true },
    description : { type: String, required: true },
    address :  { type: String, required: true }
  },
  {
    timestamps: true, // Activer les horodatages automatiques
  }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
