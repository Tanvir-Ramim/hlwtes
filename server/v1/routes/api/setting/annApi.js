const express = require("express");
const {
  createAnnouncement,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
  getSingleAnnouncements,
} = require("../../../controller/announcement/annController");
const _ = express.Router();

_.post("/", createAnnouncement);
_.get("/", getAllAnnouncements); //? importance=, announcement_type=, status=, employee_id=
_.get("/:id", getSingleAnnouncements);
_.patch("/:id", updateAnnouncement);
_.delete("/:id", deleteAnnouncement);
module.exports = _;
