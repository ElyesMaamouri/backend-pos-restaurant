const { Router } = require("express");
const router = Router();
const orderController = require("../controllers/orderControllers");
const constants = require("../config/constants");

router.post(`${constants.ENDPOINT}/orders/table/:id`, orderController.createOrder);
router.get(`${constants.ENDPOINT}/orders`, orderController.displayOrders);
 router.patch(`${constants.ENDPOINT}/orders/:orderId`, orderController.updateOrder);
 router.get(`${constants.ENDPOINT}/orders/:orderId`, orderController.displaySpecificOrder);
 router.delete(`${constants.ENDPOINT}/orders/:orderId/product/:productId`, orderController.removeProductFromOrder);
 
 router.get(`${constants.ENDPOINT}/orders-today`, orderController.getDetailsofOrders);
 

module.exports = router;
