"use client";
import React, { useEffect, useState } from "react";
import { MockInterview } from "../../../../../utils/schema";
import { db } from "../../../../../utils/db";
import { eq } from "drizzle-orm";
import QuestionSection from "./_components/QuestionSection";
import RecordQuestionSection from "./_components/RecordQuestionSection";
import { Button } from "../../../../../components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { MdNavigateNext } from "react-icons/md";
import { FaFlagCheckered } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

// Custom animated progress bar
const ProgressBar = ({ value }) => {
  return (
    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.6 }}
      />
    </div>
  );
};

// Skeleton loader for fallback
const Skeleton = ({ className }) => {
  return <div className={`bg-gray-300 animate-pulse rounded ${className}`} />;
};

function StartInterview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    try {
      setIsLoading(true);
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));

      const jsonMockResp = JSON.parse(result[0].jsonMockResp);
      setMockInterviewQuestion(jsonMockResp);
      setInterviewData(result[0]);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    setActiveQuestionIndex((prev) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return prev + 1;
    });
  };

  const handlePreviousQuestion = () => {
    setActiveQuestionIndex((prev) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return prev - 1;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-10 w-1/2 mx-auto" />
          </div>
        </div>
        <div className="flex justify-end gap-6">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  if (!mockInterviewQuestion) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-red-600">Interview not found</h2>
        <p className="text-muted-foreground mt-2">
          The requested interview could not be loaded. Please try again later.
        </p>
      </div>
    );
  }

  const progressValue =
    ((activeQuestionIndex + 1) / mockInterviewQuestion.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-10"
    >
      {/* Header & Progress */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
          <h1 className="text-2xl font-bold text-indigo-700">
            {interviewData?.title || "Mock Interview"}
          </h1>
          <span className="text-sm text-gray-600 tracking-wide">
            Question {activeQuestionIndex + 1} of {mockInterviewQuestion.length}
          </span>
        </div>
        <ProgressBar value={progressValue} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <QuestionSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />
        <RecordQuestionSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4 border-t">
        {/* Back Button */}
        {activeQuestionIndex > 0 ? (
          <Button
            onClick={handlePreviousQuestion}
            variant="outline"
            className="gap-1 transition-transform hover:scale-105"
          >
            <IoIosArrowBack className="w-4 h-4" />
            Previous
          </Button>
        ) : (
          <div></div>
        )}

        {/* Next or Finish */}
        {activeQuestionIndex !== mockInterviewQuestion.length - 1 ? (
          <Button
            onClick={handleNextQuestion}
            className="gap-1 bg-indigo-600 text-white hover:bg-indigo-700 transition-transform hover:scale-105"
          >
            Next
            <MdNavigateNext className="w-5 h-5" />
          </Button>
        ) : (
          <Link
            href={`/dashboard/interview/${interviewData?.mockId}/feedback`}
            className="inline-flex"
          >
            <Button className="gap-2 bg-green-600 hover:bg-green-700 transition-transform hover:scale-105 text-white">
              Finish Interview
              <FaFlagCheckered className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>
    </motion.div>
  );
}

export default StartInterview;
