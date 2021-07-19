const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    unique: [true, "Choose another category this is already exits"],
    required: true,
  },
  slug: {
    type: String,
    required: true,
  }, 
  static: {
    type: Boolean,
    default: false,
  },
  subCategory: [{name:String, image:String,slug:String}],
});
const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
