import React, { useState, useEffect } from "react";
import { getAllUsers, userRoleChange } from "../redux/user/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

const Users = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const { users, totalUsers, showmore } = useSelector((state) => state.user);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(getAllUsers({ query: searchQuery, toast }));
  };

  useEffect(() => {
    dispatch(getAllUsers({}));
  }, [dispatch]);

  const handleShowmore = () => {
    let startIndex = totalUsers;
    dispatch(getAllUsers({ startIndex }));
  };

  const handleRoleChange = (userId, admin) => {
    dispatch(userRoleChange({ userId, isAdmin: !admin }));
  };

  return (
    <div className="admin-users p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin - Users Management</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-96 focus:ring focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Users List - One Card per Row */}
      <div className="users-list flex flex-col gap-6">
        {users?.map((user) => (
          <div
            key={user._id}
            className="user-card bg-white shadow-lg rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between transition-transform hover:scale-105"
          >
            <div className="flex items-center">
              <img
                src={`http://localhost:3000/${user.avatar}` || "/default-avatar.png"}
                alt={`${user.name}'s profile`}
                className="w-20 h-20 rounded-full object-cover mr-6"
              />
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
                <div className="admin-status mt-2">
                  {user.isAdmin ? (
                    <span className="text-green-600 font-bold">Admin</span>
                  ) : (
                    <span className="text-red-600 font-bold">User</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 sm:mt-0 flex space-x-4">
              <button
                onClick={() => handleRoleChange(user._id, user.isAdmin)}
                className={`${
                  user.isAdmin ? "bg-yellow-500" : "bg-green-500"
                } text-white px-4 py-2 rounded-lg hover:bg-opacity-90`}
              >
                {user.isAdmin ? "Make User" : "Make Admin"}
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      <div className="mt-6 text-center">
        {showmore && (
          <button
            onClick={handleShowmore}
            className="w-full sm:w-auto text-teal-600 px-6 py-3 rounded-lg hover:text-teal-700"
          >
            Show More
          </button>
        )}
      </div>
    </div>
  );
};

export default Users;
