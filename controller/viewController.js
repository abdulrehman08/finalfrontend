const Apk = require("../models/apkModel");
const Category = require("../models/categoryModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const Visitors = require("../models/visitors.Model");
const path=require('path');
// exports.frontend= (req, res) => {
//   res.sendFile(path.join(__dirname, `../public/apksf/index.html`));
// };
exports.signin= (req, res) => {
  res.clearCookie("jwt");
    res.render("signin",{layout:'logs'});
  };
 exports.signup= (req, res) => {
  res.clearCookie("jwt");
    res.render("signup",{layout:'logs'});
  };
  exports.changePassword= (req, res) => {
    //res.clearCookie("jwt");
      res.render("changePassword",{layout:'logs'});
    };
 exports.editProduct=catchAsync(async (req, res) => {
  const cate=await Category.find().lean();
  res.render("editproduct",  {cate,path:'/img/'}  );
  });
  exports.dashboard= catchAsync( async (req, res) => {
    const {name,role}=req.user;
    let apk;
    let totalApk=0;
    let downloads=0;
  if (role==='admin'){
    apk=await Apk.find().lean();
   downloads=apk.reduce((acc, current, index) => {
    totalApk=index+1;
   return acc+=current.downloads;
   },0);
   res.render("dashboard",{apk,downloads,totalApk});

  }
  else if(role==='user') {
    apk=await Apk.find({creator:name}).lean();
    downloads=apk.reduce((acc, current, index) => {
      totalApk=index+1;
     return acc+=current.downloads;
     },0);
     res.render("userdashboard",{apk,downloads,totalApk});
     }
  });
  exports.products= catchAsync( async (req, res) => {
    const {name,role}=req.user;
    let products;
    let admin={role:false};
  if (role==='admin'){
    products=await Apk.find().lean();
    admin.role=true;
    res.render("products",{products,admin});
  } 
  else if(role==='user'){
    products=await Apk.find({creator:name}).lean();
    res.render("userProducts",{products,admin});
  } 
  });
  exports.reviews= catchAsync( async (req, res) => {
    
      res.render("reviews");
    
  });

  exports.getReviews = catchAsync( async (req, res) => {
    try{
    
      var products=await Apk.find({},{reviews : true , title : true , image : true}).lean();
      var Reviews = new Array();
  
      products.map(product=>{
        return product.reviews.map(review=>{
          Reviews.push({title : product.title , image : product.image ,review})
        })
      })
    
      console.log(Reviews);
      
      res.status(200).json({
        Reviews
      });
    
    }
    catch(err){
   
    console.log(err)
   
    res.status(500).json({
       error : err.message
     })
   
    }
   
  });
  
  exports.subcategory=catchAsync(async (req, res) => {
    res.render("subcategory");
  });
  exports.home=catchAsync(async (req, res) => {
    res.render("home");
  });
  exports.addproducts=catchAsync(async (req, res) => {
    const cate=await Category.find().lean();
    
    console.log({cate});
    res.render("addproducts",{cate,path:'/img/'});
  });
  exports.addslider=catchAsync(async (req, res) => {
    res.render("addslider");
  });
  exports.users= catchAsync( async (req, res) => {
    const {role}=req.user;
    let users;
  if (role==='admin') users=await User.find({role:'user'}).lean();
  else if(role==='user')  res.render("notFound",{layout:'logs'});
    res.render("users",{users});
  });
   exports.category=catchAsync(async (req, res) => {
     const cate=await Category.find().lean();
    res.render("category",{cate});
  });
  exports.addcategory=catchAsync(async (req, res) => {
    res.render("addcategory");
  });
  exports.addSubcategory=catchAsync(async (req, res) => {
    const cate=await Category.find().lean();
    res.render("addsubcategory",{cate});
  });
  exports.editsubcategory=catchAsync(async (req, res) => {
    res.render("editsubcategory");
  });
  exports.profile= catchAsync( async (req, res) => {
  const {name,email}=req.user;
    res.render("profile",{name,email});
  });
  
  exports.getVisitors = async(req,res)=>{
   console.log("visitors")
    try{
      const date =  new Date();
      const month = date.getMonth();
      const day = date.getDate();
      
       let vi = await Visitors.find();
       let visitors = vi[0]
       console.log(visitors)
      if(visitors.today.day!== day && visitors.monthly.month !=month){
        visitors.today.visitors =0
      }
  
      if(visitors.monthly.month != month){
        visitors.monthly.visitors=0
      }
  
  
      // visitors.allVisitors
      if(visitors.today.day!== day || visitors.monthly.month != month){
      visitors = await Visitors.findOneAndUpdate({_id : visitors._id} , {$set : visitors} , {new : true})
      }
    
    
    
    res.status(200).json({
     data : visitors
   })
   }

   catch(err){
     console.log("error",err);
   }

  }
  

  exports.visitors = async(req,res)=>{
    res.render("visitors");
  }
  exports.downloads = async(req,res)=>{
    const {name,role}=req.user;
    console.log(req.user);
    let apk;
    let totalApk=0;
    let downloads=0;
  if (role==='admin'){
    apk=await Apk.find().lean();
   downloads=apk.reduce((acc, current, index) => {
    totalApk=index+1;
   return acc+=current.downloads;
   },0);
   res.render("downloads",{apk,downloads,totalApk});

  }
  // else if(role==='user') {
  //   apk=await Apk.find({creator:name}).lean();
  //   downloads=apk.reduce((acc, current, index) => {
  //     totalApk=index+1;
  //    return acc+=current.downloads;
  //    },0);
  //    res.render("userdashboard",{apk,downloads,totalApk});
  //    }
    
    // res.render("downloads");
  }