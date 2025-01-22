const express = require("express");
const {
  addCategories,
  getCategories,
  deleteCategories,
} = require("../../../controller/setting/categoriesController");
const _ = express.Router();
_.post("/", addCategories);
_.get("/", getCategories); // query? categoryName=
_.delete("/:id", deleteCategories); 
module.exports = _;
