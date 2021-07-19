const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Category = require("../models/categoryModel");
const Apk = require("../models/apkModel");
const multer = require("multer");
const path=require('path');
const Statics = require("../models/staticsModel");
const { text } = require("body-parser");
// var public = path.join(__dirname, '../public/apk/');


// multiple files uploads
const multipleImagesStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/");
  },

  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + file.originalname);
  },
});
const multipleImagesFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Please upload images", 400), false);
  }
};
const multiImageUpload = multer({
  storage: multipleImagesStorage,
  fileFilter: multipleImagesFilter,
});
exports.uploadMultiImages = multiImageUpload;
// save to the database in image array
exports.saveImages = catchAsync(async (req, res, next) => {
  req.body.images = [];
  if (req.files) {
    req.files.map(async (file) => {
      req.body.images.push(file.filename);
    });
  }
  next();
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/apk/");
  },
  filename: (req, file, cb) => {
    cb(null, `apk-${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("application")) {
    cb(null, true);
  } else {
    cb(new AppError("No apk! Please upload only apk file", 400), false);
  }
};
// const imageStorage = multer.memoryStorage();

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/");
  },
  filename: (req, file, cb) => {
    // req.body.image= `image-${req.user.id}-${Date.now()}.jpeg`;
    cb(null, `image-${req.user.id}-${Date.now()}.jpeg`);
  },
});
// validate for image
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("No image! Please upload only images", 400), false);
  }
};

const uploadFile = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
});

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
});

exports.uploadImage = uploadImage.single("image");

exports.uploadFile = uploadFile.single("file");

exports.uploadFileHandler = catchAsync(async (req, res) => {
  const filename = req.file ? req.file.filename : "No_file.apk";
  // console.log({apk:req.file});
  const title = req.params.title;
  const result = await Apk.findOneAndUpdate({ title }, { file: filename });
  res.status(201).json({
    data: result,
  });
});

exports.uploadImagesHandler = catchAsync(async (req, res) => {
  const title = req.params.title;
  const images = req.body.images;
  const result = await Apk.findOneAndUpdate({ title }, { images });
  res.status(201).json({
    data: result,
  });
});

exports.updateStatics=catchAsync(async (req, res) => {
      const filename = req.params.image;
await Statics.findOneAndUpdate({title:"client"},{image:filename});
console.log({filename});
res.status(200).json({
  message:"statics updated successfully"
})
});

exports.updateApk= catchAsync(async (req, res) => {
  console.log( req.body ,'abdulrehman');
  const user = req.user;
  const {apkTitle}=  req.params;
    const actions=user.role=='admin'? 'approved':'pending';
    const hot = req.body.hot == "true";
    const top = req.body.top == "true";
    const feature = req.body.feature == "true";
    const trending = req.body.trending == "true";
    // const filename = req.file.filename;
    const {
      requirements,
      category,
      subCategory,
      tags,
      title,
      developer,
      description,
      version,
      // website,
    } = req.body;
    // console.log({ apkTitle });
    // if (!title )
    //   return next(new AppError("please enter complete detail", 404));
    const apk = await Apk.findOneAndUpdate({title:apkTitle},{
      creator: req.user.name,
      actions,
      user,
      version,
      category,
      subCategory,
      requirements,
      title,
      tags,
      developer,
      // image: filename,
      description,
      hot,
      // officialWebsite: website,
      editorChoice: feature,
      trending: trending,
      top,
    });
    if(req.file)
    await Apk.findOneAndUpdate({title:apkTitle},{image: req.file.filename});
    res.status(201).json({
      data: apk,
    });
});
  
exports.addApk = catchAsync(async (req, res, next) => {
// console.log({ body: req.body, image: req.file });
const user = req.user;
  const actions=user.role=='admin'? 'approved':'pending';
  const hot = req.body.hot == "true";
  const top = req.body.top == "true";
  const feature = req.body.feature == "true";
  const trending = req.body.trending == "true";
  const filename = req.file.filename;
  const {
    requirements,
    category,
    subCategory,
    tags,
    title,
    developer,
    description,
    version,
    website,
  } = req.body;
  console.log({ description });
  if (!title || !filename)
    return next(new AppError("please enter complete detail", 404));
  const apk = await Apk.create({
    creator: req.user.name,
    actions,
    user,
    version,
    category,
    subCategory,
    requirements,
    title,
    tags,
    developer,
    image: filename,
    description,
    hot,
    officialWebsite: website,
    editorChoice: feature,
    trending: trending,
    top,
  });
  res.status(201).json({
    data: apk,
  });
});

exports.getAllApk = catchAsync(async (req, res) => {
  const allApk = await Apk.find();
  res.status(201).json({
    data: allApk,
  });
});

exports.allApprovedApk= catchAsync(async (req, res) => {
  const allApk = await Apk.find({actions:'approved'});
  res.status(201).json({
  data: allApk,
  });
});

exports.getApk= catchAsync(async (req, res) => {
  const apk = await Apk.findOne({actions:'approved',title:req.params.title});
  
  let Reviews = apk.reviews;
  let total_reviews = Reviews.length;

  let Rating_Count = {one : 0 , two : 0 , three : 0 , four : 0, five : 0};
  let average_rating=0;
  
  Reviews.forEach(Review => {
    average_rating+=Review.rating
    if(Review.rating ==1)
    {
      Rating_Count.one+=1
    }if(Review.rating ==2)
    {
      Rating_Count.two+=1
    }if(Review.rating ==3)
    {
      Rating_Count.three+=1
    }if(Review.rating ==4)
    {
      Rating_Count.four+=1
    }if(Review.rating ==5)
    {
      Rating_Count.five+=1
    }
  })
  average_rating = average_rating/total_reviews
  average_ratio = (average_rating/5)*100;
  Rating_ratio = {one : (Rating_Count.one/total_reviews)*100 , 
                  two : (Rating_Count.two/total_reviews)*100 ,
                  three : (Rating_Count.three/total_reviews)*100 ,
                  four : (Rating_Count.four/total_reviews)*100 ,
                  five : (Rating_Count.five/total_reviews)*100 , }

  console.log("Total Reviews" , total_reviews);
  console.log("Average Rating" , average_rating);
  console.log("Rating Count" , Rating_Count);
  console.log("Rating Ratio" , Rating_ratio);
  console.log("Average Ratio" , average_ratio);
  
  
  res.status(200).json({
    data: apk,
    total_reviews,
    average_rating : Math.round((average_rating + Number.EPSILON) * 100) / 100,
    Rating_ratio,
    Rating_Count,
    average_ratio
  });

});

exports.getSameCateApps=catchAsync(async (req, res) => {
  console.log({cate:req.params.cate});
  const apk = await Apk.find({actions:'approved',subCategory:req.params.cate});
  res.status(200).json({
    data: apk,
  });
});

exports.trendingApks=catchAsync(async (req, res) => {
  const apk = await Apk.find({actions:'approved',trending:true});
  res.status(200).json({
    data: apk,
  });
});

exports.papularApks= catchAsync(async (req, res) => {
  const allApk = await Apk.find({actions:'approved',createdAt: { $gt: new Date(Date.now() - 24*60*60 * 1000) }});
  res.status(201).json({
    data: allApk,
  });
});

exports.deleteApk = catchAsync(async (req, res) => {
  const title = req.params.title;
  const rs = await Apk.findOneAndRemove({ title });
  console.log({ title, rs });
  const data = await Apk.find();
  res.status(201).json({
    data,
  });
});

exports.updateActions = catchAsync(async (req, res) => {
  await Apk.findOneAndUpdate(
    { title: req.body.title },
    { actions: req.body.actions }
  );
  console.log({title:req.body.title,actions:req.body.actions});
  const updatedApk = await Apk.findOne({ title: req.body.title });
  res.status(201).json({
    data: updatedApk,
  });
});

exports.addCategory = catchAsync(async (req, res) => {
  const { category, slug } = req.body;
  await Category.create({
    category,
    slug,
  });
  const allCate = await Category.find();
  res.status(201).json({
    data: allCate,
  });

  // const apk = await Category.findOne({ "category.name": "games" });
  // console.log(apk);
  // const [...subCate] = apk.category.subCategory;
  // subCate.push("Fun");
  // const result = await Category.findByIdAndUpdate(apk._id, {
  //   "category.subCategory": subCate,
  // // });
  // const apk = await Category.find();
  // const names = apk.map((e) => e.category.name);
});

exports.getSubcategories=catchAsync(async (req, res) => {
  const data = await Category.findOne({category:req.params.cate});
  res.status(200).json({ data });
});

exports.deleteSubcategory=catchAsync(async (req, res) => {
  const data = await Category.findOne({category:req.params.cate});
  const rmc=data.subCategory.filter(d=>d.name!==req.body.name);
  // console.log({name:req.body.name});
  await Category.findOneAndUpdate({category:req.params.cate},{subCategory:rmc});
  res.status(200).json({ data ,rmc});
});

exports.addSubCategory = catchAsync(async (req, res) => {
  console.log(req.body);
  const { cate } = req.params;
  const { slug, subCate } = req.body;
  const filename = req.file.filename;
  const newSubCate = { name: subCate, image: filename, slug: slug };
  const category = await Category.findOne({ category: cate });
  category.subCategory.push(newSubCate);
  await Category.findByIdAndUpdate(category._id, {
    subCategory: category.subCategory,
  });
  const allCate = await Category.find();
  res.status(201).json({
    data: allCate,
  });
});


exports.editSubCategory = catchAsync(async (req, res) => {

  console.log("editing");
  
  const { cate,subcate } = req.params;
  
  const { slug } = req.body;
  const filename = req.file ? req.file.filename:null;
  
  const newSubCate = { name: subcate, slug: slug };
  console.log(newSubCate);
  var SubCategory = await Category.findOne({ category: cate  , "subCategory.name" : subcate} , {"subCategory.$" : true , _id : false});
  console.log("SubCategory",SubCategory)
  UpdatedSubCategory = {
    ...newSubCate,
    image : filename ? filename : SubCategory.subCategory[0].image
  }
  console.log("SubCategory",UpdatedSubCategory)
  
  const updateResult = await Category.findOneAndUpdate({ category: cate  , "subCategory.name" : subcate} , {$set : {"subCategory.$" : UpdatedSubCategory}} , {new : true})

  const allCate = await Category.find();
  res.status(201).json({
    allCate,
    message : "SubCategory  Updated "
  });

});


exports.removeCategory = catchAsync(async (req, res) => {
  const cate = req.params.cate;
  await Category.findOneAndRemove({ category: cate });
  const allCate = await Category.find();
  res.status(201).json({
    data: allCate,
  });
});

exports.getAllCate = catchAsync(async (req, res) => {
  const data = await Category.find();
  res.status(200).json({ data });
});

exports.getOneApk = catchAsync(async (req, res) => {
  const {title}=req.params;
console.log({title});
  const data = await Apk.findOne({title});
  console.log("APK" , data);
  res.status(200).json({ data });

});

exports.getStates = catchAsync(async (req, res) => {
  const data = await Category.find();
  res.status(200).json({ data });
});

exports.getDownload=catchAsync(async (req, res) => {
  const {title}=req.params;
console.log({title});
const {file,downloads} = await Apk.findOne({title});
await Apk.findOneAndUpdate({title},{downloads:downloads+1})
console.log({downloads});
  const readyFile = path.join(__dirname, `../public/apk/${file}`);
  res.download(readyFile);
  // console.log('dowloaded');
  // res.sendFile(readyFile);
});

exports.getcategory = catchAsync(async (req, res) => {
  const category = req.params.category;
  console.log({category});
  const data = await Category.findOne({ category });
  console.log({data});
  res.status(200).json({ data });
});

exports.addComment = async (req,res)=>{
   try{
  const [{user , text ,  rating} , {title }] = [req.body , req.params];
  let date = new Date();
//  console.log(req.body);
  let review = {
     comment : {
       text  : req.body.text,
       name : user.name,
       time : date
     },
     reply :{},
     rating
  }
console.log(review)
  const result = await Apk.findOneAndUpdate({title : title} , {$push : {reviews : review}} , {new : true}).lean().exec();
  console.log(result);
  
  res.status(204).json({
        hasError : false
  })

}
  catch(err)
  {
    console.log(err);
    res.status(500).json({
      hasError : true,
      err
    })
  }
}

exports.replyToComment = async (req,res)=>{
  try{
 const [{user , text } , {title , reviewId }] = [req.body , req.params];
 console.log(title , reviewId)
 let date = new Date();
//  console.log(req.body);
 let reply = {
      text,
      name : user.name ? user.name : "Author" ,
      time : date
    }
    let titl = title.replace("_" , " ");
 console.log(reply)
  const result = await Apk.findOneAndUpdate({title : titl , "reviews._id" : reviewId} , {$set : {"reviews.$.reply" : reply}} , {new : true}).lean().exec();
//  const result = await Apk.findOne({title : titl , "reviews._id" : reviewId})// , {$set : {"reviews.$.reply" : reply}} , {new : true}).lean().exec();

  console.log(result);
 
 res.status(204).json({
       hasError : false
 })

}
 catch(err)
 {
   console.log(err);
   res.status(500).json({
     hasError : true,
     err
   })
 }
}

/////////////////

// const multerStorage = multer.memoryStorage();
// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image") || file.mimetype.startsWith("application")) {
//     cb(null, true);
//   } else {
//     cb("Please upload only image or apks", false);
//   }
// };

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter
// });
// const uploadFiles = upload.array("images", 10); // limit to 10 images
// const uploadImages = (req, res, next) => {
//   uploadFiles(req, res, err => {
//     if (err instanceof multer.MulterError) { // A Multer error occurred when uploading.
//       if (err.code === "LIMIT_UNEXPECTED_FILE") { // Too many images exceeding the allowed limit
// console.log(err);      }
//     } else if (err) {
//       console.log(err);
//       // handle other errors
//     }

//     // Everything is ok.
//     next();
//   });
// };
// const resizeImages = async (req, res, next) => {
//   if (!req.files) return next();
//   req.body.images = [];
//   await Promise.all(
//     req.files.map(async file => {
//       const newFilename = ...;

//       await sharp(file.buffer)
//         .resize(640, 320)
//         .toFormat("jpeg")
//         .jpeg({ quality: 90 })
//         .toFile(`upload/${newFilename}`);

//       req.body.images.push(newFilename);
//     })
//   );

//   next();
// };
/////////////////
