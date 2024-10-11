import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAllUsers } from "../redux/user/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
 
const Users = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const { users, totalUsers, showmore } = useSelector((state) => state.user);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(getAllUsers({ query: searchQuery,toast }));
  };

  useEffect(() => {
    dispatch(getAllUsers({}));
    const startIndex = totalUsers;
    console.log(startIndex);
  }, []);

  const handleShowmore = () => {
    let startIndex = totalUsers;
    dispatch(getAllUsers({ startIndex }));
  };

  console.log(showmore);
  return (
    <div className="admin-users">
      <h1 className="text-xl font-bold mb-4">Admin - Users Management</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2">
          Search
        </button>
      </form>

      {/* Users List */}
      <div className="users-list">
        <div className="user-table grid grid-cols-1 gap-6">
          {users?.map((user) => (
            <div
              key={user._id}
              className="user-card border rounded p-4 flex items-center justify-between"
            >
              <div className="flex items-center">
                <img
                  src={
                    `http://localhost:3000/${user.avatar}` ||
                    "/default-avatar.png"
                  }
                  alt={`${user.name}'s profile`}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h2 className="text-lg font-semibold">{user.name}</h2>
                  <p className="text-gray-500">{user.email}</p>
                  <div className="admin-status mt-2">
                    {user.isAdmin ? (
                      <span className="text-green-500 font-bold">Admin</span>
                    ) : (
                      <span className="text-red-500 font-bold">User</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="user-actions mt-4 flex space-x-2">
                <button
                  onClick={() => toggleAdmin(user._id, user.isAdmin)}
                  className={`${
                    user.isAdmin ? "bg-yellow-500" : "bg-green-500"
                  } text-white px-3 py-1 rounded`}
                >
                  {user.isAdmin ? "Make User" : "Make Admin"}
                </button>
                <button
                  onClick={() => deleteUser(user._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Show More Button */}

      <div className="mt-6">
        <button
          onClick={handleShowmore}
          className="w-full text-teal-500 self-center text-sm py-7"
        >
          {showmore ? "Show more" : ""}
        </button>
      </div>
    </div>
  );
};

export default Users;
