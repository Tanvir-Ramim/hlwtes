const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const mongoosePaginate = require("mongoose-paginate-v2");

const assetSchema = new Schema(
  {
    asset_type: {
      type: String,
      enum: [
        "Image-Banner",
        "Info-Text",
        "Image-Brand",
        "Image-Theme",
        "Image-Offer",
        "Image-Category",
      ],
    },
    position: { type: String, trim: true, default: "" },
    title: { type: String, default: "" },
    link: { type: String, default: "" },
    description: { type: String, default: "" },
    url: {
      public_id: { type: String, default: "" },
      url: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

const WorkPlanSchema = new Schema(
  {
      
    month: {
      type: String,
    },
    week:{
          type: String
    },
    year: {
      type: String,
    },
    url: {
      public_id: { type: String, default: "" },
      url: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  Asset: mongoose.model("Asset", assetSchema),
  Work_Plan: mongoose.model("Work_Plan", WorkPlanSchema),
};
