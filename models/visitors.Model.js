const mongoose = require("mongoose");
const visitorsModel = new mongoose.Schema({
  today: {
    day :{
        type : String
    },
    visitors:{
        type : Number
    }
  },
  monthly: {
    month :{
        type : String
    },
    visitors:{
        type : Number
    }
  },
  allVisitors : Number
  
  
});
const Visitors = mongoose.model("Visitors", visitorsModel);
module.exports = Visitors;