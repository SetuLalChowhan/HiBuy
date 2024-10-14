import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Spinner, Alert } from "flowbite-react";
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
        values.image; 
  
      if (hasChanges) {
        dispatch(editProduct({ values, toast, id }));
      } else {
        toast.error("No changes detected.");
      }
    },
  });

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue("image", file);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-5">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-2xl border border-gray-300">
        {/* Header Section */}
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Edit Product
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

          {/* Image Input and Preview */}
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
              onChange={handleImageChange}
              className={`w-full px-4 py-3 border ${
                formik.errors.image && formik.touched.image
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200`}
            />
            {/* Conditionally render image */}
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
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {loading ? <Spinner size="sm" light /> : "Edit Product"}
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert color="red" className="mt-4">
              {error}
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
