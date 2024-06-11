const { Router } = require("express");
const router = Router();
const userController = require("../controllers/userController");
const constants = require("../config/constants");

router.post(`${constants.ENDPOINT}/users`, userController.createUser);
router.delete(`${constants.ENDPOINT}/users/:id`, userController.removeUser);
router.get(`${constants.ENDPOINT}/users`, userController.dispalyUser);
router.get(`${constants.ENDPOINT}/users-role`, userController.displayUserPerRole);
router.get(`${constants.ENDPOINT}/users/:id`, userController.getSpecificUser);
router.patch(`${constants.ENDPOINT}/users/:id`, userController.updateUser);
router.post(`${constants.ENDPOINT}/login`, userController.loginUser);
router.post(`${constants.ENDPOINT}/forgot-password`, userController.forgotPassword);
router.post(`${constants.ENDPOINT}/reset-password`, userController.resetPassword);


module.exports = router;
