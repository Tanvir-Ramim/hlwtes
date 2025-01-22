const express = require("express");
const {
  createTOIL,
  getAllTOIL,
  updateTOIL,
  deleteTOIL,
} = require("../../../controller/setting/toilController");
const _ = express.Router();
_.post("/", createTOIL);// req.body=    employee_id,employee_name, earn_toil, toil_title, toil_start_date, expiry_date,
_.get("/", getAllTOIL);// req.query= employee_id   
_.patch("/:id", updateTOIL);// req.params= toil id  
_.delete("/:id", deleteTOIL);// req.params= toil id  
module.exports = _;
