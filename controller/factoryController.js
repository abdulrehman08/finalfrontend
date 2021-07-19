const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.deleteOne = module => catchAsync(async (req, res, next) => {
    const doc = await module.findByIdAndDelete(req.params.id).where({admin:req.user.id});
    if (!doc) {
        return next(new AppError('NO document found with that ID', 404));
    }
    res.status(204).json({
        message: 'success',
        data: null
    });
});

exports.updateOne = module => catchAsync(async (req, res, next) => {
    const doc = await module.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!doc) {
        return next(new AppError('NO document found with that ID', 404));
    }
    res.status(200).json({
        message: 'success',
        data: doc
    });
});

exports.createOne = model => catchAsync(async (req, res, next) => {
    const doc = await model.create(req.body);
    res.status(201).json({
        message: 'success',
        data: doc
    });
});

exports.getOne = (model, popOptions) => catchAsync(async (req, res, next) => {
    let query = model.findById(req.params.id).where({admin:req.user.id});
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
        return next(new AppError('NO document found with that ID', 404));
    }
    res.status(200).json({
        message: 'success',
        data: doc
    });
});
// this comment is for heroku casing error
exports.getAll = model => catchAsync(async (req, res, next) => {
    // To allow the nested GET reviews on Tour (hack)
       const features = new APIFeatures(model.find({admin:req.user.id,active:true}), req.query)
        .filters()
        .limitFields()
        .sort()
        .pagination();
    // const doc = await features.query.explain();
    const doc = await features.query;
    // .populate({
    //     path: 'guides',
    //     select: '-__v  -passwordChangedAt',
    // })
    // .populate({
    //     path: 'reviews',
    //     select: '_id review rating -tour',
    // });
    // }).explain(); This only for indexing
    res.status(200).json({
        message: 'success',
        results: doc.length,
        data: doc,
    });
});