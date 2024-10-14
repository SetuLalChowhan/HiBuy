import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, fetchProducts } from "../redux/product/productSlice";
import { Spinner } from "flowbite-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error, totalProducts, showmore } = useSelector(
    (state) => state.product
  );
  const [category, setCategory] = React.useState("");
  const [type, setType] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [minPrice, setMinPrice] = React.useState("");
  const [maxPrice, setMaxPrice] = React.useState("");
  const [sortOption, setSortOption] = React.useState("");
  const scrollPositionRef = useRef(null); // To store scroll position

  const values = {
    category,
    type,
    search,
    minPrice,
    maxPrice,
    sortOption,
  };

  const handleShowmore = () => {
    // Save current scroll position
    scrollPositionRef.current = window.scrollY;

    let startIndex = totalProducts;
    values.startIndex = startIndex;
    dispatch(fetchProducts({ values }));
  };

  // Save the scroll position before applying any filter or search
  const handleFilterChange = (filterHandler) => (e) => {
    scrollPositionRef.current = window.scrollY; // Save scroll position
    filterHandler(e.target.value);
  };

  useEffect(() => {
    dispatch(fetchProducts({ values }));
  }, [category, type, search, minPrice, maxPrice, sortOption]);

  useEffect(() => {
    // Restore scroll position after products are loaded
    if (scrollPositionRef.current !== null) {
      window.scrollTo(0, scrollPositionRef.current);
    }
  }, [products]);

  return (
    <div className="container mx-auto ">
      {/* Search & Filters */}
      <div className="mb-6 flex flex-col  lg:items-center lg:justify-between gap-4">
        {/* Search Input */}
        <div className="flex-row">
          <input
            type="text"
            value={search}
            onChange={handleFilterChange(setSearch)} // Save scroll before applying search
            placeholder="Search products..."
            className="border border-gray-300 p-3 rounded-md w-full transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <div className="flex lg:flex-row flex-col gap-4 w-full lg:w-auto">
          {/* Category Filter */}
          <select
            value={category}
            onChange={handleFilterChange(setCategory)} // Save scroll before applying category
            className="border border-gray-300 p-3 rounded-md w-full lg:w-auto transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="">All Categories</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </select>

          {/* Type Filter */}
          <select
            value={type}
            onChange={handleFilterChange(setType)} // Save scroll before applying type
            className="border border-gray-300 p-3 rounded-md w-full lg:w-auto transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-600"
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
            onChange={handleFilterChange(setMinPrice)} // Save scroll before applying min price
            className="border border-gray-300 p-3 rounded-md w-full lg:w-auto transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={handleFilterChange(setMaxPrice)} // Save scroll before applying max price
            className="border border-gray-300 p-3 rounded-md w-full lg:w-auto transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-600"
          />

          {/* Sort Option */}
          <select
            value={sortOption}
            onChange={handleFilterChange(setSortOption)} // Save scroll before applying sort option
            className="border border-gray-300 p-3 rounded-md w-full lg:w-auto transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="">Sort by</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="latest">Latest Arrivals</option>
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
        <div className="grid grid-cols-1 container max-w-4xl  gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="user-card bg-white shadow-lg rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between transition-transform hover:scale-105 "
            >
              {/* Product Details */}
              <div className="flex flex-row justify-center items-center gap-5  mb-4">
                {/* Product Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-28 w-28 object-contain rounded-md mb-2"
                />
                {/* Product Info */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Price:</span> ৳{product.price}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Category:</span> {product.category}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Stock:</span> {product.stock}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Sold:</span> {product.sold}
                  </p>
                </div>
              </div>

              {/* Actions - separated from product details */}
              <div className="mt-4 flex justify-center md:justify-end space-x-4 items-center">
                <Link to={`/product-edit/${product._id}`}>
                  <button className="px-4 py-2 h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => dispatch(deleteProduct({ id: product._id, toast }))}
                  className="px-4 py-2 h-10 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          <div className="mt-6 text-center">
            {showmore && (
              <button
                onClick={handleShowmore}
                className="w-full sm:w-auto  text-teal-500 px-6 py-3 rounded-lg "
              >
                Show More
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
