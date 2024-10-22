import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBinLine } from "react-icons/ri";
import { motion } from "framer-motion";
import {
  addQuantity,
  deleteItem,
  removeQuantity,
} from "../redux/product/productSlice";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart } = useSelector((state) => state.product);
  const { currentUser } = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Calculate total price
  const calculateTotalPrice = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-10 min-h-screen space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Cart Heading */}
      <motion.h1
        className="text-4xl font-semibold text-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Your <span className="text-teal-500">Cart</span>
      </motion.h1>

      {/* Cart Items */}
      {cart.length > 0 ? (
        <motion.div
          className="grid md:grid-cols-2 gap-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {cart.map((item, index) => (
            <motion.div
              key={index}
              className="flex justify-between items-center p-6 border border-gray-200 rounded-lg shadow-md bg-white hover:shadow-lg transition-transform hover:scale-105"
              variants={itemVariants}
            >
              {/* Product Image and Info */}
              <div className="flex items-center gap-4">
                <motion.img
                  src={`http://localhost:3000/${item.image}`}
                  alt={item.name}
                  className="w-24 h-24 object-contain rounded-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />

                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-gray-600">৳{item.price}</p>
                  <p className="text-gray-500">Size: {item.size}</p>
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <motion.button
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      dispatch(addQuantity({ id: item.id, size: item.size }))
                    }
                  >
                    +
                  </motion.button>
                  <p className="text-lg font-semibold">{item.quantity}</p>
                  <motion.button
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      dispatch(removeQuantity({ id: item.id, size: item.size }))
                    }
                  >
                    -
                  </motion.button>
                </div>
                <motion.button
                  className="text-red-600 hover:text-red-700 transition-transform hover:scale-110"
                  onClick={() =>
                    dispatch(deleteItem({ id: item.id, size: item.size }))
                  }
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <RiDeleteBinLine size={24} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.p
          className="text-lg text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Your cart is empty.
        </motion.p>
      )}

      {/* Cart Totals */}
      {cart.length > 0 && (
        <div className="mt-10 border-t pt-6">
          <div className="flex justify-end items-start">
            <div className="w-full md:w-1/2 lg:w-1/3 space-y-4">
              <motion.h2
                className="text-3xl font-semibold text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Cart <span className="text-teal-500">Totals</span>
              </motion.h2>
              <motion.div
                className="flex justify-between text-lg text-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span>Subtotal</span>
                <span>৳{calculateTotalPrice()}</span>
              </motion.div>
              <motion.div
                className="flex justify-between text-lg text-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span>Shipping</span>
                <span>৳70</span>
              </motion.div>
              <motion.div
                className="flex justify-between font-bold text-xl text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span>Total</span>
                <span>৳{calculateTotalPrice() + 70}</span>
              </motion.div>
              {currentUser ? (
                <motion.button
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-lg transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/place-order")}
                >
                  Proceed to Checkout
                </motion.button>
              ) : (
                <p className="text-lg">
                  Please{" "}
                  <Link className="font-semibold text-teal-500" to={"/login"}>
                    Login
                  </Link>{" "}
                  to Checkout
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Cart;
