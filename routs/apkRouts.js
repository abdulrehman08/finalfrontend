const express = require("express");
const multer = require("multer");
const Router = express.Router();
const apkController = require("../controller/apkController");
const authController = require("../controller/authController");
const sliderController=require("../controller/sliderController");
const upload=multer();
Router.get("/updateVisitors" , sliderController.updateVisitors);
Router.get("/activesliders",sliderController.getAllActive);
Router.get("/approved", apkController.allApprovedApk);
Router.get("/trend", apkController.trendingApks);
Router.get("/papular", apkController.papularApks);
Router.get("/getAllCate", apkController.getAllCate);
Router.get("/download/:title", apkController.getDownload);
Router.get("/:title", apkController.getApk);
Router.get("/getcategory/:category", apkController.getcategory);
Router.patch("/updateStatics/:image", apkController.updateStatics);
// here cate means subCate
Router.get("/samecate/:cate", apkController.getSameCateApps);
// protected routes
Router.patch("/reply/:title/:reviewId", /*authController.restrictTo("admin"),*/apkController.replyToComment)
Router.patch("/comment/:title",apkController.addComment);
Router.use(authController.protect);
Router.get("/oneapk/:title", apkController.getOneApk);

Router.post("/addApk", apkController.uploadImage, apkController.addApk);

// http://localhost:4000/apk/updateApk/testing%20app%2009
Router.patch("/apkupdate/:apkTitle",apkController.uploadImage, apkController.updateApk);
Router.patch(
  "/addApkFile/:title",
  apkController.uploadFile,
  apkController.uploadFileHandler
);
Router.delete("/deletesubcate/:cate",apkController.deleteSubcategory);
Router.patch(
  "/addApkImages/:title",
  apkController.uploadMultiImages.array("images", 10),
  apkController.saveImages,
  apkController.uploadImagesHandler
);

Router.get("/allApk", apkController.getAllApk);

// restricted to admin
Router.use(authController.restrictTo("admin"));
Router.get("/states", apkController.getStates);
Router.delete("/deleteApk/:title", apkController.deleteApk);
Router.patch("/updateActions", apkController.updateActions);
// slider apis
Router.post("/allsliders",sliderController.getAll);
Router.post("/addSlider",
apkController.uploadImage,
sliderController.addSlider);
Router.delete("/deleteSlider",
sliderController.deleteSlider);
Router.patch("/activeSwitch/:title",
sliderController.activeSwitch);
// categories apis
Router.post("/addCate", apkController.addCategory);
Router.patch(
  "/addSubCate/:cate",
  apkController.uploadImage,
  apkController.addSubCategory
);
Router.patch(
  "/editSubCate/:cate/:subcate",
  apkController.uploadImage,
  apkController.editSubCategory
);
Router.get(
  "/subcate/:cate",
  apkController.getSubcategories
);
Router.delete("/deleteCate/:cate", apkController.removeCategory);

// Router.post("/signin", apkController.signin);
// Router.get("/getAll", apkController.getAllUsers);
module.exports = Router;
