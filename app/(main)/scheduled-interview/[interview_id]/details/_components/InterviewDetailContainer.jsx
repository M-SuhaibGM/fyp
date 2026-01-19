import { Calendar, Clock, DockIcon, Type } from "lucide-react";
import moment from "moment/moment";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function InterviewDetailContainer({ interviewDetail }) {
  // Show skeleton loading when interviewDetail is undefined or null
  if (!interviewDetail) {
    return (
      <div className="p-5 bg-white font-bold rounded-lg mt-5 lg:pr-52">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4 mb-4" />
        
        {/* Info section skeleton */}
        <div className="mt-4 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        
        </div>

      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="interview-details" className="border-none">
        <AccordionTrigger className="p-5 bg-white font-bold rounded-lg mt-5 lg:pr-52 hover:no-underline hover:bg-gray-50 transition-colors">
          <div className="flex justify-between items-center w-full text-left">
            <h2 className="text-lg font-bold">{interviewDetail?.jobPosition}</h2>
            <div className="flex items-center gap-4 text-sm font-normal text-gray-500">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{interviewDetail?.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{moment(interviewDetail?.created_at).format("DD MMM,YYYY")}</span>
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-5 pb-5 bg-white rounded-b-lg lg:pr-52">
          <div className=" flex items-center justify-between">
            <div>
              <h2 className="text-xs text-gray-500">Duration</h2>
              <h2 className="flex text-md gap-2 font-semibold items-center ">
                <Clock className="h-4 w-4" />
                {interviewDetail?.duration}
              </h2>
            </div>
            <div>
              <h2 className="text-xs text-gray-500">Created On</h2>
              <h2 className="flex text-md gap-2 font-semibold items-center ">
                <Calendar className="h-4 w-4" />
                {moment(interviewDetail?.created_at).format("DD MMM,YYYY")}
              </h2>
            </div>
            {interviewDetail?.type && (
              <div>
                <h2 className="text-xs text-gray-500">Type</h2>
                <h2 className="flex text-md gap-2 font-semibold items-center ">
                  <DockIcon className="h-4 w-4" />
                  {JSON.parse(interviewDetail?.type)[0]}
                </h2>
              </div>
            )}
          </div>
          <div className="mt-5">
            <h2 className="font-bold">Job Description</h2>
            <p className="text-gray-500 text-sm leading-6">
              {interviewDetail?.jobDescription}
            </p>
          </div>
          <div className="mt-5">
            <h2 className="font-bold">Interview Questions</h2>
            <div className="grid grid-col-2 gap-3 mt-3 text-gray-500">
              {interviewDetail?.questions.map((item, ind) => (
                <h2 className="text-xs" key={ind}>
                  {ind + 1}.{item?.question}
                </h2>
              ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default InterviewDetailContainer;