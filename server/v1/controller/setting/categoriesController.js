const { Categories } = require("../../../model/categories/categoriesModel");
const { tryCatch } = require("../../../utils/tryCatch");

const addCategories = tryCatch(async (req, res) => {
  try {
    const data = req.body;
    const categoriesData = new Categories(data);
    const category = await categoriesData.save();
    return res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to Add Categories",
      error: error.message,
    });
  }
});

const getCategories = tryCatch(async (req, res) => {
  try {
    const { categoryName } = req.query;
    const query = {};
    if (categoryName && categoryName !== "undefined" && categoryName !== "") {
      query.category_Name = categoryName;
    }
    const categoriesData = await Categories.find(query);
    return res.status(200).json({
      success: true,
      data: categoriesData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to Find Categories",
      error: error.message,
    });
  }
});

const deleteCategories = tryCatch(async (req, res) => {
  try {
    const { id } = req.params;
    const categoriesData = await Categories.findByIdAndDelete(id);
    return res.status(204).json({
      success: true,
      data: categoriesData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to Delete ",
      error: error.message,
    });
  }
});

module.exports = {
  addCategories,
  getCategories,
  deleteCategories,
};
