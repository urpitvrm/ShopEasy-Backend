const categoryModel = require("../models/categoryModel");
const slugify = require("slugify");

const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({ message: "Name is required" });
    }

    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();

    return res.status(201).send({
      success: true,
      message: "New Category Created",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: "Category Updated",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCategoryController = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    if (!categories || categories.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No Categories Found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "All Categories",
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// const getCategoryController = async (req, res) => {
//   try {
//     const categories = await categoryModel
//       .find({})
//       .lean() // returns plain objects for performance
//       .select("name slug"); // only return required fields (customize as needed)

//     if (!categories || categories.length === 0) {
//       return res.status(404).send({
//         success: false,
//         message: "No categories found",
//       });
//     }

//     return res.status(200).send({
//       success: true,
//       message: "All categories",
//       categories,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


const getCategoryByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Category found",
      category,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    await categoryModel.findByIdAndDelete(id);
    return res.status(200).send({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCategoryController,
  updateCategoryController,
  getCategoryController,
  getCategoryByIdController,
  deleteCategoryController,
};
