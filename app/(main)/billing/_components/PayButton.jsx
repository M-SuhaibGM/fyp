"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function PayButton({ amount, credits }) {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  // Check for success status from Stripe redirect
  useEffect(() => {
    const success = searchParams.get("success");
    const creditsToAdd = searchParams.get("credits");
    if (success && creditsToAdd && user?.email) {
      handleDatabaseUpdate(Number(creditsToAdd));
    }
  }, [searchParams, user]);

  const handleDatabaseUpdate = async (addedCredits) => {
    const currentCredits = Number(user?.credits || 0);
    console.log("Current Credits:", currentCredits);
    const { error } = await supabase
      .from("Users")
      .update({ credits: currentCredits + addedCredits })
      .eq("email", user?.email);

    if (!error) {
      toast.success("Credits added successfully!");
      router.replace("/billing"); // Clean up URL
      setTimeout(() => window.location.reload(), 1000);
    } else {
      toast.error("Error updating credits.");
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount,
          credits: credits,
          email: user?.email,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error("Payment initiation failed.");
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full bg-blue-600   cursor-pointer text-white py-2 rounded-md font-medium hover:bg-blue-700"
    >
      {loading ? <Loader2 className="animate-spin mr-2" /> : null}
      {loading ? "Processing..." : `Buy for $${amount}`}
    </Button>
  );
}

export default PayButton;  