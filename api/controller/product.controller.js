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
    // Extract query parameters: category, type, search, price range, pagination (startIndex, limit)
    const { category, type, search, minPrice, maxPrice } = req.query;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const skip = startIndex;

    // Build the search/filter query
    let query = {};

    if (category) query.category = category;
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } }, // Case-insensitive search in product name
        { description: { $regex: search, $options: "i" } }, // Case-insensitive search in product description
      ];
    }

    // Add price range filter if provided
    if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };

    // Get total number of products (with filter if applied)
    const totalProducts = await Product.countDocuments(query);

    // Fetch products with pagination and optional filtering
    const products = await Product.find(query).skip(skip).limit(limit);

    // Handle case where no products are found
    if (!products.length) {
      return next(new AppError("No products found", 404));
    }

    // Send back the paginated and filtered results
    res.status(200).json({
      success: true,
      totalProducts, // Total number of products (filtered if query was provided)
      products, // List of products with pagination
    });
  } catch (error) {
    console.error(error);
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
