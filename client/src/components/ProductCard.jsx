import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Importing Framer Motion for animations

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product._id}`}
      className="block bg-white shadow-md rounded-lg overflow-hidden transform transition hover:shadow-xl hover:-translate-y-1"
    >
      {/* Image Section */}
      <motion.div
        className="overflow-hidden"
        whileHover={{ scale: 1.05 }} // Slight scaling animation on hover
        transition={{ duration: 0.3 }}
      >
        <img
          className="w-full object-contain transition-transform duration-500 ease-in-out hover:scale-110"
          src={product?.image}
          alt={product.name}
        />
      </motion.div>

      {/* Text Section */}
      <div className="p-4">
        {/* Product Name */}
        <p className="text-lg font-semibold text-gray-800 h-12 mb-2 truncate">
          {product.name}
        </p>

        {/* Product Price */}
        <p className="text-xl font-medium text-gray-700">{product.price} Tk</p>
      </div>
    </Link>
  );
};

export default ProductCard;
