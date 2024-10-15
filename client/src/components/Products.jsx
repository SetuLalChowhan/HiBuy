import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, fetchProducts } from "../redux/product/productSlice";
import { Spinner } from "flowbite-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Modal } from "flowbite-react";

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error, totalProducts, showmore } = useSelector(
    (state) => state.product
  );
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null); // State to hold selected product
  const scrollPositionRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  const values = { category, type, search, minPrice, maxPrice, sortOption };

  const handleShowmore = () => {
    scrollPositionRef.current = window.scrollY;
    values.startIndex = totalProducts;
    dispatch(fetchProducts({ values }));
  };

  const handleFilterChange = (filterHandler) => (e) => {
    scrollPositionRef.current = window.scrollY;
    filterHandler(e.target.value);
  };

  useEffect(() => {
    dispatch(fetchProducts({ values }));
  }, [category, type, search, minPrice, maxPrice, sortOption]);

  useEffect(() => {
    if (scrollPositionRef.current !== null) {
      window.scrollTo(0, scrollPositionRef.current);
    }
  }, [products]);

  const handleModal = (product) => {
    console.log(product)
    setSelectedProduct(product); // Set the selected product
    setShowModal(true);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Search & Filters */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search Input */}
        <input
          type="text"
          value={search}
          onChange={handleFilterChange(setSearch)}
          placeholder="Search products..."
          className="border border-gray-300 p-3 rounded-md w-full lg:max-w-sm transition focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto">
          {/* Category Filter */}
          <select
            value={category}
            onChange={handleFilterChange(setCategory)}
            className="border border-gray-300 p-3 rounded-md w-full lg:w-auto transition focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Categories</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </select>

          {/* Type Filter */}
          <select
            value={type}
            onChange={handleFilterChange(setType)}
            className="border border-gray-300 p-3 rounded-md w-full lg:w-auto transition focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Types</option>
            <option value="topwear">Topwear</option>
            <option value="bottomwear">Bottomwear</option>
            <option value="winterwear">Winterwear</option>
          </select>

          {/* Price Filters */}
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={handleFilterChange(setMinPrice)}
            className="border border-gray-300 p-3 rounded-md w-full lg:w-auto transition focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={handleFilterChange(setMaxPrice)}
            className="border border-gray-300 p-3 rounded-md w-full lg:w-auto transition focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          {/* Sort Option */}
          <select
            value={sortOption}
            onChange={handleFilterChange(setSortOption)}
            className="border border-gray-300 p-3 rounded-md w-full lg:w-auto transition focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Sort by</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="latest">Latest Arrivals</option>
            <option value="bestSeller">Best Sellers</option>
          </select>
        </div>
      </div>

      {/* Products List */}
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : loading ? (
        <div className="flex items-center justify-center h-48">
          <Spinner className="h-24 w-24" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
          {products.map((product) => (
            <div
              key={product._id}
              className="user-card bg-white shadow-lg rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between transition hover:scale-105 hover:shadow-2xl"
            >
              {/* Product Details */}
              <div className="flex flex-row items-center gap-5 mb-4">
                {/* Product Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-28 w-28 object-contain rounded-md"
                />
                {/* Product Info */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Price:</span> ৳
                    {product.price}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Category:</span>{" "}
                    {product.category}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Stock:</span>{" "}
                    {product.stock}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Sold:</span>{" "}
                    {product.sold}
                  </p>
                  <button
                    onClick={() => handleModal(product)} // Pass the product to the modal handler
                    className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md shadow-lg hover:bg-blue-700 transition-colors duration-300"
                  >
                    Available Size
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex space-x-4">
                <Link to={`/product-edit/${product._id}`}>
                  <button className="px-4 py-2 h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() =>
                    dispatch(deleteProduct({ id: product._id, toast }))
                  }
                  className="px-4 py-2 h-10 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            popup
            size={"md"}
          >
            <Modal.Header />
            <Modal.Body>
              <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-2">Available Sizes</h2>
                <div className="space-y-2">
                  {/* Show sizes of the selected product */}
                  {selectedProduct?.sizes?.map((size) => (
                    <div
                      key={size.size}
                      className="flex justify-between items-center border-b py-2"
                    >
                      <p className="text-gray-700 font-medium">{size.size}</p>
                      <p className="text-gray-900 font-semibold">{size.stock}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Modal.Body>
          </Modal>

          {showmore && (
            <div className="mt-6 text-center">
              <button
                onClick={handleShowmore}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
