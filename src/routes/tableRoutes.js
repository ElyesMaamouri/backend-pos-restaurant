const { Router } = require("express");
const router = Router();
const tableController = require("../controllers/tableController");
const constants = require("../config/constants");
const {authenticateUser, authorizeAdmin } = require("../middleware/authMiddleware");

router.post(`${constants.ENDPOINT}/tables`, tableController.createTable);

router.get(`${constants.ENDPOINT}/tables`, tableController.displayTables);
router.delete(`${constants.ENDPOINT}/tables/:tableNumber`,tableController.removeTable);
router.put(`${constants.ENDPOINT}/tables/:tableId`,tableController.updateTable);
router.get(`${constants.ENDPOINT}/tables/:id`,tableController.fetchSpeceficTable);
router.post(`${constants.ENDPOINT}/tables/:id`, tableController.printInvoice);

module.exports = router;
 