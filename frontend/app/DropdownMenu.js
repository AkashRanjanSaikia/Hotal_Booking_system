"use client";

import { CircleUserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "./context/usercontext";

export function DropdownMenuDemo() {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const handleLogout = async () => {
    await fetch("http://localhost:8000/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-1.5 rounded-full border border-transparent hover:bg-slate-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
          <div className="bg-slate-100 p-1 rounded-full text-slate-600">
            <CircleUserRound className="w-5 h-5" />
          </div>
          {user?.name && (
            <span className="text-sm font-medium text-slate-700 pr-2 hidden sm:block">
              {user.name.split(" ")[0]}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/my-bookings")}>Your Bookings</DropdownMenuItem>
          {user?.role === "manager" && ( <>
            <DropdownMenuItem onClick={() => router.push("/manager/dashboard")}>Manager Dashboard</DropdownMenuItem>
            </>
          )}
          {user?.role === "user" && (
            <DropdownMenuItem onClick={() => router.push("/register")}>Register as Manager</DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => router.push("/my-favourites")}>Your Favourite Hotels</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
