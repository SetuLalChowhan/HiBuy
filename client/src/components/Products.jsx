import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, fetchProducts } from "../redux/product/productSlice";
import { Spinner } from "flowbite-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Modal } from "flowbite-react";
import { FaTrashAlt } from "react-icons/fa";

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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const scrollPositionRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  const limit = 10;
  const values = {
    category,
    type,
    search,
    minPrice,
    maxPrice,
    sortOption,
    limit,
  };

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
    setSelectedProduct(product);
    setShowModal(true);
  };

  return (
    <div className="container p-6">
      {/* Search & Filters */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <input
          type="text"
          value={search}
          onChange={handleFilterChange(setSearch)}
          placeholder="Search products..."
          className="border border-gray-300 p-3 rounded-md w-full lg:max-w-sm transition focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto">
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

      {/* Products Table */}
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : loading ? (
        <div className="flex items-center justify-center h-48">
          <Spinner className="h-24 w-24" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Availabe Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-16 w-16 object-contain rounded-md"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ৳{product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.sold}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleModal(product)}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                    >
                      Available Size
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link to={`/product-edit/${product._id}`}>
                      <button className="text-green-600 hover:text-green-900 mr-2">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() =>
                        dispatch(deleteProduct({ id: product._id, toast }))
                      }
                      className="text-red-600 px-2 py-2  hover:text-red-800 transition duration-200"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal for Product Sizes */}
          <Modal show={showModal} onClose={() => setShowModal(false)} size="md">
            <Modal.Header className="bg-gray-200 border-b border-gray-300">
              <h2 className="text-lg font-semibold text-gray-800">
                Available Sizes
              </h2>
            </Modal.Header>
            <Modal.Body>
              <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Sizes & Stock
                </h3>
                <div className="space-y-3">
                  {selectedProduct?.sizes?.map((size) => (
                    <div
                      key={size.size}
                      className="flex justify-between items-center border-b border-gray-300 py-2"
                    >
                      <p className="text-gray-700 font-medium">{size.size}</p>
                      <p className="text-gray-900 font-semibold">
                        {size.stock}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </Modal.Footer>
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
