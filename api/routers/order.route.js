const express = require("express");
const {createOrder, 
    getSingleOrder, 
    myOrders, 
    getAllOrders, 
    updateOrderStatus, 
    deleteOrder} = require("../controller/order.controller.js");
const { authenticate, isAdmin } = require("../middleware/authMiddleware.js");
const router = express.Router();

// Route for creating a new order
router.post("/create",authenticate, createOrder);

router.get("/my-orders", authenticate, myOrders); // Get Logged-in User Orders
router.get("/order/:orderId", authenticate, getSingleOrder); // Get Single Order by ID
router.get("/allOrders", authenticate,isAdmin, getAllOrders); // Admin: Get All Orders
router.put("/order/:orderId", authenticate,isAdmin, updateOrderStatus); // Admin: Update Order Status
router.delete("/order/:orderId", authenticate, isAdmin, deleteOrder);


module.exports = router;
