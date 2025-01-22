const Category = require("../model/categoryModel");
const appError = require("http-errors");

const isUnique = async (req, res, next) => {
  try {
    const ifThere = await Category.findOne({
      categoryName: req.body.categoryName,
      brandName: req.params.brandName,
    });
    if (ifThere) {
      return next(appError(406, "Already there"));
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isUnique;
