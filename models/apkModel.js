const mongoose = require("mongoose");
// this comment is for heroku casing error
const apkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "apk must be belong to user"],
    },
    category: {
      type: String,
      required: [true, "category can`t be empty"],
    },
    subCategory: {
      type: String,
      required: [true, "please provide the transaction type"],
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    requirements: String,
    creator: String,
    actions: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
    trending: {
      type: Boolean,
      default: false,
    },
    staff: {
      type: Boolean,
      default: false,
    },
    editorChoice: {
      type: Boolean,
      default: false,
    },
    hot: {
      type: Boolean,
      default: false,
    },
    top: {
      type: Boolean,
      default: false,
    },
    updateAt: {
      type: String,
      default: new Date(),
    },
    title: {
      type: String,
      required: [true, "apk title is required"],
      unique: [true, "apk title must be unique"],
    },
    developer: {
      type: String,
      required: [true, "apk developer name is required"],
    },

    description: {
      type: String,
      required: [true, "apk description is required"],
    },
    image: {
      type: String,
      required: [true, "apk image  is required"],
    },
    version: {
      type: String,
      default: "0.0.1",
    },
    tags:String,
    images: [String],
    downloads: {
      type: Number,
      default: 0,
    },
    file: {
      type: String,
      default: "No_file.apk",
    },
    officialWebsite: {
      type: String,
      required: [false, "apk officialWebsite is required"],
    },
    reviews :[{
      comment :{
        text:{
          type : String,
          required : true
        },
        name : {
          type : String,
          required : true
        },
        time : {
          type : Date,
          required : true
        }
      },
      reply : {
          text : {
            type : String,
            required : true
          },
          name : {
            type : String,
            default : "Author"
          },
          time :{
            type : Date,
            required : true
          } 
        
      },
      rating :{
        type : Number
      }
    }]
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// this compound index is used for one user only can create one review one Tour
// reviewSchema.index({
//   tour: 1,
//   user: 1,
// }, {
//   unique: true,
// });
apkSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});

/*
// blow all about calculating average and numbers of Tour ratings

// this function get all saved reviews and apply aggregation on them
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([{
      $match: {
        tour: tourId,
      },
    },
    {
      $group: {
        _id: '$tour',
        nRating: {
          $sum: 1,
        },
        avgRating: {
          $avg: '$rating',
        },
      },
    },
  ]);
  // console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// this post run after creating and saving document
reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

// findByIdAndUpdate
// findByIdAndDelete
// this pre middleware only used for getting current tour
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.Rew = await this.findOne();
  next();
});
// this post run after deleting and updating document
reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.Rew.constructor.calcAverageRatings(this.Rew.tour._id);
});
*/
const Apk = mongoose.model("Apk", apkSchema);
module.exports = Apk;
