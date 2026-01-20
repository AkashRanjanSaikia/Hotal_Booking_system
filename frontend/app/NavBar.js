"use client";

import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { UserContext } from "./context/usercontext";
import { DropdownMenuDemo } from "./DropdownMenu";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { user } = useContext(UserContext);
  const pathname = usePathname() || "";
  const hideLogin = pathname.startsWith("/auth/login");
  const hideSignup = pathname.startsWith("/auth/signup");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Hotels", href: "/hotels" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "pt-2" : "pt-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`
              relative flex items-center justify-between 
              rounded-full px-4 py-2 sm:px-6 sm:py-3
              transition-all duration-300
              ${
                scrolled
                  ? "bg-white/80 backdrop-blur-md shadow-lg border border-white/20"
                  : "bg-white/60 backdrop-blur-sm border border-white/10 shadow-sm"
              }
            `}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative overflow-hidden rounded-full ring-2 ring-white/50 shadow-sm transition-transform group-hover:scale-105 duration-300">
                <img
                  src="/logo2.png"
                  alt="CozyStay"
                  className="h-10 w-10 object-cover"
                />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                CozyStay
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="relative px-4 py-2 rounded-full text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200 group"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="absolute inset-0 bg-white shadow-sm rounded-full"
                        style={{ zIndex: -1 }}
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                    {!isActive && (
                      <span className="absolute inset-0 rounded-full bg-slate-100/50 scale-0 group-hover:scale-100 transition-transform duration-200 ease-out -z-10" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Auth / User Section */}
            <div className="hidden md:flex items-center gap-3">
              {!user ? (
                <>
                  {!hideLogin && (
                    <Link
                      href="/auth/login"
                      className="px-5 py-2.5 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all duration-200 border border-transparent hover:border-slate-200"
                    >
                      Login
                    </Link>
                  )}
                  {!hideSignup && (
                    <Link
                      href="/auth/signup"
                      className="px-5 py-2.5 rounded-full text-sm font-medium text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      Sign Up
                    </Link>
                  )}
                </>
              ) : (
                <div className="pl-2 border-l border-slate-200">
                  <DropdownMenuDemo />
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-full text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              aria-label="Toggle menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-20 left-4 right-4 z-40 md:hidden overflow-hidden"
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-4 space-y-4">
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                      pathname === link.href
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                {!user ? (
                  <>
                    {!hideLogin && (
                      <Link
                        href="/auth/login"
                        onClick={() => setOpen(false)}
                        className="w-full text-center py-3 rounded-xl text-slate-700 font-medium hover:bg-slate-50 border border-slate-200 transition-colors"
                      >
                        Login
                      </Link>
                    )}
                    {!hideSignup && (
                      <Link
                        href="/auth/signup"
                        onClick={() => setOpen(false)}
                        className="w-full text-center py-3 rounded-xl text-white font-medium bg-linear-to-r from-blue-600 to-indigo-600 shadow-lg"
                      >
                        Create Account
                      </Link>
                    )}
                  </>
                ) : (
                  <div className="flex justify-center pt-2">
                    <DropdownMenuDemo />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
