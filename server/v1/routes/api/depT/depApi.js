const express = require("express");
const {
  createDepartment,
  getDepartments,
  deleteDepartment,
} = require("../../../controller/deptController");
const _ = express.Router();
_.post("/", createDepartment);
_.get("/", getDepartments);
_.delete("/:id", deleteDepartment);
module.exports = _;
