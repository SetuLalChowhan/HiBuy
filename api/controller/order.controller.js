// const Product = require("../model/product.model.js");
// const Order = require("../model/order.model.js");
// const AppError = require("../error/AppError.js");
// const createOrder = async (req, res, next) => {
//     const { products, shippingAddress } = req.body; // Expect products and shippingAddress from the request body
  
//     try {
//       let totalPrice = 0;
//       const orderProducts = [];
  
//       // Loop through each product in the order request
//       for (const item of products) {
//         const product = await Product.findById(item.productId);
  
//         if (!product) {
//           return next(new AppError(`Product not found: ${item.productId}`, 404));
//         }
  
//         // Find the size and adjust stock
//         const productSize = product.sizes.find((s) => s.size === item.size);
  
//         if (!productSize || productSize.stock < item.quantity) {
//           return next(new AppError(`Insufficient stock for size: ${item.size}`, 400));
//         }
  
//         // Deduct stock
//         productSize.stock -= item.quantity;
  
//         // If total stock goes below 0, return error
//         if (product.stock < item.quantity) {
//           return next(new AppError(`Insufficient stock for product: ${product.name}`, 400));
//         }
  
//         product.stock -= item.quantity; // Adjust overall stock
  
//         // Save updated product
//         await product.save();
  
//         // Add product details to orderProducts array
//         orderProducts.push({
//           productId: product._id,
//           productName: product.name,
//           productImage: product.image,
//           size: item.size,
//           quantity: item.quantity,
//           price: product.price * item.quantity,
//         });
  
//         // Calculate total price
//         totalPrice += product.price * item.quantity;
//       }
  
//       // Validate shipping information and phone number
//       if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country || !shippingAddress.phone) {
//         return next(new AppError("Shipping address is incomplete, including phone number", 400));
//       }
  
//       // Validate phone number format (basic example, you can customize it based on your region)
//       const phoneRegex = /^[0-9]{10,15}$/; // Example: 10 to 15 digits
//       if (!phoneRegex.test(shippingAddress.phone)) {
//         return next(new AppError("Invalid phone number format", 400));
//       }
  
//       // Create the order with shipping information
//       const order = new Order({
//         userId: req.user.userId,
//         products: orderProducts,
//         totalPrice,
//         shippingAddress, // Add shipping details to the order, including phone
//       });
  
//       const createdOrder = await order.save();
//       res.status(201).json(createdOrder);
//     } catch (error) {
//       console.log(error);
//       return next(new AppError("Server error", 500));
//     }
//   };
  


// module.exports = {
//    createOrder,

//   };
const Product = require("../model/product.model.js");
const Order = require("../model/order.model.js");
const AppError = require("../error/AppError.js");

// Create Order Controller (Already Provided)
const createOrder = async (req, res, next) => {
  const { products, shippingAddress } = req.body;

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
        return next(new AppError(`Insufficient stock for size: ${item.size}`, 400));
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
    const order = await Order.findById(req.params.orderId).populate('userId', 'name email');
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
    const orders = await Order.find().populate('userId', 'name email');
    res.status(200).json(orders);
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
    console.log(error)
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
