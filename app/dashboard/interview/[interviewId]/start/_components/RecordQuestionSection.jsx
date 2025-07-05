"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "../../../../../../components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { getChatSession } from "../../../../../../utils/GeminiAIModal";
import { db } from "../../../../../../utils/db";
import { UserAnswer } from "../../../../../../utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { motion } from "framer-motion";

function RecordQuestionSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [chat, setChat] = useState(null);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [recorded, setRecorded] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({ continuous: true, useLegacyResults: false });

  useEffect(() => {
    const initChatSession = async () => {
      try {
        const chatInstance = await getChatSession();
        setChat(chatInstance);
      } catch (error) {
        toast.error("Failed to initialize Gemini session.");
        console.error(error);
      }
    };
    initChatSession();
  }, []);

  useEffect(() => {
    results.forEach((result) => {
      setUserAnswer((prev) => prev + " " + result.transcript);
    });
  }, [results]);

  const StartStopRecording = () => {
    if (isRecording) {
      stopSpeechToText();
      setRecorded(true);
    } else {
      setUserAnswer("");
      setResults([]);
      setRecorded(false);
      startSpeechToText();
    }
  };

  useEffect(() => {
    if (!isRecording && recorded && userAnswer.length > 10) {
      UpdateUserAnswer();
    }
  }, [isRecording]);

  const UpdateUserAnswer = async () => {
    if (!chat || !userAnswer) return;
    setLoading(true);
    try {
      const prompt = `
        Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}
        User Answer: ${userAnswer}
        Based on the above question and user answer, give a rating and feedback (3–5 lines) for improvement in JSON format:
        {
          "rating": "...",
          "feedback": "..."
        }
      `;
      const result = await chat.sendMessage(prompt);
      const responseText = await result.response.text();
      const cleanedJSON = responseText.replace(/```json/, "").replace(/```/, "").trim();
      const jsonFeedback = JSON.parse(cleanedJSON);

      await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: jsonFeedback?.feedback,
        rating: jsonFeedback?.rating,
        userEmail: user?.primaryEmailAddress.emailAddress,
        createdAt: moment().format("DD-MM-YYYY"),
      });

      toast.success("✅ Answer & Feedback saved.");
      setUserAnswer("");
      setResults([]);
      setRecorded(false);
    } catch (error) {
      toast.error("⚠️ Error saving answer.");
      console.error("UpdateUserAnswer Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-center flex-col gap-6 px-4"
    >
      <div className="relative rounded-xl p-5 mt-10 w-full max-w-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-xl overflow-hidden">
        <Image
          src="/webcam3.png"
          alt="WebCAM"
          width={120}
          height={120}
          className="absolute -top-8 -left-8 opacity-20 z-0"
        />
        <div className="z-10 relative rounded-xl overflow-hidden border-2 border-gray-300">
          <Webcam
            mirrored
            style={{
              height: 280,
              width: "100%",
              borderRadius: "0.75rem",
              objectFit: "cover",
            }}
          />
        </div>
      </div>

      <Button
        disabled={loading}
        variant={isRecording ? "destructive" : "default"}
        onClick={StartStopRecording}
        className={`transition-all hover:scale-105 gap-2 text-base px-6 py-3 rounded-full shadow-md ${
          isRecording ? "animate-pulse" : ""
        }`}
      >
        {isRecording ? (
          <>
            <StopCircle className="w-5 h-5" />
            Stop Recording...
          </>
        ) : (
          <>
            <Mic className="w-5 h-5" />
            Record Answer
          </>
        )}
      </Button>

      {userAnswer && !isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg bg-muted p-4 rounded-xl text-center shadow-inner border"
        >
          <p className="text-muted-foreground text-sm leading-relaxed">
            <span className="font-semibold text-primary">Your Answer:</span> {userAnswer}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default RecordQuestionSection;
