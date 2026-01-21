"use client";
import React, { useContext, useEffect, useRef, useState, useMemo } from "react";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";
import axios from "axios";
import { supabase } from "@/services/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import InterviewInterface from "./_components/InterviewInterface";
import InterviewControls from "./_components/InterviewControls";

function StartInterview() {
  const { interviewInfo } = useContext(InterviewDataContext);
  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState();
  const vapi = useRef();
  const [hasInterviewStarted, setHasInterviewStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);
  const { interview_id } = useParams();
  const router = useRouter();

  const totalQuestions = interviewInfo?.interviewData?.questions?.length || 5;

  const currentQuestionIndex = useMemo(() => {
    if (!conversation) return 1;
    try {
      const logs = JSON.parse(conversation);
      const assistantMessages = logs.filter(msg => msg.role === 'assistant' || msg.role === 'bot');
      return Math.min(assistantMessages.length + 1, totalQuestions);
    } catch (e) { return 1; }
  }, [conversation, totalQuestions]);

  useEffect(() => {
    if (!interviewInfo || hasInterviewStarted) return;
    vapi.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);

    vapi.current.on("message", (message) => {
      if (message?.type === "transcript" || message?.conversation) {
        setConversation(JSON.stringify(message.conversation || message.transcript));
      }
    });

    vapi.current.on("call-start", () => setActiveUser(true));
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

    if (interviewInfo?.interviewData?.questions?.length) {
      startCall();
      setHasInterviewStarted(true);
    }
  }, [interviewInfo]);

  const startCall = () => {
    let questionList = interviewInfo?.interviewData?.questions.map((q, i) => `${i + 1}. ${q.question}`).join("\n");
    vapi.current.start({
      name: "AI Recruiter",
      firstMessage: `Hi ${interviewInfo?.userName}! Ready to start?`,
      transcriber: { provider: "deepgram", model: "nova-2", language: "en-US" },
      voice: { provider: "playht", voiceId: "jennifer" },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [{ role: "system", content: `You are an AI recruiter. Ask one by one: ${questionList}` }],
      },
    });
  };

  const GenerateFeedback = async () => {
    setLoading(true);
    const feedbackData = conversation ? (await axios.post("/api/ai-feedback", { conversation })).data : { error: "No record" };
    const parsed = typeof feedbackData === 'string' ? JSON.parse(feedbackData.replace(/```json|```/gi, "").trim()) : feedbackData;

    await supabase.from("interview-feedback").insert([{
      userName: interviewInfo?.userName,
      userEmail: interviewInfo?.userEmail,
      interview_id,
      feedback: parsed,
    }]);
    router.replace(`/interview/${interview_id}/completed`);
  };

  return (
    <div className="p-10 lg:px-48 xl:px-56">
      <InterviewInterface
        interviewInfo={interviewInfo}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        activeUser={activeUser}
        startTimer={startTimer}
        resetTimer={resetTimer}
      />

      <InterviewControls
        loading={loading}
        activeUser={activeUser}
        onStop={() => vapi.current?.stop()}
      />
    </div>
  );
}

export default StartInterview;