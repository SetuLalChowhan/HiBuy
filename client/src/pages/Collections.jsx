import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../redux/product/productSlice";
import Title from "../components/Title";
import { Spinner } from "flowbite-react";
import ProductCard from "../components/ProductCard";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion"; // Import Framer Motion

const Collections = () => {
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;

  const { allProducts, loading, error, allProductsDefault } = useSelector(
    (state) => state.product
  );
  const dispatch = useDispatch();

  const totalPages = Math.ceil(allProductsDefault / itemsPerPage);
  const productsContainerRef = useRef(null);

  const values = {
    category,
    type,
    search,
    minPrice,
    maxPrice,
    sortOption,
    limit: itemsPerPage,
  };

  const handleFilterChange = (filterHandler) => (e) => {
    setActivePage(1);
    filterHandler(e.target.value);
  };

  useEffect(() => {
    const startIndex = (activePage - 1) * itemsPerPage;
    dispatch(fetchProducts({ values: { ...values, startIndex } }));
  }, [category, type, search, minPrice, maxPrice, sortOption, activePage]);

  const handlePage = (page) => {
    setActivePage(page);
    productsContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage, endPage;

    if (totalPages <= maxButtons) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (activePage <= Math.ceil(maxButtons / 2)) {
        startPage = 1;
        endPage = maxButtons;
      } else if (activePage + Math.floor(maxButtons / 2) >= totalPages) {
        startPage = totalPages - maxButtons + 1;
        endPage = totalPages;
      } else {
        startPage = activePage - Math.floor(maxButtons / 2);
        endPage = activePage + Math.floor(maxButtons / 2);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <motion.button
          key={i}
          onClick={() => handlePage(i)}
          aria-label={`Go to page ${i}`}
          whileHover={{ scale: 1.05 }} // Hover animation
          className={`p-2 px-4 rounded-full transition duration-300 ease-in-out ${
            i === activePage
              ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold shadow-lg"
              : "bg-gray-100 text-gray-600"
          } hover:bg-gradient-to-r hover:from-blue-600 hover:to-teal-600 hover:text-white`}
        >
          {i}
        </motion.button>
      );
    }

    return (
      <div className="flex justify-center space-x-2 mt-8">
        {activePage > 1 && (
          <motion.button
            onClick={() => handlePage(1)}
            whileHover={{ scale: 1.05 }} // Hover animation
            className="p-2 px-4 rounded-full bg-gray-200 text-gray-600 hover:bg-blue-500 hover:text-white transition duration-300"
          >
            First
          </motion.button>
        )}
        {buttons}
        {activePage < totalPages && (
          <motion.button
            onClick={() => handlePage(totalPages)}
            whileHover={{ scale: 1.05 }} // Hover animation
            className="p-2 px-4 rounded-full bg-gray-200 text-gray-600 hover:bg-blue-500 hover:text-white transition duration-300"
          >
            Last
          </motion.button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      {/* Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex flex-col lg:items-center lg:justify-between gap-6"
      >
        <div className="relative w-full lg:max-w-6xl">
          <input
            type="text"
            value={search}
            onChange={handleFilterChange(setSearch)}
            placeholder="Search products..."
            className="border border-gray-300 p-3 rounded-full w-full transition focus:outline-none focus:ring-4 focus:ring-blue-300 pl-12"
          />
          <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500" />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:w-auto lg:gap-6 w-full">
          {/* Category Filter */}
          <select
            value={category}
            onChange={handleFilterChange(setCategory)}
            className="border border-gray-300 p-3 rounded-full w-full lg:w-auto transition focus:outline-none focus:ring-4 focus:ring-blue-300"
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
            className="border border-gray-300 p-3 rounded-full w-full lg:w-auto transition focus:outline-none focus:ring-4 focus:ring-blue-300"
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
            className="border border-gray-300 p-3 rounded-full w-full lg:w-auto transition focus:outline-none focus:ring-4 focus:ring-blue-300"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={handleFilterChange(setMaxPrice)}
            className="border border-gray-300 p-3 rounded-full w-full lg:w-auto transition focus:outline-none focus:ring-4 focus:ring-blue-300"
          />

          {/* Sort Option */}
          <select
            value={sortOption}
            onChange={handleFilterChange(setSortOption)}
            className="border border-gray-300 p-3 rounded-full w-full lg:w-auto transition focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            <option value="">Sort by</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="latest">Latest Arrivals</option>
            <option value="bestSeller">Best Sellers</option>
          </select>
        </div>
      </motion.div>

      {/* Products Section */}
      <motion.div
        ref={productsContainerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <Title title="All" title2="Collections" para="Explore your favourite Products" />

        {error ? (
          <p className="text-red-600 text-2xl mt-5">{error}</p>
        ) : loading ? (
          <div className="flex items-center justify-center h-48">
            <Spinner className="h-24 w-24" />
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-8 transition-all"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {allProducts?.length ? (
              allProducts.map((product, idx) => (
                <motion.div key={idx} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <p className="text-xl mt-5 text-red-600">No products found</p>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Pagination */}
      {renderPaginationButtons()}
    </div>
  );
};

export default Collections;
