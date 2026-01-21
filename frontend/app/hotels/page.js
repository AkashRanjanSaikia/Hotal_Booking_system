"use client";

import Card from "./card";
import { motion } from "framer-motion";
import { Search, Filter, MapPin, Loader, X } from "lucide-react";
import { Suspense, useState, useEffect , useContext } from "react";
import { UserContext } from "../context/usercontext";
import axios from "axios";

// Loading component for better UX during data fetching
function HotelsLoading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-4"
      >
        <Loader className="w-10 h-10 text-blue-500" />
      </motion.div>
      <p className="text-gray-600 font-medium">
        Loading amazing stays for you...
      </p>
    </div>
  );
}

// Filter component for hotel listings
function FilterOptions({ onFilterChange, activeFilters, onClearFilters }) {
  const filters = [
    { id: "luxury", label: "Luxury" },
    { id: "budget", label: "Budget" },
    { id: "pool", label: "Pool" },
    { id: "beachfront", label: "Beachfront" },
    { id: "pet-friendly", label: "Pet Friendly" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-6 bg-white p-4 rounded-lg shadow-md"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-700">Filter By:</h3>
        {activeFilters.length > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 flex items-center gap-1 hover:text-blue-800 transition-colors"
          >
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              activeFilters.includes(filter.id)
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// Main hotel listing component
function HotelsList() {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState([]);
  const [isFavorite, setIsFavorite] = useState([]);
  const { user } = useContext(UserContext);
  
  // Get search query from URL on component mount
  useEffect(() => {
    // Get the search query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('q');
    
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    async function fetchListings() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/listings`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }

        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.log("Error:", error);
      }
    }

    fetchListings();
  }, []);

  
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user?.id) return;
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/listings/favourites`,
          {
            params: { userId: user.id },
          }
        );
        const favourites = response.data.favourites || [];
        setIsFavorite(favourites.map((listing) => listing._id));
        console.log("Favourites:", favourites);
      } catch (error) {
        console.log("Error checking favorite status:", error);
      }
    };
    checkFavoriteStatus();
  }, [user?.id]);

  const getAverageRating = (reviews = []) => {
    if (!Array.isArray(reviews) || reviews.length === 0) return null;
    const numericRatings = reviews
      .map((review) => review?.rating)
      .filter((value) => typeof value === "number" && !Number.isNaN(value));
    if (numericRatings.length === 0) return null;
    const total = numericRatings.reduce((sum, value) => sum + value, 0);
    return total / numericRatings.length;
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Discover Hotels
            </h1>
            <p className="mt-2 text-md text-gray-600 max-w-2xl">
              Browse our curated collection of premium stays — experience
              comfort, luxury, and unforgettable moments.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm text-gray-700 font-medium">
            <span>{listings.length}</span>
            <span>{listings.length === 1 ? "property" : "properties"}</span>
            <span>available</span>
          </div>
        </div>

        {showFilters && (
          <FilterOptions
            onFilterChange={(filterId) => {
              setActiveFilters((prev) =>
                prev.includes(filterId)
                  ? prev.filter((id) => id !== filterId)
                  : [...prev, filterId]
              );
            }}
            activeFilters={activeFilters}
            onClearFilters={() => setActiveFilters([])}
          />
        )}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by location, hotel name..."
              className="pl-10 pr-4 py-3 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
              showFilters
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Filter className={`h-5 w-5 ${showFilters ? "text-white" : ""}`} />
            <span>{showFilters ? "Hide filters" : "Filters"}</span>
            {activeFilters.length > 0 && (
              <span className="ml-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilters.length}
              </span>
            )}
          </button>
        </div>
      </motion.header>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Filter listings based on search query and active filters */}
        {(() => {
          // Filter listings based on search and active filters
          const filteredListings = listings.filter((listing) => {
            const matchesSearch =
              searchQuery === "" ||
              listing.title
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              listing.country
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              listing.location
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase());

            // Simple filter simulation
            const matchesFilters =
              activeFilters.length === 0 ||
              activeFilters.some((filter) => {
                if (filter === "luxury" && listing.price > 2000) return true;
                if (filter === "budget" && listing.price < 1000) return true;
                return false;
              });

            return matchesSearch && matchesFilters;
          });

          if (filteredListings.length > 0) {
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-12">
                {filteredListings.map((hotel, index) => (
                  <motion.div
                    key={hotel._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card
                      id={hotel._id}
                      title={hotel.title}
                      location={hotel.location}
                      country={hotel.country}
                      price={hotel.price}
                      image={hotel.mainImage?.url}
                      isFavorite={isFavorite.includes(hotel._id)}
                      rating={getAverageRating(hotel.reviews)}
                    />
                  </motion.div>
                ))}
              </div>
            );
          } else {
            return (
              <motion.div
                className="py-24 text-center bg-white rounded-2xl shadow-sm border border-gray-100"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    No hotels available
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    We couldn&apos;t find any hotels matching your criteria. Try
                    adjusting your filters or check back later.
                  </p>
                </div>
              </motion.div>
            );
          }
        })()}
      </motion.main>
    </>
  );
}

// Main export with Suspense for loading state
export default function Hotels() {
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-gray-50  pt-15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py sm:py-12 ">
        <Suspense fallback={<HotelsLoading />}>
          <HotelsList />
        </Suspense>
      </div>
    </div>
  );
}
