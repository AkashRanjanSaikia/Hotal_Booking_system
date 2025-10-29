"use client";
import { useRouter } from "next/navigation";
import { MapPin, Star, Heart } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Card({ id, title, location, country, price, image }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleNavigate = () => {
    router.push(`/hotels/${id}`);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNavigate();
    }
  };
  
  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <motion.article
      role="button"
      tabIndex={0}
      aria-label={`View details for ${title}`}
      onClick={handleNavigate}
      onKeyDown={handleKey}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full border border-gray-100"
    >
      <div className="relative w-full h-52 sm:h-48 lg:h-60 bg-gray-100 overflow-hidden">
        {image ? (
          <motion.img
            src={image}
            alt={title}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-gray-200 mx-auto mb-3" />
              <span className="text-sm">No image available</span>
            </div>
          </div>
        )}

        <div className="absolute left-3 top-3 bg-white/90 backdrop-blur-sm text-xs text-gray-800 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-medium">{location}</span>
        </div>
        
        <button 
          onClick={handleFavorite}
          className="absolute right-3 top-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm transition-colors"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
          />
        </button>
        
        <div className="absolute left-3 bottom-3 bg-blue-600/90 backdrop-blur-sm text-xs text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
          <span className="font-medium">4.8</span>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col gap-2 sm:gap-3 flex-1">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 truncate">{title}</h3>
          <p className="mt-1 text-sm text-gray-500 flex items-center gap-1">
            <span>{country}</span>
          </p>
        </div>

        <div className="mt-auto pt-3 flex items-end justify-between border-t border-gray-100">
          <div className="text-sm font-medium text-gray-500">Starting from</div>
          <div className="text-xl font-bold text-blue-600">₹{price}</div>
        </div>
      </div>
    </motion.article>
  );
}
