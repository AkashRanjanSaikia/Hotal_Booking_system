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
import { UserContext } from "./context/usercontext";

export function DropdownMenuDemo() {
  const { setUser } = useContext(UserContext);

  const handleLogout = async () => {
    await fetch("http://localhost:8000/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
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
          <DropdownMenuItem onClick={() => window.location.href = "/profile"}>Profile</DropdownMenuItem>
          <DropdownMenuItem>Your Bookings</DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.location.href = "/add-hotel"}>Add Your Hotel</DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.location.href = "/my-hotels"}>Your Hotels</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
