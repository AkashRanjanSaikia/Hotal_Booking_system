"use client";

import { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { Loader, Plus, Pencil, MapPin } from "lucide-react";
import Link from "next/link";
import { UserContext } from "../../context/usercontext";

function LoadingState() {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-4"
      >
        <Loader className="w-10 h-10 text-blue-500" />
      </motion.div>
      <p className="text-gray-600 font-medium">
        Loading your hotel listings...
      </p>
    </div>
  );
}

export default function ManagerDashboard() {
  const { user } = useContext(UserContext);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMyHotels(u) {
      if (!u?.id) return;
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `http://localhost:8000/listings/my-hotels?userId=${u.id}`,
          { credentials: "include", cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to fetch your hotels");
        const data = await res.json();
        setListings(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Unable to load your hotels.");
      } finally {
        setLoading(false);
      }
    }
    fetchMyHotels(user);
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-b from-blue-50 to-gray-50 pt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Manager sign in required
            </h2>
            <p className="text-gray-600 mt-2">
              Please log in to view and manage your hotel listings.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 mt-6 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Manager Dashboard
              </h1>
              <p className="mt-2 text-md text-gray-600 max-w-2xl">
                View and manage the hotels you’ve added to CozyStay.
              </p>
            </div>
            <Link
              href="/add-hotel"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-sm hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" /> Add New Hotel
            </Link>
          </div>

          <div className="mt-6 inline-flex items-center gap-3 px-5 py-3 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl shadow-inner text-sm text-gray-800 font-semibold border border-blue-100">
            <span className="text-indigo-600">{listings.length}</span>
            <span className="text-gray-700">
              {listings.length === 1 ? "hotel listed" : "hotels listed"}
            </span>
          </div>
        </motion.header>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6">
            <p className="text-red-600">{error}</p>
          </div>
        ) : listings.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-12"
          >
            {listings.map((hotel) => (
              <article
                key={hotel._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
              >
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  {hotel.mainImage?.url ? (
                    <img
                      src={hotel.mainImage.url}
                      alt={hotel.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No image
                    </div>
                  )}
                  <div className="absolute left-3 top-3 flex items-center gap-2 bg-white/90 px-3 py-1 rounded-full text-xs text-gray-700 shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-medium truncate max-w-[140px]">
                      {hotel.location || "Unknown"}
                    </span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col p-4 gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 truncate">
                      {hotel.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {hotel.country || "Country not set"}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-blue-600">
                        ₹{hotel.price}
                      </span>{" "}
                      <span className="text-xs text-gray-500">/ night</span>
                    </div>
                    <Link
                      href={`/manager/hotels/${hotel._id}/edit`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Update
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="py-20 text-center bg-white rounded-2xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <h3 className="text-xl font-semibold text-gray-800">
                No hotels listed yet
              </h3>
              <p className="text-gray-600 max-w-md">
                You haven’t listed any properties. Add your first hotel to get
                started.
              </p>
              <Link
                href="/add-hotel"
                className="inline-flex items-center gap-2 mt-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" /> Add New Hotel
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
