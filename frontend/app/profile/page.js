"use client"; // important if you’re using Next.js App Router

import React, { useContext } from "react";
import { UserContext } from "../context/usercontext";

const Profile = () => {
  const { user } = useContext(UserContext);

  if (!user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">No user data</h2>
          <p className="text-gray-500 mt-2">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-6">{user.name}</h1>
          <p className="text-sm text-gray-500 mb-6">{user.role}</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600 font-medium">User ID</span>
            <span className="text-gray-800 font-mono text-sm">{user.id}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600 font-medium">Email</span>
            <span className="text-gray-800">{user.email}</span>
          </div>
        </div>

        <button
          onClick={() => alert("Edit functionality coming soon!")}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
