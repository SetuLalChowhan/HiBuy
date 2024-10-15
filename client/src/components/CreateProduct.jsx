import React, { useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Spinner, Alert } from "flowbite-react";
import { createProductSchema } from "../schema";
import { createProduct } from "../redux/product/productSlice";

const CreateProduct = () => {
  const { loading, error } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const [sizeStockPairs, setSizeStockPairs] = useState([
    { size: "", stock: "" },
  ]);

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      description: "",
      category: "",
      type: "",
      image: null,
      sizes: sizeStockPairs,
    },
    validationSchema: createProductSchema,
    onSubmit: (values) => {
      const formattedSizes = values.sizes.map((pair) => ({
        size: pair.size !== "" ? pair.size : "default", // Set "default" if size is not selected
        stock: pair.stock || 0, // Set stock to 0 if not provided
      }));
      values.sizes = formattedSizes;
      dispatch(createProduct({ values, toast }));
    },
  });

  const handleAddSizeStock = () => {
    setSizeStockPairs([...sizeStockPairs, { size: "", stock: "" }]);
    formik.setFieldValue("sizes", [...sizeStockPairs, { size: "", stock: "" }]);
  };

  const handleRemoveSizeStock = (index) => {
    const updatedPairs = sizeStockPairs.filter((_, i) => i !== index);
    setSizeStockPairs(updatedPairs);
    formik.setFieldValue("sizes", updatedPairs);
  };

  const handleSizeStockChange = (index, field, value) => {
    const updatedPairs = [...sizeStockPairs];
    updatedPairs[index][field] = value;
    setSizeStockPairs(updatedPairs);
    formik.setFieldValue("sizes", updatedPairs);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Create New Product
        </h1>

        

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter product name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-3 border rounded-md ${
                formik.touched.name && formik.errors.name
                  ? "border-red-500"
                  : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-xs text-red-500 mt-1">
                {formik.errors.name}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              placeholder="Enter price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-3 border rounded-md ${
                formik.touched.price && formik.errors.price
                  ? "border-red-500"
                  : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            />
            {formik.touched.price && formik.errors.price && (
              <p className="text-xs text-red-500 mt-1">
                {formik.errors.price}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Enter product description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-3 border rounded-md ${
                formik.touched.description && formik.errors.description
                  ? "border-red-500"
                  : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-xs text-red-500 mt-1">
                {formik.errors.description}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-3 border rounded-md ${
                formik.touched.category && formik.errors.category
                  ? "border-red-500"
                  : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            >
              <option value="">Select category</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>
            {formik.touched.category && formik.errors.category && (
              <p className="text-xs text-red-500 mt-1">
                {formik.errors.category}
              </p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              name="type"
              value={formik.values.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-3 border rounded-md ${
                formik.touched.type && formik.errors.type
                  ? "border-red-500"
                  : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            >
              <option value="">Select type</option>
              <option value="topwear">Topwear</option>
              <option value="bottomwear">Bottomwear</option>
              <option value="winterwear">Winterwear</option>
            </select>
            {formik.touched.type && formik.errors.type && (
              <p className="text-xs text-red-500 mt-1">
                {formik.errors.type}
              </p>
            )}
          </div>

          {/* Sizes and Stock */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              Sizes and Stock
            </label>
            <div className="bg-white border border-gray-300 p-4 rounded-lg">
              <div className="space-y-4">
                {sizeStockPairs.map((pair, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <select
                      value={pair.size}
                      onChange={(e) =>
                        handleSizeStockChange(index, "size", e.target.value)
                      }
                      className="w-1/2 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Size</option>
                      <option value="S">Small</option>
                      <option value="M">Medium</option>
                      <option value="L">Large</option>
                      <option value="XL">X-Large</option>
                      <option value="XXL">XX-Large</option>
                    </select>
                    <input
                      type="number"
                      value={pair.stock}
                      placeholder="Stock"
                      onChange={(e) =>
                        handleSizeStockChange(index, "stock", e.target.value)
                      }
                      className="w-1/2 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSizeStock(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddSizeStock}
                className="mt-4 w-full px-4 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
              >
                Add Size/Stock
              </button>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) =>
                formik.setFieldValue("image", e.target.files[0])
              }
              className={`w-full px-4 py-3 border rounded-md ${
                formik.touched.image && formik.errors.image
                  ? "border-red-500"
                  : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            />
            {formik.touched.image && formik.errors.image && (
              <p className="text-xs text-red-500 mt-1">
                {formik.errors.image}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              disabled={loading}
            >
              {loading ? (
                <Spinner color="white" size="sm" />
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
