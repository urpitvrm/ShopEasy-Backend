const productModel = require("../models/productModel");
const slugify = require("slugify");
const fs = require("fs");

const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.fields;
    const { photo } = req.files;

    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!photo || photo.size > 1000000) {
      return res.status(400).json({
        success: false,
        message: "Photo is required and must be less than 1MB",
      });
    }

    const product = await new productModel({
      ...req.fields,
      slug: slugify(name),
      photo: {
        data: fs.readFileSync(photo.path),
        contentType: photo.type,
      },
    }).save();
    // console.log(product);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while creating product: " + error.message,
    });
  }
};

const getProductController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const skip = (page - 1) * limit;

    const total = await productModel.countDocuments();
    const products = await productModel
      .find({})
      .select("-photo")
      .populate("category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      total,
      page,
      limit,
      message: "All Products with Pagination",
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching products: " + error.message,
    });
  }
};

const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo");
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "product not found",
      });
    }
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id).select("photo");
    if (product && product.photo && product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    } else {
      return res.status(404).json({
        success: false,
        message: "Photo not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};
const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id).select("-photo");
    return res.status(200).json({
      success: true,
      message: false,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};


const updateProductController = async (req, res) => {
  try {
    const { name } = req.fields;
    const { photo } = req.files;
    const updatedData = {
      ...req.fields,
      slug: name ? slugify(name) : undefined,
    };

    if (photo) {
      if (photo.size > 1000000) {
        return res.status(400).json({
          success: false,
          message: "Photo must be less than 1MB",
        });
      }
      updatedData.photo = {
        data: fs.readFileSync(photo.path),
        contentType: photo.type,
      };
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getSingleProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id).select("-photo");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const filterProductController = async (req, res) => {
  try {
    const { checked, priceRange } = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const skip = (page - 1) * limit;

    let args = {};
    if (checked.length > 0) {
      args.category = checked;
    }
    if (priceRange) {
      args.price = { $gte: priceRange[0], $lte: priceRange[1] };
    }
    
    const total = await productModel.countDocuments(args);
    const products = await productModel
      .find(args)
      .select("-photo")
      .populate("category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).send({
      success: true,
      total,
      page,
      limit,
      message: "Filtered products with Pagination",
      products,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductByCatController = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await productModel.find({ category: id }).select("-photo");


    res.status(200).json({
      success: true,
      message: "Products fetched successfully by category",
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSearchProductController = async (req, res) => {
  try {
    // Access the 'keyword' property directly from req.params
    const { keyword } = req.params;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Keyword is required",
      });
    }

    const products = await productModel
      .find({
        $or: [
          
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo")
      .populate("category");

    return res.status(200).json({
      success: true,
      message: "All Products",
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching products: " + error.message,
    });
  }
};

module.exports = {
  createProductController,
  getProductController,
  getSingleProductController,
  getProductPhotoController,
  deleteProductController,
  updateProductController,
  getSingleProductByIdController,
  filterProductController,
  getProductByCatController,
  getSearchProductController,
};
