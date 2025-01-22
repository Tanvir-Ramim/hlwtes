const { cloudinary } = require("../../../config/cloudinary");
const { NotAcceptable, NotFoundError } = require("../../../error/customError");
const { Asset } = require("../../../model/asset/assetModel");
const appStatus = require("../../../utils/appStatus");
const { tryCatch } = require("../../../utils/tryCatch");

const addContent = tryCatch(async (req, res, next) => {
  const data = req.body;
  const options = {
    use_filename: true,
    unique_filename: true,
    overwrite: true,
  };
  let url = {};
  if (req?.file) {
    const thumbFile = req.file;
    const result = await cloudinary.uploader.upload(thumbFile.path, options);
    url = {
      url: result.url,
      public_id: result.public_id,
    };
  }

  const new_ass = new Asset({
    ...data,
    url,
  });

  const save_ass = await new_ass.save();

  if (!save_ass) {
    return next(new NotAcceptable("Try again"));
  }
  appStatus(201, "", req, res, next);
});

const getAss = tryCatch(async (req, res, next) => {
  const { asset_type, position } = req.query;
  const searchQuery = {};

  if (
    typeof asset_type === "string" &&
    asset_type !== undefined &&
    asset_type !== ""
  ) {
    searchQuery.asset_type = reg(asset_type);
  }
  if (
    typeof position === "string" &&
    position !== undefined &&
    position !== ""
  ) {
    searchQuery.position = reg(position);
  }

  const asset_shr = await Asset.find(searchQuery).sort({ createdAt: -1 });

  if (!asset_shr) {
    return next(new NotAcceptable("Not Found"));
  }
  appStatus(200, asset_shr, req, res, next);
});

const delAss = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const del_ass = await Asset.findByIdAndDelete(id);

  if (!del_ass) {
    return next(new NotFoundError("Try again"));
  }
  // Delete from Cloudinary
  const options = {
    use_filename: true,
    unique_filename: true,
    overwrite: true,
  };
  if (del_ass.url.url !== "") {
    await cloudinary.uploader.destroy(del_ass.url.public_id, options);
  }
  appStatus(204, "", req, res, next);
});
module.exports = { addContent, getAss, delAss };

// regex
const reg = (shr) => {
  const regexQuery = new RegExp(shr, "i");

  return regexQuery;
};
