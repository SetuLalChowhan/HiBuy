import { useFormik } from "formik";
import React from "react";
import { useSelector } from "react-redux";
import { orderValidationSchema } from "../schema";

const PlaceOrder = () => {
  const { cart } = useSelector((state) => state.product);
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
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: orderValidationSchema,
      onSubmit: (values) => {
        console.log(values);
      },
    });

  return (
    <div className="container flex md:flex-row flex-col md:justify-between min-h-screen ">
      <div className="  px-6 py-10  ">
        <div className="px-5 ">
        <h1 className="text-3xl ">DELIVERY <span className="text-teal-500">INFORMATION</span></h1>
        </div>
        <form onSubmit={handleSubmit} className="px-5 py-10 space-y-2 ">
          <div>
            <input
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              type="text"
              className={`w-full p-3 text-lg rounded-sm border focus:ring focus:ring-blue-200 transition ${
                errors.name && touched.name
                  ? "border-red-500"
                  : "border-gray-400"
              }`}
              placeholder="Name"
            />
            {errors.name && touched.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <input
              type="email"
              name="email"
              required
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-3 text-lg rounded-sm border focus:ring focus:ring-blue-200 transition ${
                errors.email && touched.email
                  ? "border-red-500"
                  : "border-gray-400"
              }`}
              placeholder="email"
            />
            {errors.email && touched.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="shippingAddress.address"
              required
              value={values?.shippingAddress?.address}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-3 text-lg rounded-sm border focus:ring focus:ring-blue-200 transition ${
                errors?.shippingAddress?.address && touched?.shippingAddress?.address
                  ? "border-red-500"
                  : "border-gray-400"
              }`}
              placeholder="address"
            />
            {errors?.shippingAddress?.address &&
              touched?.shippingAddress?.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.shippingAddress.address}
                </p>
              )}
          </div>
          <div className="flex md:flex-row flex-col gap-2 w-full ">
            <div>
              <input
                type="text"
                name="shippingAddress.city"
                required
                value={values.shippingAddress.city}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="city"
                className={` w-full md:w-[240px] p-3 text-lg rounded-sm border focus:ring focus:ring-blue-200 transition ${
                  errors?.shippingAddress?.city &&
                  touched?.shippingAddress?.city
                    ? "border-red-500"
                    : "border-gray-400"
                } `}
              />
              {errors?.shippingAddress?.city &&
                touched?.shippingAddress?.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors?.shippingAddress?.city}
                  </p>
                )}
            </div>
            <div>
              <input
                type="number"
                name="shippingAddress.postalCode"
                required
                value={values.shippingAddress.postalCode}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="postal code"
                className={` w-full md:w-[265px]  p-3 text-lg rounded-sm border focus:ring focus:ring-blue-200 transition ${
                  errors?.shippingAddress?.postalCode &&
                  touched?.shippingAddress?.postalCode
                    ? "border-red-500"
                    : "border-gray-400"
                } `}
              />
              {errors?.shippingAddress?.postalCode &&
                touched?.shippingAddress?.postalCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors?.shippingAddress?.postalCode}
                  </p>
                )}
            </div>
          </div>
          <div>
            <input
              type="text"
              name="shippingAddress.country"
              required
              value={values?.shippingAddress?.country}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Country"
              className={`w-full p-3 text-lg rounded-sm focus:ring focus:ring-blue-200 transition ${
                errors?.shippingAddress?.country &&
                touched?.shippingAddress?.country
                  ? "border-red-500"
                  : "border-gray-400"
              }`}
            />
            {errors?.shippingAddress?.country &&
              touched?.shippingAddress?.country && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.shippingAddress?.country}
                </p>
              )}
          </div>
          <div>
            <input
              type="number"
              name="shippingAddress.phone"
              required
              value={values?.shippingAddress?.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Phone Number"
              className={`w-full p-3 text-lg rounded-sm focus:ring focus:ring-blue-200 transition ${
                errors?.shippingAddress?.phone &&
                touched?.shippingAddress?.phone
                  ? "border-red-500"
                  : "border-gray-400"
              }`}
            />
            {errors?.shippingAddress?.phone &&
              touched?.shippingAddress?.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.shippingAddress?.phone}
                </p>
              )}
          </div>
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-teal-600 transition duration-300"
          >
            Place Order
          </button>
        </form>
      </div>
      <div className="">
        <h1>CART TOTALS</h1>
      </div>
    </div>
  );
};

export default PlaceOrder;
