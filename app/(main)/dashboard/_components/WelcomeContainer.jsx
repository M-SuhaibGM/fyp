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
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/services/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { CoinsIcon, LogOut, User, Zap } from "lucide-react";

function WelcomeContainer() {
  const { user, setUser } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/auth");
  };

  if (!user) {
    return (
      <div className="border border-blue-100 bg-white p-6 rounded-3xl flex justify-between items-center shadow-sm">
        <div className="space-y-3">
          <Skeleton className="h-6 w-48 bg-slate-100" />
          <Skeleton className="h-4 w-64 bg-slate-100" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-11 w-32 rounded-xl bg-slate-100" />
          <Skeleton className="h-11 w-11 rounded-full bg-slate-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="border border-blue-100 bg-gradient-to-r from-white to-blue-50/30 p-6 rounded-3xl flex justify-between items-center shadow-sm">
      {/* LEFT SECTION */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800">
            Welcome back, <span className="text-blue-600">{user?.name?.split(" ")[0]}!</span>
          </h2>
          <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
        </div>
        <p className="text-slate-500 text-sm md:text-base font-medium">
          Manage your AI interviews and track candidate progress.
        </p>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">
        {/* ⭐ CREDITS PILL */}
        <Link href={user?.credits === 0 ? "/billing" : "/billing"}>
          <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 bg-white border border-blue-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group">
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <CoinsIcon className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Credits</span>
              <span className="text-sm font-bold text-slate-700">
                {user?.credits === 0 ? "Refill" : user?.credits}
              </span>
            </div>
          </div>
        </Link>

        {/* PROFILE DROPDOWN */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="p-1 border-2 border-transparent hover:border-blue-600 rounded-full transition-all cursor-pointer">
              <Image
                src={user?.picture || "/avatar-placeholder.png"}
                alt="Avatar"
                width={44}
                height={44}
                className="rounded-full select-none shadow-md ring-2 ring-white"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-blue-50">
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold leading-none text-slate-800">{user?.name}</p>
                <p className="text-xs leading-none text-slate-500">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-blue-50" />
            <DropdownMenuItem className="flex items-center gap-2 p-3 rounded-xl cursor-pointer hover:bg-blue-50 text-slate-600">
              <User className="w-4 h-4" /> Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleLogout}
              className="flex items-center gap-2 p-3 rounded-xl cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50"
            >
              <LogOut className="w-4 h-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default WelcomeContainer;