const express = require("express");
const Router = express.Router();
const authController = require("../controller/authController");
const viewController = require("./../controller/viewController");

// Router.get("/", viewController.frontend);
Router.get("/", viewController.signin);
Router.get("/signup", viewController.signup);
Router.get("/changePassword" , viewController.changePassword)

Router.use(authController.protect);
Router.get("/profile", viewController.profile);
Router.get("/products",  viewController.products);
Router.get("/dashboard", viewController.dashboard);
Router.get("/addproduct", viewController.addproducts);
Router.get("/editproduct", viewController.editProduct);

Router.use(authController.restrictTo("admin"));
Router.get("/users", viewController.users);
Router.get("/addsubcategory", viewController.addSubcategory);
Router.get("/subcategory", viewController.subcategory);
Router.get("/editsubcategory", viewController.editsubcategory);
Router.get("/home", viewController.home);
Router.get("/category", viewController.category);
Router.get("/reviews" , viewController.reviews)
Router.get("/getReviews" , viewController.getReviews);
Router.get("/addslider", viewController.addslider);
Router.get("/addcategory", viewController.addcategory);
Router.get("/getVisitors"  ,viewController.getVisitors)
Router.get("/visitors" , viewController.visitors);
Router.get("/downloads" , viewController.downloads);
// Router.get("/profile", viewController.);


module.exports = Router;
