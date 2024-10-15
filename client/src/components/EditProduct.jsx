import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { editProduct, getSingleProduct } from "../redux/product/productSlice";
import { editProdcutSchema } from "../schema";

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { singleProduct, loading, error } = useSelector(
    (state) => state.product
  );
  const [imagePreview, setImagePreview] = useState(null);
  const [sizeStockPairs, setSizeStockPairs] = useState([
    { size: "", stock: "" },
  ]);

  useEffect(() => {
    dispatch(getSingleProduct(id));
  }, [id, dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: singleProduct?.name || "",
      price: singleProduct?.price || "",
      description: singleProduct?.description || "",
      category: singleProduct?.category || "",
      type: singleProduct?.type || "",
      stock: singleProduct?.stock || "",
      image: null,
      sizes: sizeStockPairs,
    },
    validationSchema: editProdcutSchema,
    onSubmit: (values) => {
      const hasChanges =
        values.name !== formik.initialValues.name ||
        values.price !== formik.initialValues.price ||
        values.description !== formik.initialValues.description ||
        values.category !== formik.initialValues.category ||
        values.type !== formik.initialValues.type ||
        values.stock !== formik.initialValues.stock ||
        values.sizes !== formik.initialValues.sizes ||
        values.image;

      const formattedSizes = values.sizes.filter(
        (pair) => pair.size && pair.stock
      );

      values.sizes = formattedSizes;

      if (hasChanges) {
        dispatch(editProduct({ values, toast, id }));
      } else {
        toast.error("No changes detected.");
      }
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

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue("image", file);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-3xl border border-gray-200">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Edit Product
        </h1>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Product Name
            </label>
            <input
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
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
            />
            {formik.errors.name && formik.touched.name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <label
              htmlFor="price"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Price
            </label>
            <input
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
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
            />
            {formik.errors.price && formik.touched.price && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.price}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
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
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
            />
            {formik.errors.description && formik.touched.description && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.description}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label
              htmlFor="category"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-3 border ${
                formik.errors.category && formik.touched.category
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
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

          {/* Type */}
          <div className="flex flex-col">
            <label
              htmlFor="type"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formik.values.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-3 border ${
                formik.errors.type && formik.touched.type
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
            >
              <option value="">Select type</option>
              <option value="topwear">Top Wear</option>
              <option value="bottomwear">Bottom Wear</option>
              <option value="winterwear">Winter Wear</option>
            </select>
            {formik.errors.type && formik.touched.type && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.type}</p>
            )}
          </div>

          {/* Sizes and Stock */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              Sizes and Stock
            </label>
            <div className="bg-white shadow-md rounded-lg p-4">
               
                <div className="space-y-2">
                  {singleProduct?.sizes?.map((p) => (
                    <div
                      key={p.size}
                      className="flex justify-between items-center border-b py-2"
                    >
                      <p className="text-gray-700 font-medium">{p.size}</p>
                      <p className="text-gray-900 font-semibold">{p.stock}</p>
                    </div>
                  ))}
                </div>
              </div>
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
          <div className="flex flex-col">
            <label
              htmlFor="image"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className={`w-full px-4 py-3 border ${
                formik.errors.image && formik.touched.image
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
            />
            <div className="mt-4">
              <img
                src={
                  imagePreview || `http://localhost:3000/${singleProduct.image}`
                }
                alt="Product Preview"
                className="w-48 h-48 object-cover mt-2 border border-gray-300 rounded-md"
              />
            </div>
            {formik.errors.image && formik.touched.image && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.image}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-between items-center mt-6">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
            {error && (
              <p className="text-red-500 text-sm mt-4">{error}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
