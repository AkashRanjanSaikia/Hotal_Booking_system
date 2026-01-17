"use client";

import { Button } from "@/components/ui/button";
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
  console.log(user);
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
        <button className="p-2 rounded-full border border-gray-300 hover:bg-accent hover:text-accent-foreground transition">
          <CircleUserRound className="w-6 h-6" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="start">
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
