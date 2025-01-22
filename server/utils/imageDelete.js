const { InternalServerError } = require("../error/customError");
const { cloudinary } = require("../config/cloudinary");
const image_del = async (public_id, next) => {
  const options = {
    use_filename: true,
    unique_filename: true,
    overwrite: true,
  };
  try {
    await cloudinary.uploader.destroy(public_id, options);
    next();
  } catch (error) {
    throw new InternalServerError(
      `${error.message}`,
      "Check Cloudinary Service"
    );
  }
};

module.exports = { image_del };
