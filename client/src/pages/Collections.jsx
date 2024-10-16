import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../redux/product/productSlice";
import Title from "../components/Title";
import { Spinner } from "flowbite-react";
import ProductCard from "../components/ProductCard";

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
    const maxButtons = 5; // maximum number of visible buttons
    let startPage, endPage;

    if (totalPages <= maxButtons) {
      // If total pages are less than or equal to max buttons, show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // If the active page is near the beginning
      if (activePage <= Math.ceil(maxButtons / 2)) {
        startPage = 1;
        endPage = maxButtons;
      }
      // If the active page is near the end
      else if (activePage + Math.floor(maxButtons / 2) >= totalPages) {
        startPage = totalPages - maxButtons + 1;
        endPage = totalPages;
      }
      // If the active page is somewhere in the middle
      else {
        startPage = activePage - Math.floor(maxButtons / 2);
        endPage = activePage + Math.floor(maxButtons / 2);
      }
    }

    // Build the pagination buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePage(i)}
          aria-label={`Go to page ${i}`}
          className={`p-2 px-4 rounded transition duration-200 ${
            i === activePage
              ? "bg-blue-500 text-white font-bold"
              : "bg-gray-200 text-gray-600"
          } hover:bg-blue-600 hover:text-white`}
        >
          {i}
        </button>
      );
    }

    // Add 'First' and 'Last' buttons
    return (
      <div className="flex justify-center space-x-2 mt-8">
        {activePage > 1 && (
          <>
            <button
              onClick={() => handlePage(1)}
              className="p-2 px-4 rounded bg-gray-200 text-gray-600 hover:bg-blue-600 hover:text-white transition duration-200"
            >
              First
            </button>
            {activePage > 2 && <span className="p-2">...</span>}
          </>
        )}
        {buttons}
        {activePage < totalPages - 1 && (
          <>
            {activePage < totalPages - 2 && <span className="p-2">...</span>}
            <button
              onClick={() => handlePage(totalPages)}
              className="p-2 px-4 rounded bg-gray-200 text-gray-600 hover:bg-blue-600 hover:text-white transition duration-200"
            >
              Last
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      {/* Filter Section */}
      <div className="mb-6 flex flex-col lg:items-center lg:justify-between gap-4">
        <input
          type="text"
          value={search}
          onChange={handleFilterChange(setSearch)}
          placeholder="Search products..."
          className="border border-gray-300 p-3 rounded-md w-full lg:max-w-6xl transition focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        <div className="flex flex-col lg:flex-row gap-5">
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

      {/* Products Section */}
      <div ref={productsContainerRef} className="mb-10">
        <Title
          title="All"
          title2="Collections"
          para="Explore your favourite Products"
        />

        {error ? (
          <p className="text-red-600 text-2xl mt-5">{error}</p>
        ) : loading ? (
          <div className="flex items-center justify-center h-48">
            <Spinner className="h-24 w-24" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-5">
            {allProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {error
        ? ""
        : totalPages > 1 && renderPaginationButtons()}
    </div>
  );
};

export default Collections;
