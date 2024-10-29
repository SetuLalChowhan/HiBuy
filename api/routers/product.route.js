const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addReview,
  editReview,
  deleteReview,
} = require("../controller/product.controller.js");
const upload = require("../uploads/multerConfig.js");
const { authenticate, isAdmin,authOrAdmin } = require("../middleware/authMiddleware.js");

const router = express.Router();

// Routes
//create-products
router.post("/create-product", isAdmin, createProduct);
//get-products
router.get("/all-products", getProducts);
//single-product
router.get("/:id", getProductById);
//edit-product
router.put("/:id", isAdmin, updateProduct);
//delete-product
router.delete("/:id", isAdmin, deleteProduct);
// Review routes
router.post("/reviews/:id", authenticate, addReview);
router.put("/reviews/:id",authenticate, editReview);
router.delete("/reviews/:id/:id2", authenticate, deleteReview);

module.exports = router;
