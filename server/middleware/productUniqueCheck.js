const { NotFoundError, NotAcceptable } = require("../error/customError");
const { Product } = require("../model/product/productModel");

const isUnique = async (req, res, next) => {
  try {
    const { brand, category, title } = req.body;

    const ifThere = await Product.findOne({
      brand,
      category,
      title,
    });

    if (ifThere) {
      return next(new NotAcceptable("Already Exist"));
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { isUnique };
