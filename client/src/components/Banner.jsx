import React from "react";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="w-full flex flex-col md:flex-row border-2 border-gray-300 bg-gray-100">
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:items-start space-y-4">
        <p className="text-teal-500 text-sm uppercase tracking-widest">
          Our Best Sellers
        </p>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
          Latest Arrival
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Discover the latest collection of trendy outfits.
        </p>
        <Link to={"/collections"} className="bg-teal-500 text-white px-6 py-3 rounded-full font-semibold mt-4 hover:bg-teal-600 transition-colors">
          Shop Now
        </Link>
      </div>
      <div className="flex-1">
        <img
          src="/model.jpg"
          alt="Banner"
          className="w-full h-full object-cover transform -scale-x-100"
        />
      </div>
    </div>
  );
};

export default Banner;
