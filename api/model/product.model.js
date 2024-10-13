// models/productModel.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  productId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a product name"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
    min: [0, "Price cannot be negative"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  image: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  },
  category: {
    type: String,
    enum: ["men", "women", "kids"],
    required: [true, "Please select a category"],
  },
  type: {
    type: String,
    enum: ["topwear", "bottomwear", "winterwear"],
    required: [true, "Please select a type"],
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, "Stock cannot be negative"],
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, "Rating cannot be less than 0"],
    max: [5, "Rating cannot be more than 5"],
  },
  reviews: [reviewSchema], // Add an array of reviews
  sold: {
    type: Number,
    default: 0, // Track number of units sold
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);

