const ApiFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");

exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    const filter = req.params.userId ? { user: req.params.userId } : {};
    const features = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await features.query;
    // console.log(`Filtered docs: ${JSON.stringify(docs)}`);

    res.status(200).json({
      status: "success",
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.findById(req.params.id);
    console.log(`Doc is ${doc}`);

    if (!doc) {
      return res.status(404).json({
        status: "failed",
        message: "No document found with that ID",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return res.status(404).json({
        status: "failed",
        message: "No document found with that ID",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({
        status: "failed",
        message: "No doc found with that ID",
      });
    }
    console.log(`Deleted document is ${doc}`);

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
