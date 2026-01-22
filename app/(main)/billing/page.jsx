"use client";
import { useUser } from "@/app/provider";
import { ArrowRight, CreditCard, Check, Zap, ShieldCheck, Trophy } from "lucide-react";
import React, { useEffect, useState } from "react";
import PayButton from "./_components/PayButton";

const plans = [
  {
    name: "Basic",
    price: "5",
    interviews: 20,
    icon: Zap,
    features: ["Basic interview templates", "Email support", "Standard AI Voice"],
  },
  {
    name: "Standard",
    price: "12",
    interviews: 50,
    icon: ShieldCheck,
    recommended: true,
    features: [
      "All interview templates",
      "Priority support",
      "Basic analytics",
      "Custom Interview Links",
    ],
  },
  {
    name: "Pro",
    price: "25",
    interviews: 120,
    icon: Trophy,
    features: ["All interview templates", "24/7 support", "Advanced analytics", "Team Collaboration"],
  },
];

function Billing() {
  const { user } = useUser();
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    if (user?.credits !== undefined) {
      setCredits(user.credits);
    }
  }, [user?.credits]);

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Billing & Credits</h1>
        <p className="text-slate-500 mt-1">Manage your usage, view your plan, and top up your credits.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: Your Current Usage */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-blue-100 shadow-sm relative overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full" />
            
            <h2 className="font-bold text-xl text-slate-800 mb-2 relative">Account Credits</h2>
            <p className="text-sm text-slate-500 mb-6 relative">Credits allow you to conduct AI-driven interviews.</p>

            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 mb-6">
              <div className="flex items-center gap-3 mb-2 opacity-80">
                <CreditCard className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Available Balance</span>
              </div>
              <div className="text-4xl font-black">{credits}</div>
              <p className="text-blue-100 text-xs mt-2 uppercase">Interviews Remaining</p>
            </div>

            <div className="space-y-4">
               <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-[65%]" />
               </div>
               <p className="text-[11px] text-slate-400 font-medium italic text-center">
                 Credits never expire. Top up anytime.
               </p>
            </div>
          </div>
        </div>

        {/* RIGHT: Purchase Plans */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-6 bg-white rounded-3xl border transition-all duration-300 ${
                plan.recommended 
                ? "border-blue-600 shadow-xl shadow-blue-100 ring-4 ring-blue-50" 
                : "border-slate-200 hover:border-blue-300 hover:shadow-md"
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${plan.recommended ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                    <plan.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-black text-slate-900">${plan.price}</span>
                  <span className="text-slate-400 text-sm font-medium">/pack</span>
                </div>
                <p className="text-blue-600 font-bold text-sm mt-1">
                  {plan.interviews} Interviews
                </p>
              </div>

              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                    <div className="mt-1 bg-blue-100 rounded-full p-0.5">
                      <Check className="w-3 h-3 text-blue-600 stroke-[3px]" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-4">
                <PayButton 
                  amount={plan.price} 
                  credits={plan.interviews}
                  className="w-full py-6 rounded-2xl font-bold transition-all shadow-md active:scale-95" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Billing;