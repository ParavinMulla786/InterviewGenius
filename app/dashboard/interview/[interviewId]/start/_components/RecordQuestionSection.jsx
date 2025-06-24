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

function RecordQuestionSection({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) {
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
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

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

  // Append speech results
  useEffect(() => {
    results.forEach((result) => {
      setUserAnswer((prev) => prev + " " + result.transcript);
    });
  }, [results]);

  // Handle recording toggle
  const StartStopRecording = () => {
    if (isRecording) {
      stopSpeechToText();
      setRecorded(true); // mark recording finished
    } else {
      setUserAnswer(""); // clear previous answer
      setResults([]);
      setRecorded(false);
      startSpeechToText();
    }
  };

  // Submit after stopping recording manually
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

      const cleanedJSON = responseText
        .replace(/```json/, "")
        .replace(/```/, "")
        .trim();

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
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col justify-center items-center rounded-lg p-5 mt-20 bg-black relative">
        <Image
          src="/webcam3.png"
          alt="WebCAM"
          width={140}
          height={140}
          className="absolute"
        />
        <Webcam
          mirrored
          style={{
            height: 300,
            width: "100%",
            zIndex: 100,
          }}
        />
      </div>

      <Button
        disabled={loading}
        variant="outline"
        className="my-10"
        onClick={StartStopRecording}
      >
        {isRecording ? (
          <h2 className="text-red-500 flex animate-pulse items-center gap-2">
            <StopCircle /> Stop Recording...
          </h2>
        ) : (
          <h2 className="flex gap-2 items-center">
            <Mic /> Record Answer
          </h2>
        )}
      </Button>

      {/* Optional Debug or Manual Save Button */}
      {userAnswer && !isRecording && (
        <div className="text-center">
          <p className="text-muted-foreground px-4 max-w-lg">{userAnswer}</p>
          {/* Optional Manual Save Button */}
          {/* <Button onClick={UpdateUserAnswer} disabled={loading}>Submit</Button> */}
        </div>
      )}
    </div>
  );
}

export default RecordQuestionSection;
