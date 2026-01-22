"use client"; // To allow framer-motion

import { motion } from "framer-motion";
import { Loader } from "lucide-react";

export default function Loading() {
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
