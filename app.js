const express = require("express");
const app = express();
const userRouts = require("./routs/userRouts");
const viewRouts = require("./routs/viewRouts");
const apkRouts = require("./routs/apkRouts");
const handlebars = require("express-handlebars");
const path=require('path')
const hbr = require("handlebars");
const cors=require('cors');
const cookie = require("cookie-parser");
const morgan = require("morgan");
// 

app.use((req,res,next)=>{
console.log(req.headers.authorization);
  // console.log({
  //   user:req.user?req.user.role:'no user',
  //   cookie:req.headers.cookie
  // }); 
next();
});
app.set("view engine", "hbs");
app.engine(
  "hbs",
  handlebars({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    defaultLayout: "index",
    extname: "hbs",
  })
);
app.use(express.json());
app.use(cors({origin:true, credentials: true}));

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,"public")));
app.use(cookie());

// app.use((req,res,next)=>{
//   console.log("hello");
//   next();
//   });

app.patch('/' , (req,res)=>{
  console.log("Request")
})
app.use("/apk", apkRouts);
app.use("/user", userRouts);
app.use("/", viewRouts);
// app.get('*',(re,res)=>{
//   res.status(200).json({data:[{data:"rout not found"}]});
// });

hbr.registerHelper("createCate", function (row) {
  return row;
});

hbr.registerHelper("navbar", function(user) {
  if (!user) {
    return `
    <li class="nav-item">
    <a href="dashboard" class="nav-link active"><i
        class="icon-home4"></i><span>Dashboard</span></a>
  </li>
  <li class="nav-item">
							<a href="products" class="nav-link "><i class="icon-unfold"></i><span>Apk's</span></a>
						</li>
  `
  }else if (user.role=='admin') {
    return `
    <li class="nav-item">
							<a href="dashboard  " class="nav-link active"><i
									class="icon-home4"></i><span>Dashboard</span></a>
						</li>
						<li class="nav-item ">
							<a href="home  " class="nav-link"><i class="icon-home2"></i> <span>Home</span></a>
						</li>
						<li class="nav-item ">
							<a href="category  " class="nav-link"><i class="icon-list-unordered"></i>
								<span>Categories</span></a>
						</li>
						<li class="nav-item">
							<a href="products" class="nav-link "><i class="icon-unfold"></i><span>Apk's</span></a>
						</li>
						<li class="nav-item ">
							<a href="users" class="nav-link"><i class="icon-people"></i> <span>Staff</span></a>
						</li>
            <li class="nav-item ">
							<a href="users" class="nav-link"><i class="icon-people"></i> <span>Users</span></a>
						</li>
            <li class="nav-item ">
							<a href="reviews" class="nav-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
            </svg>
              
              <span style="margin-left : 8%;">Reviews</span></a>
						</li>
            <li class="nav-item ">
							<a href="downloads" class="nav-link">
              
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
              </svg>
               
              <span style="margin-left : 8%;">Downloads</span></a>
						</li>
            <li class="nav-item ">
							<a href="visitors" class="nav-link">
              
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="19" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
              <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
              <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
              </svg> 
            
            <span style="margin-left : 8%;">Visitors</span></a>
						</li>
    `;
     }
    else{
    return `
    <li class="nav-item">
    <a href="dashboard" class="nav-link active"><i
        class="icon-home4"></i><span>Dashboard</span></a>
  </li>
  <li class="nav-item">
							<a href="products" class="nav-link "><i class="icon-unfold"></i><span>Apk's</span></a>
						</li>
  `
  }
});

hbr.registerHelper("status", function(status) {
const role=status;
console.log({role});
  if (role=='admin') {
    return `
    <td style="width:25%">
    <form id="status" name="status">
      <label for="pending">Pending</label>
<input id="pending" value="aa" type="radio" name="pending"/>
        <label for="approved">Approved</label>
<input id="approved" value="bb" type="radio" name="approved"/>
        <label for="rejected">Rejected</label>
<input id="rejected" value="cc" type="radio" name="rejected" checked/>
</form>
  </td>
    `;
     }
    else{
    return `
    <td>
    <p>${status}</p>
  </td>
  `
  }    
});

hbr.registerHelper('json', function(context) {
  return JSON.stringify(context).replace(/"/g, '&quot;');
});

hbr.registerHelper('check', function(item) {
if (item.actions==='approved') {
  return `checked`;
} else {
  return null;
}
});

hbr.registerHelper("inc",(value , options)=>{
  return parseInt(value) +1
})

module.exports = app;
