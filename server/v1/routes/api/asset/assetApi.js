const express = require("express");
const {
  getCloudFile,
  serachCloudFile,
  delAsset,
  getWorkPlan,
  addWorkPlan,
  workPlanDelete
} = require("../../../controller/asset/assetController");
const { uploadCloudinary } = require("../../../../utils/cloudiNulter");
const _ = express.Router();
_.get("/", getCloudFile);
_.get("/search", serachCloudFile);
_.delete("/:public_id", delAsset);


// work plan
_.get("/work-plan", getWorkPlan) //query  week, month , year
_.post("/work-plan",  uploadCloudinary.single("url"), addWorkPlan) //query  week, month , year
_.delete("/work-plan/:id",  workPlanDelete) 

module.exports = _;
