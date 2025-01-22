const Brand = require("../model/brandModel");
const Category = require("../model/categoryModel");
const Product = require("../model/productModel");
const appError = require("http-errors");

const iscompare = async (req, res, next) => {
  try {
    const { category1, category2, product1, product2 } = req.params;

    if (category1 !== category2) {
      return next(
        appError(
          406,
          `${category1}, ${category2} are not compareable , different Category!!!`
        )
      );
    }
    if (category1 === category2 && product1 === product2) {
      return next(
        appError(
          406,
          `${category1}, ${category2} are not compareable , Same Product!!!`
        )
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = iscompare;
