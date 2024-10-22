import { useFormik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { orderValidationSchema } from "../schema";
import { motion } from "framer-motion";
import { createOrder } from "../redux/order/orderSlice";
import toast from "react-hot-toast";

const PlaceOrder = () => {
  const { cart } = useSelector((state) => state.user.user);
  const calculateTotalPrice = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const dispatch = useDispatch();

  const initialValues = {
    name: "",
    email: "",
    products: cart,
    shippingAddress: {
      address: "",
      city: "",
      postalCode: "",
      country: "",
      phone: "",
    },
    paymentMethod: "",
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: orderValidationSchema,
      onSubmit: (values) => {
        if (!values.paymentMethod) {
          toast.error("Please Select Payment Method");
        } 
        if (values.products.length===0) {
          toast.error("Please add products to your cart before placing an order.");
        }
        else {
          dispatch(createOrder({ values, toast }));
        }
      },
    });

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="shadow-lg bg-white rounded-lg p-8"
      >
        <form
          onSubmit={handleSubmit}
          className="lg:px-5 lg:py-10 flex flex-col md:flex-row md:justify-between gap-10"
        >
          {/* Left Section - Delivery Information */}
          <div className="space-y-6 w-full md:w-2/3">
            <div className="pb-6">
              <h1 className="text-3xl font-semibold">
                DELIVERY <span className="text-teal-500">INFORMATION</span>
              </h1>
            </div>

            {/* Name */}
            <div>
              <motion.input
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                type="text"
                className={`w-full p-4 text-lg rounded-md border ${
                  errors.name && touched.name
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-teal-300 transition`}
                placeholder="Name"
                whileFocus={{ scale: 1.02 }}
              />
              {errors.name && touched.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <motion.input
                type="email"
                name="email"
                required
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-4 text-lg rounded-md border ${
                  errors.email && touched.email
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-teal-300 transition`}
                placeholder="Email"
                whileFocus={{ scale: 1.02 }}
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Address Fields */}
            <div className="space-y-4">
              <motion.input
                type="text"
                name="shippingAddress.address"
                required
                value={values?.shippingAddress?.address}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-4 text-lg rounded-md border ${
                  errors?.shippingAddress?.address &&
                  touched?.shippingAddress?.address
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-teal-300 transition`}
                placeholder="Address"
                whileFocus={{ scale: 1.02 }}
              />
              {errors?.shippingAddress?.address &&
                touched?.shippingAddress?.address && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.shippingAddress.address}
                  </p>
                )}
              <div className="flex flex-col md:flex-row gap-4">
                <motion.input
                  type="text"
                  name="shippingAddress.city"
                  required
                  value={values.shippingAddress.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="City"
                  className={`w-full p-4 text-lg rounded-md border ${
                    errors?.shippingAddress?.city &&
                    touched?.shippingAddress?.city
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:ring-2 focus:ring-teal-300 transition`}
                  whileFocus={{ scale: 1.02 }}
                />
                {errors?.shippingAddress?.city &&
                  touched?.shippingAddress?.city && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.shippingAddress.city}
                    </p>
                  )}
                <motion.input
                  type="number"
                  name="shippingAddress.postalCode"
                  required
                  value={values.shippingAddress.postalCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Postal Code"
                  className={`w-full p-4 text-lg rounded-md border ${
                    errors?.shippingAddress?.postalCode &&
                    touched?.shippingAddress?.postalCode
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:ring-2 focus:ring-teal-300 transition`}
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
            </div>
            <div>
              <motion.input
                type="text"
                name="shippingAddress.country"
                required
                value={values?.shippingAddress?.country}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Country"
                className={`w-full p-4 text-lg rounded-md border ${
                  errors?.shippingAddress?.country &&
                  touched?.shippingAddress?.country
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-teal-300 transition`}
                whileFocus={{ scale: 1.02 }}
              />
              {errors?.shippingAddress?.country &&
                touched?.shippingAddress?.country && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors?.shippingAddress?.country}
                  </p>
                )}
            </div>

            {/* Phone */}
            <div>
              <motion.input
                type="number"
                name="shippingAddress.phone"
                required
                value={values?.shippingAddress?.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Phone Number"
                className={`w-full p-4 text-lg rounded-md border ${
                  errors?.shippingAddress?.phone &&
                  touched?.shippingAddress?.phone
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-teal-300 transition`}
                whileFocus={{ scale: 1.02 }}
              />
              {errors?.shippingAddress?.phone &&
                touched?.shippingAddress?.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.shippingAddress.phone}
                  </p>
                )}
            </div>
          </div>

          {/* Right Section - Cart Totals and Payment Methods */}
          <div className="w-full md:w-1/3 bg-gray-50 p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-semibold mb-4">
              Cart <span className="text-teal-500">Totals</span>
            </h1>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-lg">
                <p>Subtotal</p>
                <p>৳{calculateTotalPrice()}</p>
              </div>
              <div className="flex justify-between text-lg">
                <p>Delivery Charge</p>
                <p>৳70</p>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <p>Total</p>
                <p>৳{calculateTotalPrice() + 70}</p>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <p className="text-lg font-medium mb-4">Payment Methods</p>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <motion.input
                    type="radio"
                    name="paymentMethod"
                    value="bkash"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="h-5 w-5 text-gray-400 border-gray-400 focus:ring-2 focus:ring-teal-300"
                    whileHover={{ scale: 1.1 }}
                    disabled
                  />
                  <span className="text-gray-400">Bkash (Coming Soon)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <motion.input
                    type="radio"
                    name="paymentMethod"
                    value="credit-card"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="h-5 w-5 text-gray-400 border-gray-400 focus:ring-2 focus:ring-teal-300"
                    whileHover={{ scale: 1.1 }}
                    disabled
                  />
                  <span className="text-gray-400">
                    Credit Card (Coming Soon)
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <motion.input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="h-5 w-5 text-teal-500 border-gray-400 focus:ring-2 focus:ring-teal-300"
                    whileHover={{ scale: 1.1 }}
                  />
                  <span>COD(Cash on Delivery)</span>
                </label>
              </div>
            </div>

            {/* Submit Order Button */}
            <div className="mt-6">
              <motion.button
                type="submit"
                className="w-full bg-teal-500 text-white p-4 rounded-lg hover:bg-teal-600 transition font-semibold"
                whileHover={{ scale: 1.05 }}
              >
                Place Order
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PlaceOrder;
