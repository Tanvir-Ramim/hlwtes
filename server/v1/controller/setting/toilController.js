const { Toil } = require("../../../model/attendance/attendModel");
// add
const createTOIL = async (req, res) => {
  try {
    const {
      employee_id,
      employee_name,
      earn_toil,
      toil_title,
      toil_start_date,
      expiry_date,
    } = req.body;

    const newTOIL = new Toil({
      employee_id,
      employee_name,
      earn_toil,
      toil_title,
      toil_start_date,
      expiry_date,
      remaining_toil: earn_toil,
    });

    const savedTOIL = await newTOIL.save();
    return res
      .status(201)
      .json({ message: "TOIL created successfully", data: savedTOIL });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating TOIL", error: error.message });
  }
};
// get
const getAllTOIL = async (req, res) => {
  try {
    const { employee_id } = req.query;
    let toilRecords;
    if (employee_id) {
      toilRecords = await Toil.find({ employee_id });
    } else {
      toilRecords = await Toil.find();
    }

    return res.status(200).json({
      message: "TOIL records fetched successfully",
      data: toilRecords,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching TOIL records", error: error.message });
  }
};
// patch
const updateTOIL = async (req, res) => {
  const { id } = req.params;
  const { used_toil, status, earn_toil } = req.body;

  try {
    const toilRecord = await Toil.findById(id);

    if (!toilRecord) {
      return res.status(404).json({ message: "TOIL record not found" });
    }

    if (used_toil !== undefined && used_toil > 0) {
      toilRecord.used_toil = toilRecord.used_toil - used_toil;
      toilRecord.remaining_toil = toilRecord.earn_toil - used_toil;
    }
    if (status) {
      toilRecord.status = status;
    }
    if (earn_toil !== undefined && earn_toil > 0) {
      toilRecord.earn_toil = toilRecord.earn_toil + earn_toil;
    }

    const updatedTOIL = await toilRecord.save();
    return res
      .status(200)
      .json({ message: "TOIL updated successfully", data: updatedTOIL });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating TOIL", error: error.message });
  }
};
// delete
const deleteTOIL = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTOIL = await Toil.findByIdAndDelete(id);

    if (!deletedTOIL) {
      return res.status(404).json({ message: "TOIL record not found" });
    }

    return res
      .status(200)
      .json({ message: "TOIL deleted successfully", data: deletedTOIL });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting TOIL", error: error.message });
  }
};

module.exports = {
  createTOIL,
  getAllTOIL,
  updateTOIL,
  deleteTOIL,
};
