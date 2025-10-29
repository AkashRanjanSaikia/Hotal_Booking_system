import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full">
      {/* Background with CSS */}
      <div className="bg-landing" aria-hidden="true" />

      {/* Gradient overlay for contrast */}
      <div className="fixed inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/70" />
      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center text-white px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 mt-8 sm:mt-10">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold leading-tight sm:leading-tight lg:leading-tight mb-3 sm:mb-4 drop-shadow-lg max-w-4xl">
          Find your perfect stay
        </h1>

        <p className="text-sm sm:text-base lg:text-lg mb-8 sm:mb-12 max-w-xl sm:max-w-2xl lg:max-w-3xl opacity-90">
          Discover top-rated hotels, compare prices, and book instantly —
          wherever your next adventure takes you.
        </p>

        {/* Glass search form */}
        <form
          action="/hotels"
          method="get"
          className="w-[95%] sm:w-[90%] lg:w-[80%] max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/10 transition-all duration-300"
        >
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
            {/* Destination Input */}
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="destination" className="sr-only">
                Destination
              </label>
              <input
                id="destination"
                name="q"
                type="search"
                placeholder="Where are you going?"
                className="w-full px-4 py-3 text-sm sm:text-base rounded-lg bg-white/10 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            {/* Date & Guest Inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1 w-full sm:w-auto">
              <div>
                <label htmlFor="checkin" className="sr-only">
                  Check-in
                </label>
                <input
                  id="checkin"
                  name="checkin"
                  type="date"
                  className="w-full px-3 py-3 text-sm sm:text-base rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>

              <div>
                <label htmlFor="checkout" className="sr-only">
                  Check-out
                </label>
                <input
                  id="checkout"
                  name="checkout"
                  type="date"
                  className="w-full px-3 py-3 text-sm sm:text-base rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>

              <div>
                <label htmlFor="guests" className="sr-only">
                  Guests
                </label>
                <select
                  id="guests"
                  name="guests"
                  className="w-full px-3 py-3 text-sm sm:text-base rounded-lg bg-white/10 text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                  <option value="1" className="text-black">
                    1 guest
                  </option>
                  <option value="2" className="text-black">
                    2 guests
                  </option>
                  <option value="3" className="text-black">
                    3 guests
                  </option>
                  <option value="4" className="text-black">
                    4 guests
                  </option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 w-full sm:w-auto rounded-full bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition text-white text-sm sm:text-base font-semibold shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.386a1 1 0 01-1.414 1.415l-4.386-4.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z"
                  clipRule="evenodd"
                />
              </svg>
              Search
            </button>
          </div>
        </form>

        {/* Popular destinations / cards */}
        <div className="mt-12 sm:mt-16 lg:mt-22 w-full max-w-[95vw] sm:max-w-2xl lg:max-w-6xl px-2 sm:px-0">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 lg:mb-12">
            Popular destinations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {[
              {
                city: "Tokyo",
                image: "/tokyo.webp",
                description: "Iconic white villages & stunning sunsets",
                price: 199,
                properties: 156,
              },
              {
                city: "Dubai",
                image: "/dubai.webp", // You can replace with your image
                description: "Luxury stays & desert adventures",
                price: 299,
                properties: 243,
              },
              {
                city: "Bali",
                image: "/bali.jpg", // You can replace with your image
                description: "Tropical villas & beachfront resorts",
                price: 129,
                properties: 189,
              },
            ].map((destination) => (
              <a
                key={destination.city}
                href={`/hotels?city=${encodeURIComponent(destination.city)}`}
                className="group block rounded-xl overflow-hidden shadow-lg relative bg-white/5 border border-white/6"
              >
                <div className="relative h-52 xs:h-48 sm:h-40 lg:h-44 w-full">
                  <Image
                    src={destination.image}
                    alt={`${destination.city} hotels and resorts`}
                    fill
                    sizes="(max-width: 640px) 95vw, (max-width: 1024px) 45vw, 30vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold mb-0.5 sm:mb-1">
                    {destination.city}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80">
                    {destination.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-white/60">
                      {destination.properties} properties
                    </span>
                    <span className="text-xs sm:text-sm font-medium">
                      From ${destination.price}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Secondary CTAs */}
        <div className="mt-8 sm:mt-20 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-8">
          <a
            href="/hotels"
            className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-full bg-blue-600 hover:bg-blue-700 transition text-center font-medium"
          >
            Browse hotels
          </a>
          <a
            href="/about"
            className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-full border border-white text-white hover:bg-white hover:text-black transition text-center font-medium"
          >
            Learn more
          </a>
        </div>
      </div>
    </main>
  );
}
