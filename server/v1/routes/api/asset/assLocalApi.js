const express = require("express");
const {
  addContent,
  getAss,
  delAss,
} = require("../../../controller/asset/imgContentller");

const { uploadCloudinary } = require("../../../../utils/cloudiNulter");
const _ = express.Router();
_.post("/", uploadCloudinary.single("url"), addContent);
_.get("/", getAss); //req.query : asset_type, position
_.delete("/:id", delAss);
module.exports = _;
