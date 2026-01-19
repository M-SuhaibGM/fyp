"use client";

import { useUser } from "@/app/provider";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseClient";
import { Video } from "lucide-react";
import React, { useEffect, useState } from "react";
import InterviewCard from "../dashboard/_components/interviewCard";
import Link from "next/link";
// Import the new Skeleton component
import InterviewCardSkeleton from "../_components/InterviewCardSkeleton";

function AllInterview() {
  const [interviewList, setInterviewList] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 👈 New loading state
  const { user } = useUser();

  useEffect(() => {
    // Only fetch data if the user object has been loaded
    if (user) {
      GetInterviewList();
    }
  }, [user]);

  const GetInterviewList = async () => {
    setIsLoading(true); // Start loading before fetching
    try {
      let { data: Interviews, error } = await supabase
        .from("Interviews")
        .select("jobPosition,duration,interview_link,interview-feedback(userEmail)")
        .eq("userEmail", user?.email)
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching interviews:", error);
      }

      setInterviewList(Interviews || []);
    } catch (e) {
      console.error("Fetch failed:", e);
      setInterviewList([]);
    } finally {
      setIsLoading(false); // Stop loading after fetch (success or failure)
    }
  };

  // --- RENDERING LOGIC ---
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
      <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
        {interviewList?.map((interview, index) => (
          // Note: Change 'key={index}' to a unique ID (interview.id) if possible
          <InterviewCard interview={interview} key={interview.id || index} />
        ))}
      </div>
    );
  }

  return (
    <div className="my-5">
      <h2 className="font-bold text-2xl">All Previously Created Interviews</h2>
      {content}
    </div>
  );
}

export default AllInterview;