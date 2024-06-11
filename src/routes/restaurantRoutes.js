const { Router } = require("express");
const router = Router();
const restaurantController = require("../controllers/restaurantController");
const constants = require("../config/constants");

router.post(
  `${constants.ENDPOINT}/restaurants`,
  restaurantController.createSettingsRestaurant
);
router.get(
  `${constants.ENDPOINT}/restaurants`,
  restaurantController.getSettings
);

module.exports = router;
