"use client";

import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-25 min-h-screen">
      {/* Hero Section */}
      <section className="mb-12 sm:mb-16 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
          About WonderLust
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
          Your trusted companion in discovering extraordinary places to stay
          around the world.
        </p>
      </section>

      {/* Mission Section */}
      <section className="grid md:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 mb-12 sm:mb-16 items-center">
        <div className="space-y-4 sm:space-y-6 order-2 md:order-1">
          <h2 className="text-2xl sm:text-3xl font-semibold">Our Mission</h2>
          <p className="text-gray-600 text-base sm:text-lg">
            At WonderLust, we believe that every journey deserves extraordinary
            accommodation. Our mission is to connect travelers with unique and
            inspiring places to stay, creating unforgettable experiences that
            turn every trip into a story worth sharing.
          </p>
        </div>
        <div className="relative rounded-lg overflow-hidden order-1 md:order-2 h-[300px] sm:h-[400px] lg:h-[500px] w-full">
          <Image
            src="/about_page.jpg"
            alt="Scenic view of a luxury resort"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-12">
          What Sets Us Apart
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg bg-white shadow-md">
            <h3 className="text-xl font-semibold mb-4">Curated Selection</h3>
            <p className="text-gray-600">
              We carefully handpick every property to ensure exceptional quality
              and unique experiences.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-white shadow-md">
            <h3 className="text-xl font-semibold mb-4">Verified Reviews</h3>
            <p className="text-gray-600">
              Real reviews from real travelers help you make informed decisions.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-white shadow-md">
            <h3 className="text-xl font-semibold mb-4">24/7 Support</h3>
            <p className="text-gray-600">
              Our dedicated team is always here to assist you before, during,
              and after your stay.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="mb-16 bg-gray-50 py-12 px-4 rounded-lg">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Why Choose CozyStay
        </h2>
        <div className="max-w-3xl mx-auto space-y-6 text-center">
          <p className="text-gray-600">
            With years of experience in the travel industry, we understand what
            makes a stay truly special. Our platform is designed to make finding
            and booking your perfect accommodation simple and secure.
          </p>
          <ul className="text-gray-600 space-y-4">
            <li>✓ Best Price Guarantee</li>
            <li>✓ Secure Booking Process</li>
            <li>✓ Exceptional Customer Service</li>
            <li>✓ Carefully Vetted Properties</li>
          </ul>
        </div>
      </section>

      {/* Contact Section */}
      <section className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6">Get in Touch</h2>
        <p className="text-gray-600 mb-8">
          Have questions or feedback? We&apos;d love to hear from you.
        </p>
        <a
          href="mailto:contact@wonderlust.com"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
}
