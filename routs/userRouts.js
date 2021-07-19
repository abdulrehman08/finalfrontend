const express = require("express");
const Router = express.Router();
const authController = require("../controller/authController");
const userController = require("./../controller/userController");
// this comment is for heroku casing error
Router.post("/signup", authController.signup);
Router.post("/signin", authController.signin);
Router.get("/logout" , authController.logout);


// ****************************************
// there is error in accessing token from the client side
Router.use(authController.protect);
// ***************************************


Router.patch("/updatePassword", authController.updatePassword);
Router.patch("/updateMe", userController.updateMe);
Router.get("/me", userController.getMe);
Router.use(authController.restrictTo("admin"));
Router.get("/getAll", userController.getAllUsers);
Router.patch("/delete/:name", userController.deleteUser);



module.exports = Router;
