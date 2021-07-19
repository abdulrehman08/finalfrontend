const Slider = require("../models/sliderModel");
const catchAsync = require("../utils/catchAsync");
const Visitors = require("../models/visitors.Model");
exports.addSlider = catchAsync(async (req, res) => {
    console.log(req.body);
    const { title } = req.body;
    const filename = req.file.filename;
    const slider = await Slider.create({ title,image:filename });
    res.status(201).json({
      data: slider,
    });
  });
  exports.deleteSlider = catchAsync(async (req, res) => {
    console.log(req.body);
    const { title } = req.body;
    const data = await Slider.findOneAndDelete({ title });
    res.status(200).json({
      data: data,
    });
  });
  exports.getAll = catchAsync(async (req, res) => {
    const data = await Slider.find();
    res.status(200).json({
      data: data,
    });
  });

  exports.updateVisitors = async(req, res)=>{
    const date =  new Date();
    const month = date.getMonth();
    const day = date.getDate();
    
     let vi = await Visitors.find();
     let visitors = vi[0]
     console.log(visitors)
    
    if(visitors.monthly.month == month){
       visitors.monthly.visitors+=1
       
    }

    else{
      visitors.monthly.month = month
      visitors.monthly.visitors=1
      visitors.today.day = day
      visitors.today.visitors=1
    }
    
    if(visitors.today.day == day ){
      visitors.today.visitors+=1
    }
    else{
      visitors.today.day = day
      visitors.today.visitors=1
    }


    visitors.allVisitors+=1

    const result = await Visitors.findOneAndUpdate({_id : visitors._id} , {$set : visitors} , {new : true})
    

  }

  exports.getAllActive = catchAsync(async (req, res) => {
    
    const slider = await Slider.find({ active:true });
    res.status(201).json({
      data: slider,
    });
  });

  exports.activeSwitch = catchAsync(async (req, res) => {
    const { title } = req.params;
    console.log(title);
        const slider=await Slider.findOne({title});
        // console.log({actives:slider.active});
    const status=slider.active?false:true;
    const sl = await Slider.findByIdAndUpdate({_id:slider._id},{ active:status });
    res.status(201).json({
      data: sl,
    });
  });
  