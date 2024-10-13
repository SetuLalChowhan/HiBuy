import React from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Spinner, Alert } from "flowbite-react";
import { createProductSchema } from "../schema";
import { createProduct } from "../redux/product/productSlice";

const CreateProduct = () => {
  // const { loading, error } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      description: "",
      category: "",
      type: "",
      stock: "",
      image: null,
    },
    validationSchema: createProductSchema,
    onSubmit: (values) => {
      console.log(values);
      dispatch(createProduct({ values, toast }));
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-5">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-2xl border border-gray-300">
        {/* Header Section */}
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Create New Product
        </h1>

        {/* Form Section */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Product Name Input */}
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="text-lg font-medium text-gray-700 mb-1"
            >
              Product Name
            </label>
            <input
              required
              type="text"
              id="name"
              name="name"
              placeholder="Enter product name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-3 border ${
                formik.errors.name && formik.touched.name
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200`}
            />
            {formik.errors.name && formik.touched.name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
            )}
          </div>

          {/* Price Input */}
          <div className="flex flex-col">
            <label
              htmlFor="price"
              className="text-lg font-medium text-gray-700 mb-1"
            >
              Price
            </label>
            <input
              required
              type="number"
              id="price"
              name="price"
              placeholder="Enter price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-3 border ${
                formik.errors.price && formik.touched.price
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200`}
            />
            {formik.errors.price && formik.touched.price && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.price}</p>
            )}
          </div>

          {/* Description Input */}
          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="text-lg font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              required
              id="description"
              name="description"
              placeholder="Enter product description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-3 border ${
                formik.errors.description && formik.touched.description
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200`}
            />
            {formik.errors.description && formik.touched.description && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.description}
              </p>
            )}
          </div>

          {/* Category Input */}
          <div className="flex flex-col">
            <label
              htmlFor="category"
              className="text-lg font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              required
              id="category"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-3 border ${
                formik.errors.category && formik.touched.category
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200`}
            >
              <option value="">Select category</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>
            {formik.errors.category && formik.touched.category && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.category}
              </p>
            )}
          </div>

          {/* Type Input */}
          <div className="flex flex-col">
            <label
              htmlFor="type"
              className="text-lg font-medium text-gray-700 mb-1"
            >
              Type
            </label>
            <select
              required
              id="type"
              name="type"
              value={formik.values.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-3 border ${
                formik.errors.type && formik.touched.type
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200`}
            >
              <option value="">Select type</option>
              <option value="topwear">Topwear</option>
              <option value="bottomwear">Bottomwear</option>
              <option value="winterwear">Winterwear</option>
            </select>
            {formik.errors.type && formik.touched.type && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.type}</p>
            )}
          </div>

          {/* Stock Input */}
          <div className="flex flex-col">
            <label
              htmlFor="stock"
              className="text-lg font-medium text-gray-700 mb-1"
            >
              Stock
            </label>
            <input
              required
              type="number"
              id="stock"
              name="stock"
              placeholder="Enter stock quantity"
              value={formik.values.stock}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-3 border ${
                formik.errors.stock && formik.touched.stock
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200`}
            />
            {formik.errors.stock && formik.touched.stock && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.stock}</p>
            )}
          </div>

          {/* Image Input */}
          <div className="flex flex-col">
            <label
              htmlFor="image"
              className="text-lg font-medium text-gray-700 mb-1"
            >
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={(event) => {
                formik.setFieldValue("image", event.currentTarget.files[0]);
              }}
              className={`w-full px-4 py-3 border ${
                formik.errors.image && formik.touched.image
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200`}
            />
            {formik.errors.image && formik.touched.image && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.image}</p>
            )}
          </div>

          {/* Display Error Message */}
          {/* {error ? (
            <Alert color="failure">
              <span className="text-lg font-semibold">{error}</span>
            </Alert>
          ) : null} */}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-all duration-200"
          >
            {/* {loading ? <Spinner size="sm" /> : "Create Product"} */}
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
