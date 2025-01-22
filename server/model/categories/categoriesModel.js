const mongoose = require("mongoose");
const { Schema } = mongoose;

const categoriesSchema = new Schema (
  {
    category_Name: {
      type: String,
    },
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  Categories: mongoose.model("Categories", categoriesSchema),
};
