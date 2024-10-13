const AppError = require("../error/AppError.js");
const Product = require("../model/product.model.js");

const createProduct = async (req, res, next) => {
  if (req.fileValidationError) {
    return next(new AppError(req.fileValidationError, 400));
  }
  const { name, price, description, category, type, stock } = req.body;
  const image = req.file ? req.file.path : null;
  try {
    const product = new Product({
      name,
      price,
      description,
      image,
      category,
      type,
      stock,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.log(error);
    return next(new AppError("Server error", 500));
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new AppError("Product not Found", 404));
    }
    res.status(200).json(product);
  } catch (error) {
    return next(new AppError("Server error", 500));
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new AppError("Product not Found", 404));
    }

    const { name, price, description, category, type, stock } = req.body;

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.category = category || product.category;
    product.type = type || product.type;
    product.stock = stock || product.stock;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error);
    return next(new AppError("Server error", 500));
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new AppError("Product not Found", 404));
    }

    // Use findByIdAndDelete instead of product.remove()
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.log(error);
    return next(new AppError("Server error", 500));
  }
};

const getProducts = async (req, res, next) => {
  try {
    const { category, type, search, minPrice, maxPrice, latest } = req.query;
    console.log("Query Params:", req.query); // Log the incoming query parameters

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const skip = startIndex;

    let query = {};
    if (category) query.category = category;
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };

    let sortOption = {};
    if (latest === "true") {
      sortOption = { createdAt: -1 }; // Sort by creation date (newest first)
    }
    console.log("Sort Option:", sortOption); // Log the sort option to check what is being applied

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    if (!products.length) {
      return next(new AppError("No products found", 404));
    }

    res.status(200).json({
      success: true,
      totalProducts,
      products,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    next(new AppError("Server error", 500));
  }
};

const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError("Product not Found", 404));
    }

    // Check if the user has already reviewed this product
    const alreadyReviewed = product.reviews.find(
      (r) => r.userId.toString() === req.user.userId.toString() // Match by user ID
    );

    console.log(req.user.userId);

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    const review = {
      rating: Number(rating),
      comment: comment ? comment : null, // Optional comment
      userId: req.user.userId,
      productId: req.params.id,
    };

    // Add the new review to the product
    product.reviews.push(review);

    // Update product rating
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    // Save the updated product
    await product.save();
    res.status(201).json({ message: "Review added" });
  } catch (error) {
    console.error(error);
    next(new AppError("Server error", 500));
  }
};

const editReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError("Product not Found", 404));
    }
    console.log(req.user.userId);
    const review = product.reviews.find(
      (r) => r.userId.toString() === req.user.userId.toString() // Match by user ID
    );

    if (!review) {
      return next(new AppError("Review not Found", 404));
    }

    // Update the review's rating and comment
    review.rating = rating !== undefined ? rating : review.rating;
    review.comment = comment !== undefined ? comment : review.comment;

    // Update the product's average rating
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    // Save the updated product
    await product.save();
    res.status(200).json({ message: "Review updated successfully" });
  } catch (error) {
    console.error(error);
    next(new AppError("Server error", 500));
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError("Product not Found", 404));
    }

    // Check if the review exists
    const reviewIndex = product.reviews.findIndex(
      (r) => r.userId.toString() === req.user.userId.toString() // Match by user ID
    );

    if (reviewIndex === -1) {
      return next(new AppError("Review not Found", 404));
    }

    // Remove the review
    product.reviews.splice(reviewIndex, 1);

    // Recalculate the product's average rating
    if (product.reviews.length > 0) {
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
    } else {
      product.rating = 0;
    }

    await product.save();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    next(new AppError("Server error", 500));
  }
};
module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addReview,
  editReview,
  deleteReview,
};
