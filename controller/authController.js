const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const Email = require("../utils/email");
const app = require("../app");

const signToken = (user) => {
  const { name, role, email, _id: id } = user;
  return jwt.sign(
    {
      id,
      name,
      role,
      email,
    },
    // this jwt secret should  be greater then 32 alphabets
    process.env.JWT_SECRET,
    {
      // this can be 90d ,30h,50m ,20s
      expiresIn: process.env.JWT_EXPIRE_IN,
    }
  );
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user);
  const cookieOptions = {
    expires: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    httpOnly: false,
  };
  // if (process.env.NODE_ENV == "production") {
  //   cookieOptions.secure = true;
  // }
  // cookieOptions.secure = true;
  // name of the cookie jwt
  // cookie data is token
  // cookie properties are cookieOptions
  // res.cookie('jwt', 'tobi', { domain: '.example.com', path: '/admin', secure: true });
  res.cookie("jwt", token, cookieOptions);
  // res.cookie('name',"abdulrehman",cookieOptions)
  // removing new created user password
  user.password = undefined;
  // res.header('x-token', token);
  //   .header('access-control-expose-headers', 'x-token')
  // if (app.locals)  app.locals.user = user;
  res.locals.user=user;
  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    // role: req.body.role,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    staff:req.body.staff
  });
  console.log("New User",newUser);
  createAndSendToken(newUser, 200, res);
});

exports.signin = catchAsync(async (req, res, next) => {
  const { name, password } = req.body;
  console.log({body:req.body});
  if (!name || !password)
    return next(new AppError("please enter complete detail", 404));
  console.log("Name" , name);
    const user = await User.findOne({ name }).select("+password");
  console.log("User" , user);
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("Incorrect username or password", 403));
  createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {

  // console.log(req.cookies);
  let token
  // 1 ) check the token have user
  if (
    req.headers.authorization
    //  &&
    // req.headers.authorization.startsWith("Bearer")
  ) {
    // token = req.headers.authorization.split(" ")[1];
    token=req.headers.authorization.substr(4);
    console.log("header")
    // console.log({mytoken:token});

  } else if (req.headers.cookie) {
    // console.log({cookie:req.headers.cookie});
    // console.log({subcookie:req.headers.cookie.substr(4)});
    console.log("cookies")
    token =   req.headers.cookie.substr(4);
    console.log({mytoken:token});
  } 
  if(!token){
    return next(
      new AppError("You are not login please login and get access", 401)
    );
  }
  // console.log(req.cookies)
  // if(req.cookies.jwt){
  //   token = req.cookies.jwt;
  // }
  
  
  // console.log(req.cookies.jwt);
  // console.log(req.headers.authorization);
  // 2) verification of token
  // console.log("Protector");
  // console.log(token);
  // console.log("Protector");
  //  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOWFmZWExZTJjNTMyMDAxNWMwZjZjZCIsIm5hbWUiOiJBQkRVTFJFSE1BTiIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJpYXQiOjE2MjUzMTEwMzcsImV4cCI6MTYyODc2NzAzN30.MaSj7IFmA9ol0QY2ZoRsxL628aHhG0sz1_NOEhqnuZQ"
  // console.log(token);
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  
  // if verification if pass then decoded value  like below
  // decoded={
  //   id: '5f08ac1c6aa46f0df451d8db',
  //   iat: 1594403926,
  //   exp: 1598291926
  //  }
  // 3) check user still exist not delete
  // console.log("current user");
  // console.log(decoded);
  // console.log("current user");
  let currentUser = await User.findOne({name:decoded.name});
  if (!currentUser)
    return next(
      new AppError("No user belong to this token please try again", 401)
    );
  // 4) check if user change the password after generating token
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently change password please login again", 401)
    );
  }
  // Access granted to the next rout
  // see blew function where req.user used
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.restrictTo = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      next(new AppError("You do not  have permission to do this action", 403));
    }
    next();
  };
};

exports.logout = (req, res) => {
  res.cookie("jwt", "logging out", {
    expires: new Date(Date.now() + 1),
    // httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const user = await User.findById(req.user._id).select("+password");
  if (
    !user ||
    !(await user.correctPassword(req.body.passwordCurrent, user.password))
  ) {
    return next(new AppError("Incorrect password ...!!!", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  req.user=user;
  console.log("After" , user)
  createAndSendToken(user, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
    active: true,
  });
  if (!user) {
    return next(new AppError("There is no user with that email ..!!!", 401));
  }
  // 2)  create new random  token for reset password
  const resetToken = user.createResetPasswordToken();
  // Nobody know every thing
  // this is tour off user model validator
  await user.save({
    validator: false,
  });
  // 3) Send it to user's email
  try {
    const resetURL = `${process.env.FRONT_URL}/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();
    // send response to user
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(err);
    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

// RESET PASSWORD MODULES
exports.resetPassword = catchAsync(async (req, res, next) => {
  // // Get user based on token
  // console.log(req.body);
  // console.log(req.params.token);
  // const hashedPass = Crypto
  //   .createHash("sha256")
  //   .update(req.params.token)
  //   .digest("hex");
  // check the user is valid and not expired
  let user;
  user = await User.findOne({
    // passwordResetToken: hashedPass,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });
  if (!user) {
    user = await User.findOne({
      // passwordResetToken: hashedPass,
      passwordResetExpires: {
        $gt: Date.now(),
      },
    });
  }
  if (!user) {
    return next(new AppError("Token is invalid or has expired"));
  }
  // There is token is not expires and there is user set new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({
    validator: true,
  });
  req.user=user;
  createAndSendToken(user, 200, res);
  // update changePasswordAt property for user
  // login the user with JWT
});
