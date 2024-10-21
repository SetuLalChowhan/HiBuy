const Product = require("../model/product.model.js");
const Order = require("../model/order.model.js");
const AppError = require("../error/AppError.js");

// Create Order Controller (Already Provided)
const createOrder = async (req, res, next) => {
  const { products, shippingAddress, name, email } = req.body;

  try {
    let totalPrice = 0;
    const orderProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return next(new AppError(`Product not found: ${item.productId}`, 404));
      }

      const productSize = product.sizes.find((s) => s.size === item.size);

      if (!productSize || productSize.stock < item.quantity) {
        return next(
          new AppError(`Insufficient stock for size: ${item.size}`, 400)
        );
      }

      productSize.stock -= item.quantity;
      product.stock -= item.quantity;

      await product.save();

      orderProducts.push({
        productId: product._id,
        productName: product.name,
        productImage: product.image,
        size: item.size,
        quantity: item.quantity,
        price: product.price * item.quantity,
      });

      totalPrice += product.price * item.quantity;
    }

    if (!shippingAddress || !shippingAddress.phone) {
      return next(new AppError("Shipping address is incomplete", 400));
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(shippingAddress.phone)) {
      return next(new AppError("Invalid phone number format", 400));
    }
    const order = new Order({
      name,
      email,
      orderCode: Math.floor(1000 + Math.random() * 9000).toString(),
      userId: req.user.userId,
      products: orderProducts,
      totalPrice,
      shippingAddress,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.log(error);
    return next(new AppError("Server error", 500));
  }
};

// Get Single Order by ID
const getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId).populate(
      "userId",
      "name email"
    );
    if (!order) {
      return next(new AppError("Order not found", 404));
    }
    res.status(200).json(order);
  } catch (error) {
    return next(new AppError("Server error", 500));
  }
};

// Get All Orders for Logged-in User
const myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.userId });
    res.status(200).json(orders);
  } catch (error) {
    return next(new AppError("Server error", 500));
  }
};

// Get All Orders for Admin
const getAllOrders = async (req, res, next) => {
  try {
    const { query, sort, status } = req.query;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit);
    const skip = startIndex;

    // Initialize searchQuery object
    let searchQuery = {};

    // If a combined search query for name, email, or orderCode is provided
    if (query) {
      searchQuery = {
        $or: [
          { name: { $regex: query, $options: "i" } }, // Case-insensitive search by name
          { email: { $regex: query, $options: "i" } }, // Case-insensitive search by email
          { orderCode: { $regex: query, $options: "i" } }, // Case-insensitive search by orderCode
        ],
      };
    }

    // Add status filter if provided
    if (status) {
      searchQuery.status = status;
    }

    // Initialize sorting options
    let sortOption = {};

    // Sort by different options (latest, price, or status)
    if (sort === "latest") {
      sortOption = { createdAt: -1 }; // Sort by latest orders
    } else if (sort === "price") {
      sortOption = { totalPrice: -1 }; // Sort by price (high to low)
    } else if (sort === "status") {
      sortOption = { status: 1 }; // Sort by status (alphabetically)
    }

    // Get the total number of matching orders
    const totalOrders = await Order.countDocuments(searchQuery);
    console.log(searchQuery);

    // Find orders with the search query, populate user details, and apply sorting, pagination
    const orders = await Order.find(searchQuery)
      .populate("userId", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(limit || totalOrders);

    // Return the filtered and sorted orders
    res.status(200).json({ success: true, totalOrders, orders });
  } catch (error) {
    return next(new AppError("Server error", 500));
  }
};

// Update Order Status and Adjust Stock if Cancelled
const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    // If status is cancelled, restore stock
    if (req.body.status === "cancelled") {
      for (const item of order.products) {
        const product = await Product.findById(item.productId);

        if (product) {
          const productSize = product.sizes.find((s) => s.size === item.size);
          if (productSize) {
            productSize.stock += item.quantity;
          }
          product.stock += item.quantity;

          await product.save();
        }
      }
    }

    order.status = req.body.status || order.status;
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.log(error);
    return next(new AppError("Server error", 500));
  }
};

// Delete Order
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    // Restore stock when deleting order
    if (order.status !== "cancelled") {
      for (const item of order.products) {
        const product = await Product.findById(item.productId);

        if (product) {
          const productSize = product.sizes.find((s) => s.size === item.size);
          if (productSize) {
            productSize.stock += item.quantity;
          }
          product.stock += item.quantity;

          await product.save();
        }
      }
    }

    await order.remove();
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    return next(new AppError("Server error", 500));
  }
};

module.exports = {
  createOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};
