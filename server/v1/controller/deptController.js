const { Department } = require("../../model/user/userModel");

// POST: Create a new department
const createDepartment = async (req, res) => {
  try {
    const { name, description, head_of_department } =
      req.body.departmentData;

    // Check if department already exists
    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment) {
      return res.status(400).json({ message: "Department already exists" });
    }

    // Create new department
    const newDepartment = new Department({
      name,
      description,
      head_of_department,
      
    });

    await newDepartment.save();
    res.status(201).json({
      message: "Department created successfully",
      department: newDepartment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// GET: Get all departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate(
      "head_of_department",
      "name"
    );
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// DELETE: Delete department by ID
const deleteDepartment = async (req, res) => {
  try {
    const departmentId = req.params.id;

    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    await department.deleteOne();
    res.status(204).json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  deleteDepartment,
};
