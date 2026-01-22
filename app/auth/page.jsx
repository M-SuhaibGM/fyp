"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
          src="/dumy.webp" // (replace with your own illustration)
          alt="Illustration"
          width={400}
          height={400}
          className="z-10 mt-8 opacity-90"
        />
      </div>

      {/* RIGHT SIDE — Login Card */}
      <div className="flex-1 flex items-center bg-blue-600 justify-center px-6 min-h-screen">
        <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-10">

          {/* Logo (Visible on all to maintain branding) */}
          <div className="flex justify-center mb-6">
            <div className="bg-blue-50 p-3 rounded-2xl">
              <Image
                src="/logo.png"
                alt="Logo"
                height={60}
                width={60}
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-500">
              Sign in to your <span className="text-blue-600 font-semibold">AI Recruiter</span> account
            </p>
          </div>

          {/* Manual Login Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="name@company.com"
                  className="pl-4 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <button className="text-xs text-blue-600 hover:underline">Forgot password?</button>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                className="pl-4 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
              />
            </div>

            <Button className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98]">
              Sign In
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="px-4 text-gray-400 text-xs uppercase tracking-widest font-medium">or continue with</span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          {/* Google Login Button */}
          <Button
            onClick={signInWithGoogle}
            className="w-full py-6 text-md font-semibold flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all"
            variant="outline"
          >
            <Image
              src="/google.png"
              alt="google"
              width={20}
              height={20}
            />
            Google Account
          </Button>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account?{" "}
            <button className="text-blue-600 font-bold hover:underline">Create Account</button>
          </p>

        </div>
      </div>
    </div>
  );
}
