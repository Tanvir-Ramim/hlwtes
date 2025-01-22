const { Announce } = require("../../../model/user/userModel");
//#### add##
const createAnnouncement = async (req, res) => {
  try {
    const data = req.body;

    //# new announcement##
    const newAnnouncement = new Announce(data);

    const savedAnnouncement = await newAnnouncement.save();

    return res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      data: savedAnnouncement,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create announcement",
      error: error.message,
    });
  }
};
//#### get##
const getAllAnnouncements = async (req, res) => {
  try {
    const {
      importance,
      announcement_type,
      status,
      employee_id,
      page,
      limit,
      id,
    } = req.query;

    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const lib = {};
    if (importance) lib.importance = importance;
    if (announcement_type) lib.announcement_type = announcement_type;
    if (status) lib.status = status;
    if (employee_id) lib.employee_id = employee_id;
    if (id) lib.id = id;
    const totalCount = await Announce.countDocuments(lib);
    const announcements = await Announce.find(lib)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    return res.status(200).json({
      success: true,
      data: announcements,
      total: totalCount,
      page: pageNumber,
      limit: limitNumber,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch announcements",
      error: error.message,
    });
  }
};
// get single
const getSingleAnnouncements = async (req, res) => {
  try {
    const { id } = req.params;

    const announcements = await Announce.findById(id);

    return res.status(201).json({
      success: true,
      data: announcements,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch announcements",
      error: error.message,
    });
  }
};

//#### patch##
const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      message,
      audience,
      importance,
      announcement_type,
      expiration_date,
      target_single_employee_id,
      status,
    } = req.body;
    const lib = {};
    if (title) lib.title = title;
    if (message) lib.message = message;
    if (audience) lib.audience = audience;
    if (importance) lib.importance = importance;
    if (announcement_type) lib.announcement_type = announcement_type;
    if (expiration_date) lib.expiration_date = expiration_date;
    if (target_single_employee_id)
      lib.target_single_employee_id = target_single_employee_id;
    if (status) lib.status = status;
    const updatedAnnouncement = await Announce.findByIdAndUpdate(
      id,
      {
        $set: lib,
      },
      { new: true, runValidators: true }
    );

    if (!updatedAnnouncement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      data: updatedAnnouncement,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update announcement",
      error: error.message,
    });
  }
};

//#### del##
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAnnouncement = await Announce.findByIdAndDelete(id);

    if (!deletedAnnouncement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
      data: deletedAnnouncement,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete announcement",
      error: error.message,
    });
  }
};

module.exports = {
  createAnnouncement,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
  getSingleAnnouncements,
};
