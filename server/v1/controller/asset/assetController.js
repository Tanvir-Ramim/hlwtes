const axios = require("axios");

const { cloudinary } = require("../../../config/cloudinary");
const appStatus = require("../../../utils/appStatus");
const { tryCatch } = require("../../../utils/tryCatch");
const { Work_Plan } = require("../../../model/asset/assetModel");

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

// workPlan
const getWorkPlan = tryCatch(async (req, res, next) => {
  const { week, month, year } = req.query;
  let query = {};
  if (week) query.week = week;
  if (month) query.month = month;
  if (year) query.year = year;
  const workPlans = await Work_Plan.find(query);
  return appStatus(200, workPlans, req, res, next);
});

const addWorkPlan = tryCatch(async (req, res, next) => {
  try {
    const data = req.body;
    const options = {
      use_filename: true,
      unique_filename: true,
      overwrite: true,
    };
    let url = {};
    console.log(data);
    if (req?.file) {
      const newFile = req.file;
      const result = await cloudinary.uploader.upload(newFile.path, options);
      console.log(result);
      url = {
        url: result.url,
        public_id: result.public_id,
      };
    }
    const workPlan = new Work_Plan({
      ...data,
      url,
    });

    const savedWorkPlan = await workPlan.save();
    return res.status(201).json({
      success: true,
      data: savedWorkPlan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to upload Work Plan",
      error: error.message,
    });
  }
});

const workPlanDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const options = {
      use_filename: true,
      unique_filename: true,
      overwrite: true,
    };
    const deletedLeave = await Work_Plan.findByIdAndDelete(id);

    if (!deletedLeave) {
      return res.status(404).json({
        success: false,
        message: "Work Plan  not found.",
      });
    } else {
      if (deletedLeave?.url.public_id) {
        await cloudinary.uploader.destroy(deletedLeave.url.public_id, options);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Work Plan deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete ",
      error: error.message,
    });
  }
};

module.exports = {
  getCloudFile,
  serachCloudFile,
  delAsset,
  getWorkPlan,
  addWorkPlan,
  workPlanDelete,
};

// module.exports = { getCloudFile, serachCloudFile, delAsset,getWorkPlan };
