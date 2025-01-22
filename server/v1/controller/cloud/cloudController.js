const axios = require("axios");
const appStatus = require("../../../utils/appStatus");
const { cloudinary } = require("../../../config/cloudinary");
const tryCatch = require("../../../utils/tryCatch");


const getCloudFile = async (req, res, next) => {
  try {
    const response = await axios.get(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/image`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            process.env.CLOUDINARY_API_KEY +
              ":" +
              process.env.CLOUDINARY_SECRET_KEY
          ).toString("base64")}`,
        },
      }
    );
    const meow = response.data.resources.map((resource) => {
      const { width, height } = resource;
      return {
        uploadDate: resource.uploaded_at,
        publi_id: resource.public_id,
        url: resource.secure_url,
        width,
        height,
      };
    });
    res.status(200).json({
      meow,
      total: meow.length,
      nextCursor: response.data.next_cursor,
    });
  } catch (error) {
    console.log(error);
  }
};
const serachCloudFile = async (req, res, next) => {
  try {
    const paramString = req.params.nextCursor;
    // if (options.nextCursor) {
    //   params.next_cursor = options.nextCursor;
    //   delete params.nextCursor;
    // }

    const response = await axios.get(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/search?${paramString}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            process.env.CLOUDINARY_API_KEY +
              ":" +
              process.env.CLOUDINARY_SECRET_KEY
          ).toString("base64")}`,
        },
      }
    );
    const meow = response.data.resources.map((resource) => {
      const { width, height } = resource;
      return {
        uploadDate: resource.uploaded_at,
        publi_id: resource.public_id,
        url: resource.secure_url,
        width,
        height,
      };
    });

    res.status(200).json({
      meow,
      total: response.data.total_count,
      nextCursor: response.data.next_cursor,
    });
  } catch (error) {
    console.log(error);
  }
};
const delAsset = tryCatch(async (req, res, next) => {
  const public_id = req.params.public_id;
  const options = {
    use_filename: true,
    unique_filename: true,
    overwrite: true,
  };
  await cloudinary.uploader.destroy(public_id, options);
  return appStatus(204, ``, req, res, next);
});

module.exports = {
  getCloudFile,
  serachCloudFile,
  delAsset,
};
