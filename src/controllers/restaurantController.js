const Restaurant = require("../models/Resturant");
const _ = require("lodash");
const upload = require("../utils/imageUpload");

exports.createSettingsRestaurant = async (req, res, next) => {
  try {
    upload.single("logo")(req, res, async function (err) {
      const restaurant = _.pick(req.body, [
        "nameRestaurant",
        "address",
        "backgoundColorDashboard",
        "description",
      ]);
      console.log(restaurant);
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (req.file) {
        restaurant.logoRestaurant = req.file.filename;
        const restaurantData = new Restaurant(restaurant);
        await restaurantData.save();
        return res.status(201).json({
          message: "Paramétres de retaurant  à été enregistrer avec succcess",
        });
      } else {
        return res
          .status(400)
          .json({ message: "Aucun fichier n'a été téléchargé" });
      }
    });
  } catch (error) {
    next();
    return res.status(500).json({
      error: error,
    });
  }
};

exports.getSettings = async (req, res, next) => {
  try {
    const dataSetting = await Restaurant.find({}).sort({ _id: -1 }).limit(1);
    if (!dataSetting) {
      return res.status(404).json({
        message: "pas de paramétre enregistrer",
      });
    }
 
    res.status(200).json({
      message: "Les paramétres trouvées",
      settings: dataSetting,
    });
  } catch (error) {
    next(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};
