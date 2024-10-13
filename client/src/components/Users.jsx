import React, { useState, useEffect, useRef } from "react";
import {
  getAllUsers,
  userDeleted,
  userRoleChange,
} from "../redux/user/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { Spinner } from "flowbite-react";

const Users = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const { users, totalUsers, showmore, loading, error } = useSelector(
    (state) => state.user.user
  );
  const scrollPositionRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(getAllUsers({ query: searchQuery, toast }));
  };

  const handleShowmore = () => {
    let startIndex = totalUsers;
    scrollPositionRef.current = window.scrollY;
    dispatch(getAllUsers({ startIndex }));
  };

  const handleRoleChange = (userId, admin) => {
    dispatch(userRoleChange({ userId, isAdmin: !admin, toast }));
  };

  useEffect(() => {
    dispatch(getAllUsers({}));
  }, [dispatch]);

  useEffect(() => {
    // Restore scroll position after products are loaded
    if (scrollPositionRef.current !== null) {
      window.scrollTo(0, scrollPositionRef.current);
    }
  }, [users]);

  const handleDelete = (userId) => {
    dispatch(userDeleted({ userId, toast }));
  };

  return (
    <div className="admin-users p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        User Management
      </h1>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
      >
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-96 focus:ring focus:ring-blue-500 transition duration-200"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Users List - One Card per Row */}
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : loading ? (
        <div className="flex items-center justify-center h-48">
          <Spinner className="h-24 w-24" />
        </div>
      ) : (
        <div className="users-list flex flex-col gap-6">
          {users?.map((user) => (
            <div
              key={user._id}
              className="user-card bg-white shadow-lg rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between transition-transform hover:scale-105"
            >
              <div className="flex items-center mb-4 sm:mb-0">
                <img
                  src={
                    `http://localhost:3000/${user.avatar}` ||
                    "/default-avatar.png"
                  }
                  alt={`${user.name}'s profile`}
                  className="w-20 h-20 rounded-full object-cover border border-gray-300 shadow"
                />
                <div className="ml-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {user.name}
                  </h2>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="admin-status mt-2">
                    {user.isAdmin ? (
                      <span className="text-green-600 font-semibold">
                        Admin
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">User</span>
                    )}
                  </div>
                  {/* Verification Status */}
                  <div className="verification-status mt-2">
                    {user.isVerified ? (
                      <span className="text-blue-600 font-semibold">
                        Verified ✅
                      </span>
                    ) : (
                      <span className="text-yellow-600 font-semibold">
                        Not Verified ❌
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 sm:mt-0 flex space-x-4">
                <button
                  onClick={() => handleRoleChange(user._id, user.isAdmin)}
                  className={`text-white px-4 py-2 rounded-lg transition-colors ${
                    user.isAdmin
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {user.isAdmin ? "Revoke Admin" : "Make Admin"}
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show More Button */}
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
  );
};

export default Users;
