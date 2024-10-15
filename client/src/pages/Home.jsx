import React, { useEffect, useState } from "react";
import Banner from "../components/Banner";
import axios from "axios";
import ProductCard from "../components/ProductCard";
export default function Home() {
  const [latestProducts, setLatestProdcuts] = useState([]);

  useEffect(() => {
    const fetchLatestProduct = async () => {
      const response = await axios.get(
        `http://localhost:3000/api/products/all-products?latest=true&startIndex=0&limit=10`
      );
      setLatestProdcuts(response.data.products);
    };

    fetchLatestProduct();
  }, []);
  console.log(latestProducts);
  return (
    <div className="container">
      <Banner />
      {/* Latest Collections */}
      <div className="w-full py-10">
        <h1 className=" text-center text-4xl font-semibold text-gray-800 mb-4">
          <span className="text-teal-500 ">Latest</span> Collections
        </h1>
        <p className=" mx-auto text-center text-lg text-gray-500 leading-relaxed max-w-6xl">
          "Explore our meticulously crafted collections, designed to reflect the
          latest trends in fashion and style. Each piece embodies timeless
          elegance, ensuring you stand out in every moment."
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-5 ">
          {latestProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
