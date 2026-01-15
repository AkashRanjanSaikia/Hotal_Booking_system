"use client";
import Link from "next/link";
import { useContext, useState } from "react";
import { usePathname } from "next/navigation";
import { UserContext } from "./context/usercontext";
import { DropdownMenuDemo } from "./DropdownMenu";

export default function Navbar() {
  const { user } = useContext(UserContext);
  const pathname = usePathname() || "";
  const hideLogin = pathname.startsWith("/auth/login");
  const hideSignup = pathname.startsWith("/auth/signup");
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Hotels", href: "/hotels" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="fixed top-2 left-4 right-4 z-50">
      <div className="fixed top-0 w-full h-2 backdrop-blur-[2px] bg-black/5 z-50 "></div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm border border-white/10 rounded-2xl p-3 shadow-xl ring-1 ring-white/5">
          <Link href="/" className="flex items-center gap-3 text-slate-900">
            <span className="inline-flex items-center justify-center h-9 w-9 rounded-full  ring-1 ring-white/30">
              <img src="/logo2.png" alt="CozyStay" className="h-full w-auto rounded-full" />
            </span>
            <span className="font-bold text-lg">CozyStay</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-slate-700 hover:text-blue-600 transition font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop auth / user area */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                {!hideLogin && (
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                  >
                    Login
                  </Link>
                )}
                {!hideSignup && (
                  <Link
                    href="/auth/signup"
                    className="px-4 py-2 rounded-full bg-linear-to-r from-blue-500 to-indigo-600 text-white font-medium hover:opacity-95 transition"
                  >
                    Sign Up
                  </Link>
                )}
              </>
            ) : (
              <DropdownMenuDemo />
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden mt-3 bg-white/60 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-lg">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block text-slate-700 font-medium px-3 py-2 rounded-md hover:bg-slate-50 transition"
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-2 border-t border-white/8 flex flex-col gap-2">
                {!user ? (
                  <>
                    {!hideLogin && (
                      <Link
                        href="/auth/login"
                        onClick={() => setOpen(false)}
                        className="block text-slate-700 px-3 py-2 rounded-md border border-slate-200 text-center"
                      >
                        Login
                      </Link>
                    )}
                    {!hideSignup && (
                      <Link
                        href="/auth/signup"
                        onClick={() => setOpen(false)}
                        className="block text-white px-3 py-2 rounded-md bg-linear-to-r from-blue-500 to-indigo-600 text-center font-medium"
                      >
                        Sign Up
                      </Link>
                    )}
                  </>
                ) : (
                  <div>
                    {/* For mobile, show a simple link to profile or show the dropdown component if it supports mobile */}
                    <DropdownMenuDemo />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
