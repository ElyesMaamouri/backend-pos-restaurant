const { Router } = require("express");
const router = Router();
const categoriesController = require("../controllers/categoryController");
const constants = require("../config/constants");
const multer = require('multer');
const upload = multer();
router.post(
  `${constants.ENDPOINT}/categories`,
  categoriesController.createCategory
);
router.get(
  `${constants.ENDPOINT}/categories`,
  categoriesController.listCategory
);
router.get(
  `${constants.ENDPOINT}/categories/:id`,
  categoriesController.getSpecificCategorie
);

router.delete(
  `${constants.ENDPOINT}/categories/:id`,
  categoriesController.removeCategroy
);

router.put(
  `${constants.ENDPOINT}/categories/:id`,upload.none(),
  categoriesController.updateCategory
);

router.post(
  `${constants.ENDPOINT}/type-categories`,
  categoriesController.listCategoryPerType
);

module.exports = router;
