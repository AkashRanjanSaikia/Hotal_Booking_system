"use client";
import { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import Image from "next/image";
import { UserContext } from "../../context/usercontext";
import { MapPin, Star, Wifi, Coffee, Waves, ChevronLeft, ChevronRight, Users, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function HotelDetail() {
  const { hotel } = useParams();
  const [hotelData, setHotelData] = useState(null);
  const [range, setRange] = useState({ from: null, to: null });
  const [loading, setLoading] = useState(false);
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { user } = useContext(UserContext);

  useEffect(() => {
    fetch(`http://localhost:8000/listings/${hotel}`)
      .then((res) => res.json())
      .then((data) => setHotelData(data))
      .catch((err) => console.error("Error fetching hotel:", err));
  }, [hotel]);

  // small UX: reset message when range changes
  useEffect(() => {
    if (message) setMessage("");
  }, [range]);

  // set main image and gallery images when hotelData loads
  useEffect(() => {
    if (hotelData) {
      // Set the main image
      const mainImg = hotelData.image?.url || "/placeholder.jpg";
      setMainImage(mainImg);
      
      // Create gallery images array
      // In a real app, you would get these from the API
      const images = [
        mainImg,
        "/bali.jpg",
        "/dubai.webp",
        "/tokyo.webp",
        "/newBg.jpg"
      ];
      setGalleryImages(images);
    }
  }, [hotelData]);
  
  // Handle gallery navigation
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
    setMainImage(galleryImages[currentImageIndex === 0 ? galleryImages.length - 1 : currentImageIndex - 1]);
  };
  
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
    setMainImage(galleryImages[currentImageIndex === galleryImages.length - 1 ? 0 : currentImageIndex + 1]);
  };

  const handleSelect = (newRange) => {
    if (
      newRange?.from &&
      newRange?.to &&
      newRange.from.getTime() === newRange.to.getTime()
    ) {
      setRange({ from: newRange.from, to: null });
    } else {
      setRange(newRange);
    }
  };

  // open confirmation modal (instead of immediate booking)
  const handleBooking = () => {
    if (!user) {
      alert("You must be logged in to book a hotel.");
      return;
    }

    if (!range.from || !range.to) {
      alert("Please select check-in and check-out dates");
      return;
    }

    setShowConfirm(true);
  };

  // performs actual POST
  const doBooking = async () => {
    setShowConfirm(false);
    setBookingInProgress(true);
    const bookingData = {
      hotelId: hotelData._id,
      userName: user?.name || "",
      userEmail: user?.email || "",
      checkIn: range.from,
      checkOut: range.to,
      guests,
    };

    try {
      const res = await fetch("http://localhost:8000/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Booking successful!");
      } else {
        setMessage(data.message || "Booking failed.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setMessage("Booking failed due to network error.");
    } finally {
      setBookingInProgress(false);
    }
  };

  if (!hotelData) {
    return <div className="p-10 text-center text-gray-700">Loading...</div>;
  }

  const checkIn =
    range.from &&
    range.from.toLocaleDateString("en-IN", { dateStyle: "medium" });
  const checkOut =
    range.to && range.to.toLocaleDateString("en-IN", { dateStyle: "medium" });
  const nights =
    range.from && range.to
      ? (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)
      : 0;

  return (
    <main className="relative">
      <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] rounded-xl overflow-hidden shadow-xl">
        {/* Hotel Background Image with Parallax Effect */}
        <div className="absolute inset-0 w-full h-full transform transition-transform duration-10000 hover:scale-105">
          <Image
            src={mainImage || "/placeholder.jpg"}
            alt={hotelData.title}
            fill
            quality={100}
            priority
            className="object-cover"
          />
        </div>

        {/* Enhanced Gradient Overlay for Better Text Visibility */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* Hotel Info Overlay with Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-0 left-0 w-full p-8 sm:p-12 lg:p-16"
        >
          <div className="inline-block px-3 py-1 mb-4 bg-blue-600/90 text-white text-sm rounded-full">
            Premium Stay
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
            {hotelData.title}
          </h1>

          <div className="mt-3 text-white text-base sm:text-lg flex items-center gap-3">
            <MapPin className="w-5 h-5 text-blue-400" />
            <span className="text-white/95 font-medium">
              {hotelData.location}, {hotelData.country}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-medium">{hotelData.rating || 4.5}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span className="text-white/90 text-sm">
                {hotelData.reviewsCount || 120} verified reviews
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowConfirm(false)}
          />
          <div className="relative bg-white rounded-lg p-6 w-11/12 max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Confirm your booking</h3>
            <p className="text-sm text-gray-600 mb-3">
              {hotelData.title} — {hotelData.location}
            </p>
            <div className="text-sm text-gray-700">
              <p>
                <strong>Dates:</strong> {checkIn} → {checkOut}
              </p>
              <p>
                <strong>Nights:</strong> {nights}
              </p>
              <p>
                <strong>Guests:</strong> {guests}
              </p>
              <p className="mt-2">
                <strong>Total:</strong>{" "}
                {formatCurrency(
                  nights * hotelData.price +
                    Math.ceil(0.1 * nights * hotelData.price)
                )}
              </p>
            </div>

            <div className="mt-4 flex gap-3 justify-end">
              <button
                className="px-4 py-2 rounded-md border"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md bg-blue-600 text-white"
                onClick={doBooking}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Gallery Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex justify-center gap-4">
        <button 
          onClick={handlePrevImage}
          className="p-3 rounded-full bg-white/90 shadow-lg hover:bg-blue-50 transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        
        {/* Image Indicators */}
        <div className="flex items-center gap-2">
          {galleryImages.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentImageIndex(index);
                setMainImage(galleryImages[index]);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentImageIndex ? 'bg-blue-600 scale-125' : 'bg-gray-300'}`}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
        
        <button 
          onClick={handleNextImage}
          className="p-3 rounded-full bg-white/90 shadow-lg hover:bg-blue-50 transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>
      
      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Main details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100"
        >
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-2"></span>
                About this luxury stay
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                {hotelData.description || "Experience unparalleled luxury and comfort at our premium accommodation. Nestled in a prime location, this property offers breathtaking views and easy access to local attractions. Perfect for both business travelers and vacationers seeking a memorable stay."}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Property highlights</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-2">
                {[
                  { icon: <Wifi className="w-5 h-5" />, name: "Free high-speed WiFi" },
                  { icon: <Coffee className="w-5 h-5" />, name: "Breakfast included" },
                  { icon: <Waves className="w-5 h-5" />, name: "Swimming pool" },
                  { icon: <Check className="w-5 h-5" />, name: "Air conditioning" },
                  { icon: <Check className="w-5 h-5" />, name: "Room service" },
                  { icon: <Check className="w-5 h-5" />, name: "Free parking" }
                ].map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 dark:bg-white/5 border border-blue-100/50 dark:border-white/10"
                  >
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-white/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      {amenity.icon}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden shadow-lg relative h-64">
                <Image
                  src={hotelData.image?.url || "/bali.jpg"}
                  alt="Hotel room"
                  fill
                  quality={90}
                  className="object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg relative h-64">
                <Image
                  src={hotelData.image?.url || "/dubai.webp"}
                  alt="Hotel amenities"
                  fill
                  quality={90}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Booking Card */}
        <motion.aside 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl flex flex-col lg:sticky lg:top-24 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">{hotelData.title}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" /> {hotelData.location}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(hotelData.price)}
              </div>
              <div className="text-sm text-gray-500">per night</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-800 dark:text-white">Your stay</h4>
              {range.from && range.to && (
                <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                  {nights} {nights === 1 ? 'night' : 'nights'}
                </span>
              )}
            </div>
            
            <div className="mt-4 w-full rounded-xl border border-blue-100 dark:border-blue-800 overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
              <Calendar
                mode="range"
                selected={range}
                onSelect={handleSelect}
                disabled={{ before: new Date() }}
                className={"w-full"}
              />
            </div>

            <div className="mt-4">
              <label className="font-medium text-gray-800 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4" /> Guests
              </label>
              <div className="mt-2 flex items-center gap-2 bg-white dark:bg-gray-700 p-1 rounded-lg border border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                >
                  -
                </button>
                <div className="flex-1 text-center font-medium">{guests}</div>
                <button
                  onClick={() => setGuests(Math.min(10, guests + 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
              <span>{formatCurrency(hotelData.price)} × {nights || 0} nights</span>
              <span>{formatCurrency((nights || 0) * hotelData.price)}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
              <span>Cleaning fee</span>
              <span>{formatCurrency(Math.ceil(0.05 * (nights || 0) * hotelData.price))}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
              <span>Service fee</span>
              <span>{formatCurrency(Math.ceil(0.05 * (nights || 0) * hotelData.price))}</span>
            </div>
            <div className="flex items-center justify-between text-lg font-bold text-gray-800 dark:text-white pt-3 mt-2 border-t border-gray-100 dark:border-gray-700">
              <span>Total</span>
              <span>
                {formatCurrency(
                  (nights || 0) * hotelData.price +
                    Math.ceil(0.1 * (nights || 0) * hotelData.price)
                )}
              </span>
            </div>
          </div>

          <button
            onClick={handleBooking}
            disabled={bookingInProgress || nights <= 0}
            className={`mt-6 px-6 py-4 rounded-xl w-full text-white font-medium text-lg shadow-lg transition-transform transform hover:scale-[1.02] ${
              bookingInProgress || nights <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            aria-disabled={bookingInProgress || nights <= 0}
            title={nights <= 0 ? "Select dates to enable" : "Reserve"}
          >
            {bookingInProgress ? "Processing..." : "Reserve now"}
          </button>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-lg text-sm ${
                message.includes("successful")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message}
            </motion.div>
          )}
          
          <div className="mt-6 text-center text-xs text-gray-500">
            You won't be charged yet
          </div>
        </motion.aside>
      </div>
    </main>
  );
}

// helpers and local state added below
function formatCurrency(amount) {
  if (!amount) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function renderStars(rating = 0) {
  const rounded = Math.round(rating || 0);
  const out = [];
  for (let i = 0; i < 5; i++) {
    out.push(
      <svg
        key={i}
        className={`inline-block h-5 w-5 ${
          i < rounded ? "text-yellow-400 fill-yellow-400" : "text-white/40"
        }`}
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.287 3.97c.3.922-.755 1.688-1.539 1.118L10 13.347l-3.376 2.455c-.784.57-1.839-.196-1.539-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.632 9.397c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.286-3.97z" />
      </svg>
    );
  }
  return out;
}
