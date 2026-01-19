"use client";
import { useUser } from "@/app/provider";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";        
import Link from "next/link";
import { supabase } from "@/services/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";

function WelcomeContainer() {
  const { user, setUser } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    const logout = async () => {
      await supabase.auth.signOut();
      setUser(null);
    };
    logout();
    router.push("/auth");
  };

  return (
    (user ? <div className="border bg-white p-5 rounded-2xl flex justify-between items-center">
      {/* LEFT SECTION */}
      <div>
        <h2 className="text-lg font-bold">Welcome Back, {user?.name}</h2>
        <h2 className="text-gray-500">AI-Driven Interviews, Hassle-Free Hiring</h2>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">

        {/* ⭐ CREDITS BUTTON */}
        <Link href={user?.credits === 0 ? "/billing" : "#"}>
          <Button
            variant="outline"
            className="flex items-center gap-2 cursor-pointer  text-white bg-blue-600"
          >
            <Image src="/dollar.png" height={3} width={3} alt="coin" className="h-5 w-5" />

            {user?.credits === 0 ? (
              "Add Credits"
            ) : (
              `${user?.credits} Credits`
            )}
          </Button>
        </Link>

        {/* PROFILE DROPDOWN */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Image
                src={user?.picture}
                alt="Avatar"
                width={40}
                height={40}
                className="rounded-full select-none cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-white font-bold bg-red-800"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div> : <div className="border bg-white p-5 rounded-2xl flex justify-between items-center">
      {/* LEFT SECTION */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />   {/* Welcome Back */}
        <Skeleton className="h-4 w-56" />   {/* Subtitle */}
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">
        {/* Credits Button */}
        <Skeleton className="h-10 w-28 rounded-md" />

        {/* Avatar */}
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
    )
  )
}

export default WelcomeContainer;
