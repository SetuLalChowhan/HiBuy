import React, { useEffect } from "react";
import { FaUsers, FaBoxOpen, FaShoppingCart } from "react-icons/fa"; // Importing icons from react-icons
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/product/productSlice";
import { getAllUsers } from "../redux/user/userSlice";
import { fetchOrders } from "../redux/order/orderSlice";
const AllDash = () => {
  const values = {};

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProducts({ values }));
    dispatch(getAllUsers({}));
    dispatch(fetchOrders({ values }));
  }, []);

  const { fixedTotal } = useSelector((state) => state.product);
  const { fixedTotalUser } = useSelector((state) => state.user.user);
  const { fixedTotalOrder } = useSelector((state) => state.order);
  // Sample data for demonstration purposes
  const totalUsers = fixedTotalUser; // Replace with your dynamic data
  const totalProducts = fixedTotal; // Replace with your dynamic data
  const totalOrders = fixedTotalOrder; // Replace with your dynamic data

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        HiBuy Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
        {/* Total Users Card */}
        <div className="bg-blue-500 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center text-white transition-transform transform hover:scale-105">
          <FaUsers className="text-6xl mb-4" />
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-3xl font-bold mt-2">{totalUsers}</p>
        </div>

        {/* Total Products Card */}
        <div className="bg-green-500 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center text-white transition-transform transform hover:scale-105">
          <FaBoxOpen className="text-6xl mb-4" />
          <h2 className="text-xl font-semibold">Total Products</h2>
          <p className="text-3xl font-bold mt-2">{totalProducts}</p>
        </div>

        {/* Total Orders Card */}
        <div className="bg-yellow-500 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center text-white transition-transform transform hover:scale-105">
          <FaShoppingCart className="text-6xl mb-4" />
          <h2 className="text-xl font-semibold">Total Orders</h2>
          <p className="text-3xl font-bold mt-2">{totalOrders}</p>
        </div>
      </div>
    </div>
  );
};

export default AllDash;
