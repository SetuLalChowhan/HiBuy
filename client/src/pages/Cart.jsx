import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBinLine } from "react-icons/ri";
import { motion } from "framer-motion";
import {
  addQuantity,
  addTotal,
  deleteItem,
  removeQuantity,
} from "../redux/product/productSlice";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart } = useSelector((state) => state.product);
  const { currentUser } = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to calculate total price
  const calculateTotalPrice = () => {
    const total = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    // ;
    return total;
  };
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
      className="container min-h-screen mb-6 mt-10 px-3 space-y-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Cart Heading */}
      <motion.h2
        className="text-3xl font-semibold text-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
       <h1 className="text-3xl ">Your <span className="text-teal-500">Cart</span></h1>
      </motion.h2>

      {/* Cart Items Section */}
      <div>
        {cart.length > 0 ? (
          <motion.div
            className="flex flex-col gap-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {cart.map((item, index) => (
              <motion.div
                key={index}
                className="flex border border-gray-200 rounded-xl shadow-lg justify-between items-center p-6 bg-white transition-transform transform hover:scale-105 hover:shadow-xl"
                variants={itemVariants}
              >
                {/* Product Info */}
                <div className="flex items-center gap-8">
                  {/* Product Image */}
                  <motion.img
                    className="w-32 h-32 object-contain rounded-lg shadow-lg"
                    src={`http://localhost:3000/${item?.image}`}
                    alt={item?.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Product Details */}
                  <div className="flex flex-col gap-4">
                    {/* Product Name */}
                    <p className="md:text-2xl font-semibold text-gray-900">
                      {item.name}
                    </p>

                    {/* Price, Size, and Quantity */}
                    <div className="flex md:flex-row flex-col md:items-center gap-4 text-gray-700">
                      <div className="flex items-center md:gap-5 gap-2 ">
                        <p className="md:text-xl ">৳{item.price}</p>
                        <p className="md:text-xl ">{item.size}</p>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-3">
                        <motion.button
                          className="flex items-center justify-center w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full text-lg font-semibold text-gray-700 transition"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            dispatch(
                              addQuantity({ id: item.id, size: item.size })
                            )
                          }
                        >
                          +
                        </motion.button>
                        <p className="text-xl font-semibold text-gray-900">
                          {item.quantity}
                        </p>
                        <motion.button
                          className="flex items-center justify-center w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full text-lg font-semibold text-gray-700 transition"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            dispatch(
                              removeQuantity({ id: item.id, size: item.size })
                            )
                          }
                        >
                          -
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delete Button */}
                <motion.button
                  className="text-red-600 hover:text-red-700 transition-transform transform hover:scale-110"
                  title="Remove item"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    dispatch(deleteItem({ id: item.id, size: item.size }))
                  }
                >
                  <RiDeleteBinLine size={28} />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.p
            className="text-xl text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Your cart is empty.
          </motion.p>
        )}
      </div>

      {/* Cart Totals Section */}
      {cart.length > 0 && (
        <div className="border-t border-gray-200 pt-8 ">
          <div className="flex justify-end items-start">
            <div className="w-full md:w-1/2 lg:w-1/3 space-y-6">
              <motion.h2
                className="text-3xl font-semibold text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                 <h1 className="text-3xl ">Cart <span className="text-teal-500">Totals</span></h1>
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
                <span>৳50</span>
              </motion.div>
              <motion.div
                className="flex justify-between font-bold text-2xl text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span>Total</span>
                <span>৳{calculateTotalPrice() + 50}</span>
              </motion.div>
              {currentUser ? (
                <motion.button
                  className="w-full bg-teal-500 hover:bg-teal-700 text-white text-lg font-semibold py-4 rounded-lg transition duration-300 ease-in-out"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/place-order")}
                >
                  Proceed to Checkout
                </motion.button>
              ) : (
                <p className="md:text-xl">
                  Please{" "}
                  <Link className="font-semibold text-blue-500" to={"/login"}>
                    Login
                  </Link>{" "}
                  To CheckOut
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
