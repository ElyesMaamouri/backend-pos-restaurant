const { Router } = require("express");
const router = Router();
const productController = require("../controllers/productController");
const constants = require("../config/constants");

router.post(
  `${constants.ENDPOINT}/products`,
  productController.createProduct
);
router.get(
  `${constants.ENDPOINT}/product-item`,
  productController.listProductPerCategorie
);
router.get(
  `${constants.ENDPOINT}/products`,
  productController.listProduct
);
 
router.delete(
  `${constants.ENDPOINT}/products/:id`,
  productController.removeProduct
);
 

router.put(
  `${constants.ENDPOINT}/products/:id`,
  productController.updateProduct
);
router.get(
  `${constants.ENDPOINT}/products/:id`,
  productController.getProductUnique
);
 

module.exports = router;
