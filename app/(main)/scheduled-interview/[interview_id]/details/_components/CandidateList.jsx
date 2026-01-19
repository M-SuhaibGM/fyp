"use client";
import moment from "moment/moment";
import React, { useEffect } from "react";
import CandidateFeedbackDialog from "./CandidateFeedbackDialog";
import { SearchX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function CandidateList({ candidate }) {
  let total = null;

  // Show skeleton loading when candidate is undefined or null
  if (!candidate) {
    return (
      <div>
        <Skeleton className="h-6 w-40 mb-5" />
        {[...Array(2)].map((_, index) => (
          <div
            key={index}
            className="p-5 flex justify-between gap-3 items-center bg-white rounded-lg mb-3"
          >
            <div className="flex items-center gap-5">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show empty state when candidate array is empty
  if (!candidate[0]) {
    return (
      <div className="p-2 border border-gray-200 rounded-xl w-full  mt-2 flex flex-col items-center justify-center text-gray-600 bg-white dark:bg-gray-800 dark:border-gray-700 mx-auto ">
        <div className="flex gap-1.5  justify-center items-center">
          <SearchX className="w-7 h-7" />
          <h3 className="text-lg font-medium dark:text-gray-200">No Candidate Records</h3>
        </div>
        <p className="text-sm text-gray-500 mt-1">Check your search terms or create a new interview.</p>
      </div>
    );
  }

  useEffect(() => {
    if (candidate?.[0]?.feedback?.feedback) {
      const feedback = candidate[0].feedback.feedback;
      total =
        (feedback.rating.technicalSkills || 0) +
        (feedback.rating.communication || 0) +
        (feedback.rating.problemSolving || 0) +
        (feedback.rating.experience || 0);
    }
  }, [candidate]);

  return (
    <div>
      <h2 className="font-bold my-5">Candidates ({candidate?.length})</h2>
      {candidate?.map((candidate, ind) => (
        <div
          key={ind}
          className="p-5 flex justify-between gap-3 items-center bg-white rounded-lg"
        >
          <div className="flex item-center gap-5">
            <h2 className="bg-primary p-2 px-4.5 font-bold text-white text-sm rounded-full">
              {candidate.userName[0].toUpperCase()}
            </h2>
            <div>
              <h2>{candidate?.userName.toUpperCase()}</h2>
              <h2 className="text-sm text-gray-500">
                Completed On:{" "}
                {moment(candidate?.created_at).format("DD MMM,YYYY")}
              </h2>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {/* <h2 className="text-sm text-green-500">{total / 4}/10</h2> */}
            <CandidateFeedbackDialog candidate={candidate} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default CandidateList;