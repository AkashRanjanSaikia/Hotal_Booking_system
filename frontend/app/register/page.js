"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "../context/usercontext";

export default function Signup() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, setUser } = useContext(UserContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: businessName.trim(),
          phone: phone.trim(),
          hotelName: hotelName.trim(),
          city: city.trim(),
          id: user?.id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.user) {
          setUser?.(data.user);
        }
        router.push("/manager/dashboard");
      } else {
        setError(data?.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-700 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white/6 backdrop-blur-md border border-white/8 rounded-2xl p-6 sm:p-8 shadow-lg text-white">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <h2 className="text-2xl font-semibold">
                Register as a hotel manager
              </h2>
              <p className="text-sm text-white/80">
                Create your manager account to list and manage hotels
              </p>
            </div>
          </div>

          {error && (
            <div
              className="mb-4 rounded-md bg-red-900/30 border border-red-700/30 px-3 py-2 text-sm text-red-300"
              role="alert"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="businessName" className="sr-only">
                BusinessName
              </label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                placeholder="Business name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                className="w-full bg-white/8 border border-white/10 text-white placeholder-white/60 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="phone" className="sr-only">
                  Phone number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Contact number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full bg-white/8 border border-white/10 text-white placeholder-white/60 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label htmlFor="city" className="sr-only">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Hotel city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full bg-white/8 border border-white/10 text-white placeholder-white/60 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="hotelName" className="sr-only">
                Hotel name
              </label>
              <input
                id="hotelName"
                name="hotelName"
                type="text"
                placeholder="Primary hotel name"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                required
                className="w-full bg-white/8 border border-white/10 text-white placeholder-white/60 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 px-4 py-2.5 rounded-full text-white font-semibold disabled:opacity-60"
            >
              {loading ? (
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              ) : (
                "Register as manager"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
