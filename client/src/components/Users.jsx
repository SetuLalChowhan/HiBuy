import React, { useState, useEffect, useRef } from "react";
import {
  getAllUsers,
  userDeleted,
  userRoleChange,
} from "../redux/user/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { Spinner } from "flowbite-react";
import { FaTrash, FaTrashAlt, FaUserShield } from "react-icons/fa";

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
    if (scrollPositionRef.current !== null) {
      window.scrollTo(0, scrollPositionRef.current);
    }
  }, [users]);

  const handleDelete = (userId) => {
    dispatch(userDeleted({ userId, toast }));
  };

  return (
    <div className="admin-users p-6 mx-auto bg-gray-50 rounded-lg shadow-lg">
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
          className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Users List - Table Format */}
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : loading ? (
        <div className="flex items-center justify-center h-48">
          <Spinner className="h-24 w-24" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-600 text-left">
                <th className="py-3 px-4">Avatar</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-100">
                  <td className="py-3 px-4">
                    <img
                      src={
                        `http://localhost:3000/${user.avatar}` ||
                        "/default-avatar.png"
                      }
                      alt={`${user.name}'s profile`}
                      className="w-12 h-12 rounded-full border border-gray-300 object-cover"
                    />
                  </td>
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    {user.isAdmin ? (
                      <span className="text-green-600 font-semibold">
                        Admin
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">User</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {user.isVerified ? (
                      <span className="text-blue-600 font-semibold">
                        Verified
                      </span>
                    ) : (
                      <span className="text-yellow-600 font-semibold">
                        Not Verified
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 flex space-x-2">
                    <button
                      onClick={() => handleRoleChange(user._id, user.isAdmin)}
                      className={`text-white flex items-center px-4 py-2 rounded-lg transition-colors ${
                        user.isAdmin
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      <FaUserShield className="mr-2 text-lg" />
                      {user.isAdmin ? "Revoke Admin" : "Make Admin"}
                    </button>

                    <button
                      className="text-red-600 px-4 py-2  hover:text-red-800 transition duration-200"
                      onClick={() => handleDelete(user._id)}
                    >
                      
                    
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Show More Button */}
      <div className="mt-6 text-center">
        {showmore && (
          <button
            onClick={handleShowmore}
            className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 transitions"
          >
           Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default Users;
