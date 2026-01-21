"use client";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import { Loader2Icon, Mic, Phone, Timer, ListChecks } from "lucide-react";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState, useMemo } from "react";
import Vapi from "@vapi-ai/web";
import AlertConfirmation from "./_components/AlertConfirmation";
import { toast } from "sonner";
import TimerComponent from "./_components/TimerComponent";
import axios from "axios";
import { supabase } from "@/services/supabaseClient";
import { useParams, useRouter } from "next/navigation";

function StartInterview() {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState();
  const vapi = useRef();
  const [hasInterviewStarted, setHasInterviewStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);
  const { interview_id } = useParams();
  const router = useRouter();

  // --- PROGRESS CALCULATION ---
  // We estimate progress by counting how many times the assistant has spoken 
  // compared to the total questions provided in the context.
  const totalQuestions = interviewInfo?.interviewData?.questions?.length || 5;
  
  const currentQuestionIndex = useMemo(() => {
    if (!conversation) return 1;
    try {
      const logs = JSON.parse(conversation);
      // Filter messages where the assistant is speaking to count questions asked
      const assistantMessages = logs.filter(msg => msg.role === 'assistant' || msg.role === 'bot');
      return Math.min(assistantMessages.length, totalQuestions);
    } catch (e) {
      return 1;
    }
  }, [conversation, totalQuestions]);

  const progressPercentage = (currentQuestionIndex / totalQuestions) * 100;
  // ----------------------------

  useEffect(() => {
    if (!interviewInfo || hasInterviewStarted) return;
    const instanceVapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
    vapi.current = instanceVapi;

    const handleMessage = (message) => {
      // Vapi sends the full conversation object in certain message types
      if (message?.type === "transcript" || message?.conversation) {
        const convoString = JSON.stringify(message.conversation || message.transcript);
        setConversation(convoString);
      }
    };

    if (vapi.current) {
      vapi.current.on("message", handleMessage);
    }

    vapi.current.on("call-start", () => {
      setActiveUser(true);
    });

    vapi.current.on("speech-start", () => {
      toast.success("Interview has started!");
      setStartTimer(false);
      setResetTimer(true);
    });

    vapi.current.on("speech-end", () => {
      setStartTimer(true);
      setResetTimer(false);
    });

    vapi.current.on("call-end", () => {
      toast.success("Interview has ended!");
      setActiveUser(false);
      GenerateFeedback();
    });

    if (vapi.current && interviewInfo?.interviewData?.questions?.length) {
      startCall();
      setHasInterviewStarted(true);
    }
  }, [interviewInfo]);

  const GenerateFeedback = async () => {
    setLoading(true);
    if (conversation === undefined) {
      await supabase.from("interview-feedback").insert([{
        userName: interviewInfo?.userName,
        userEmail: interviewInfo?.userEmail,
        interview_id: interview_id,
        feedback: { error: "No conversation recorded" },
      }]);
      router.replace("/interview/" + interview_id + "/completed");
      return;
    } else {
      const result = await axios.post("/api/ai-feedback", { conversation });
      const Content = result.data;
      if (!Content) return;
      const FINAL_CONTENT = Content.replace(/```json/i, "").replace(/```/g, "").trim();
      let parsed = JSON.parse(FINAL_CONTENT);

      await supabase.from("interview-feedback").insert([{
        userName: interviewInfo?.userName,
        userEmail: interviewInfo?.userEmail,
        interview_id: interview_id,
        feedback: parsed,
      }]);
      router.replace("/interview/" + interview_id + "/completed");
    }
  };

  const startCall = () => {
    let questionList = interviewInfo?.interviewData?.questions
      .map((q, i) => `${i + 1}. ${q.question}`)
      .join("\n");

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage: `Hi ${interviewInfo?.userName}! Ready to kickstart your interview for ${interviewInfo?.interviewData?.jobPosition}? Let's begin!`,
      transcriber: { provider: "deepgram", model: "nova-2", language: "en-US" },
      voice: { provider: "playht", voiceId: "jennifer" },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [{
          role: "system",
          content: `You are an AI recruiter. Questions to ask: ${questionList}. Ask one at a time.`,
        }],
      },
    };
    vapi.current.start(assistantOptions);
  };

  const stopInterview = () => {
    if (vapi.current) {
      vapi.current.stop();
    }
  };

  return (
    <div className="p-10 lg:px-48 xl:px-56">
      <h2 className="font-bold text-xl flex justify-between items-center mb-5">
        AI Interview Session
        <span className="flex gap-2 items-center text-sm font-medium bg-slate-100 p-2 rounded-lg">
          <Timer className="h-4 w-4" />
          <TimerComponent startTimer={startTimer} resetTimer={resetTimer} />
        </span>
      </h2>

      {/* --- NEW PROGRESS SLIDER SECTION --- */}
      <div className="mb-8 bg-white p-5 rounded-xl border shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium flex items-center gap-2 text-gray-600">
            <ListChecks className="h-4 w-4" />
            Interview Progress
          </span>
          <span className="text-sm font-bold text-primary">
            Question {currentQuestionIndex} of {totalQuestions}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      {/* ----------------------------------- */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        <div className="bg-white h-[350px] rounded-lg border flex flex-col gap-3 items-center justify-center shadow-2xl relative">
          {!activeUser && (
            <span className="absolute inset-30 rounded-full bg-blue-100 opacity-80 animate-pulse"></span>
          )}
          <Image
            src={"/ai-model.jpg"}
            alt="AI-Image"
            width={120}
            height={120}
            className="w-[100px] h-[100px] object-cover rounded-full border-4 border-white shadow-lg"
          />
          <h2 className="font-semibold">AI Recruiter</h2>
        </div>

        <div className="bg-white h-[350px] rounded-lg border flex flex-col gap-3 items-center justify-center shadow-2xl">
          <div className="relative">
            {activeUser && (
              <span className="absolute inset-0 rounded-full bg-blue-500 opacity-20 animate-ping"></span>
            )}
            <h2 className="text-2xl bg-primary text-white p-3 rounded-full h-16 w-16 flex items-center justify-center">
              {interviewInfo?.userName ? interviewInfo.userName[0] : "?"}
            </h2>
          </div>
          <h2 className="font-medium text-lg">{interviewInfo?.userName}</h2>
        </div>
      </div>

      <div className="flex items-center gap-5 justify-center mt-8">
        <Mic className="h-14 w-14 p-4 bg-gray-100 text-gray-600 rounded-full cursor-not-allowed" />
        <AlertConfirmation stopInterview={stopInterview}>
          {!loading ? (
            <div className="h-14 w-14 p-4 bg-red-500 rounded-full text-white cursor-pointer hover:bg-red-600 transition-all flex items-center justify-center shadow-lg">
              <Phone onClick={() => stopInterview()} />
            </div>
          ) : (
            <Loader2Icon className="animate-spin text-primary" />
          )}
        </AlertConfirmation>
      </div>

      <h2 className="text-sm text-gray-400 text-center mt-5 italic">
        {activeUser ? "Interview in Progress..." : "Connecting to AI Recruiter..."}
      </h2>
    </div>
  );
}

export default StartInterview;