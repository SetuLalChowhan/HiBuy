import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBinLine } from "react-icons/ri";
import { addQuantity, deleteItem, removeQuantity } from "../redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart } = useSelector((state) => state.user.user);
  const { currentUser } = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Calculate total price
  const calculateTotalPrice = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen space-y-8">
      {/* Cart Heading */}
      <h1 className="text-4xl font-semibold text-gray-900">
        Your <span className="text-teal-500">Cart</span>
      </h1>

      {/* Cart Items */}
      {cart.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {cart.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-6 border border-gray-200 rounded-lg shadow-md bg-white hover:shadow-lg transition-transform hover:scale-105"
            >
              {/* Product Image and Info */}
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-contain rounded-lg"
                />
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-gray-600">৳{item.price}</p>
                  <p className="text-gray-500">Size: {item.size}</p>
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <button
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                    onClick={() =>
                      dispatch(addQuantity({ id: item.id, size: item.size }))
                    }
                  >
                    +
                  </button>
                  <p className="text-lg font-semibold">{item.quantity}</p>
                  <button
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                    onClick={() =>
                      dispatch(removeQuantity({ id: item.id, size: item.size }))
                    }
                  >
                    -
                  </button>
                </div>
                <button
                  className="text-red-600 hover:text-red-700 transition-transform hover:scale-110"
                  onClick={() =>
                    dispatch(deleteItem({ id: item.id, size: item.size }))
                  }
                >
                  <RiDeleteBinLine size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg text-gray-600">Your cart is empty.</p>
      )}

      {/* Cart Totals */}
      {cart.length > 0 && (
        <div className="mt-10 border-t pt-6">
          <div className="flex justify-end items-start">
            <div className="w-full md:w-1/2 lg:w-1/3 space-y-4">
              <h2 className="text-3xl font-semibold text-gray-900">
                Cart <span className="text-teal-500">Totals</span>
              </h2>
              <div className="flex justify-between text-lg text-gray-700">
                <span>Subtotal</span>
                <span>৳{calculateTotalPrice()}</span>
              </div>
              <div className="flex justify-between text-lg text-gray-700">
                <span>Shipping</span>
                <span>৳70</span>
              </div>
              <div className="flex justify-between font-bold text-xl text-gray-900">
                <span>Total</span>
                <span>৳{calculateTotalPrice() + 70}</span>
              </div>
              {currentUser ? (
                currentUser.isVerified ? (
                  <button
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-lg transition duration-300"
                    onClick={() => navigate("/place-order")}
                  >
                    Proceed to Checkout
                  </button>
                ) : (
                  <p className="text lg font-semibold text-red-500">
                    Please Verify Your Account To CheckOut
                  </p>
                )
              ) : (
                <p className="text-lg">
                  Please{" "}
                  <Link className="font-semibold text-teal-500" to={"/login"}>
                    Login
                  </Link>{" "}
                  to Checkout
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
