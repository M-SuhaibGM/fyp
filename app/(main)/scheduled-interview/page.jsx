"use client";
import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";
import React, { useEffect, useState } from "react";
import InterviewCard from "../dashboard/_components/interviewCard";
import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// 👈 Import the Skeleton component
import InterviewCardSkeleton from "../_components/InterviewCardSkeleton";

function ScheduledInterview() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 👈 New loading state

  useEffect(() => {
    // Only fetch data if the user object has been loaded
    if (user) {
      GetInterviewList();
    }
  }, [user]);

  const GetInterviewList = async () => {
    setIsLoading(true); // 👈 Start loading
    try {
      const { data, error } = await supabase
        .from("Interviews")
        .select("jobPosition,duration,interview_link,interview-feedback(userEmail)")
        .eq("userEmail", user?.email)
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching interviews:", error);
      }

      setInterviewList(data || []);
    } catch (e) {
      console.error("Fetch failed:", e);
      setInterviewList([]);
    } finally {
      setIsLoading(false); // 👈 Stop loading
    }
  };

  // --- CONDITIONAL CONTENT RENDERING ---
  let content;

  if (isLoading) {
    // State 1: Loading (Show 3 Skeletons)
    content = (
      <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
        <InterviewCardSkeleton />
        <InterviewCardSkeleton />
        <InterviewCardSkeleton />
      </div>
    );
  } else if (interviewList?.length === 0) {
    // State 2: No Interviews (Show 'Create Interview' prompt)
    content = (
      <div className="p-5 flex flex-col gap-3 items-center mt-5 border border-dashed rounded-lg">
        <Video className="h-10 w-10 text-primary" />
        <h2>You don't have any interview created!</h2>
        <Link href={"/dashboard/create-interview"}>
          <Button className={"cursor-pointer"}>+ Create New Interview</Button>
        </Link>
      </div>
    );
  } else {
    // State 3: Data Available (Show cards)
    content = (
      <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {interviewList?.map((interview, index) => (
          <InterviewCard
            interview={interview}
            // Use interview.id for a unique key if available
            key={interview.id || index}
            viewDetail={true}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h2 className=" font-bold text-2xl">
        Interview List with Candidate Report
      </h2>
      {content} {/* Render the calculated content based on state */}
    </div>
  );
}

export default ScheduledInterview;