"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseClient";
import Image from "next/image";
import React from "react";

export default function Login() {
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      console.log("Error signing in with Google:", error.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F7F8FC]">

      {/* LEFT SIDE — Figma Illustration */}
      <div className="hidden lg:flex flex-1 bg-white
      text-black flex-col items-center justify-center px-10 relative overflow-hidden">

        {/* Background bubbles / blur elements */}
        <div className="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl top-10 right-10" />
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl bottom-10 left-10" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          <Image
            src="/logo.png"
            alt="Logo"
            width={160}
            height={160}
            className="mb-4 opacity-90"
          />

          <h1 className="text-4xl font-bold mb-4">AI Recruiter</h1>
          <p className="text-lg opacity-90">
            Smart • Fast • AI-Driven Interviews
          </p>
        </div>

        <Image
          src="/dumy.jpg" // (replace with your own illustration)
          alt="Illustration"
          width={400}
          height={400}
          className="z-10 mt-8 opacity-90"
        />
      </div>

      {/* RIGHT SIDE — Login Card */}
      <div className="flex-1 flex items-center bg-blue-500 justify-center px-6">
        <div className="bg-white shadow-xl rounded-3xl w-full max-w-md p-10">

          {/* Logo (mobile only) */}
          <div className="lg:hidden flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="Logo"
              height={100}
              width={100}
            />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Welcome Back
          </h2>

          <p className="text-gray-600 mb-8">
            Sign in to continue using <span className="font-semibold">AI Recruiter</span>
          </p>

          {/* Google Login Button */}
          <Button
            onClick={signInWithGoogle}
            className="w-full py-6 text-md font-semibold flex items-center gap-3 bg-blue-600 text-white border hover:bg-gray-100"
            variant="outline"
          >
            <Image
              src="/google.png"
              alt="google"
              width={24}
              height={24}
            />

            Continue with Google
          </Button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Illustration Button (from your previous code) */}
          <Image
            src="/login.jpg"
            alt="Login"
            width={400}
            height={200}
            onClick={signInWithGoogle}
            className="w-full h-48 object-cover rounded-xl cursor-pointer border hover:scale-[1.02] transition-all"
          />

          <p className="text-center text-gray-600 mt-4">
            Continue using <span className="font-medium">Google Authentication</span>
          </p>

        </div>
      </div>
    </div>
  );
}
