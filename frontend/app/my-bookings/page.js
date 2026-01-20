"use client";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/usercontext";
import Link from "next/link";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/my-bookings`, {
          withCredentials: true
        });
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const now = new Date();
  // Filter bookings and sort by checkIn date
  const upcomingBookings = bookings
    .filter(b => new Date(b.checkIn) >= now)
    .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));
    
  const pastBookings = bookings
    .filter(b => new Date(b.checkIn) < now)
    .sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn)); // Most recent past booking first

  if (loading) return <div className="text-center py-20 text-xl">Loading your bookings...</div>;

  return (
    <section className="container mx-auto px-4 py-24 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-10">Your Bookings</h1>
      
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-green-500 rounded-full inline-block"></span>
          Upcoming Bookings
        </h2>
        {upcomingBookings.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-100">
            <p className="text-gray-500 text-lg">You have no upcoming bookings.</p>
            <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
              Explore hotels to book your next trip!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingBookings.map(booking => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-gray-400 rounded-full inline-block"></span>
          Past Bookings
        </h2>
        {pastBookings.length === 0 ? (
          <p className="text-gray-500 italic">No past bookings found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastBookings.map(booking => (
              <BookingCard key={booking._id} booking={booking} isPast={true} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function BookingCard({ booking, isPast }) {
  const hotel = booking.hotel;
  
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-xl duration-300 ${isPast ? 'opacity-80 hover:opacity-100' : ''}`}>
      {hotel && hotel.mainImage ? (
        <div className="relative h-48 w-full">
           <img 
            src={hotel.mainImage.url} 
            alt={hotel.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
             ${booking.totalPrice}
          </div>
        </div>
      ) : (
        <div className="h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Image Unavailable</span>
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1">
            {hotel ? hotel.title : "Hotel Info Unavailable"}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Check-in:</span>
            <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100">
                {new Date(booking.checkIn).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Check-out:</span>
            <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-100">
                {new Date(booking.checkOut).toLocaleDateString()}
            </span>
          </div>
        </div>

        {hotel && (
            <Link 
                href={`/hotels/${hotel._id}`} 
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
            >
                View Hotel Details
            </Link>
        )}
      </div>
    </div>
  );
}
