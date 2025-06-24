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

// Fallback Progress Bar component
const ProgressBar = ({ value }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className="bg-blue-600 h-2.5 rounded-full" 
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

// Fallback Skeleton component
const Skeleton = ({ className }) => {
  return (
    <div className={`bg-gray-200 animate-pulse rounded ${className}`}></div>
  );
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
    setActiveQuestionIndex(prev => {
      const nextIndex = prev + 1;
      window.scrollTo({ top: 0, behavior: "smooth" });
      return nextIndex;
    });
  };

  const handlePreviousQuestion = () => {
    setActiveQuestionIndex(prev => {
      const prevIndex = prev - 1;
      window.scrollTo({ top: 0, behavior: "smooth" });
      return prevIndex;
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
        <h2 className="text-xl font-semibold">Interview not found</h2>
        <p className="text-muted-foreground mt-2">
          The requested interview could not be loaded.
        </p>
      </div>
    );
  }

  const progressValue = ((activeQuestionIndex + 1) / mockInterviewQuestion.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">
            {interviewData?.title || "Mock Interview"}
          </h1>
          <span className="text-sm text-muted-foreground">
            Question {activeQuestionIndex + 1} of {mockInterviewQuestion.length}
          </span>
        </div>
        <ProgressBar value={progressValue} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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

      <div className="flex justify-between items-center">
        <div>
          {activeQuestionIndex > 0 && (
            <Button
              className="gap-1 transition-all hover:scale-105"
              onClick={handlePreviousQuestion}
              variant="outline"
            >
              <IoIosArrowBack className="w-4 h-4" />
              Previous
            </Button>
          )}
        </div>
        <div className="flex gap-4">
          {activeQuestionIndex !== mockInterviewQuestion.length - 1 ? (
            <Button
              onClick={handleNextQuestion}
              className="gap-1 transition-all hover:scale-105"
            >
              Next
              <MdNavigateNext className="w-5 h-5" />
            </Button>
          ) : (
            <Link
              href={"/dashboard/interview/" + interviewData?.mockId + "/feedback"}
              className="inline-flex"
            >
              <Button className="gap-2 bg-green-600 hover:bg-green-700 transition-all hover:scale-105">
                Finish Interview
                <FaFlagCheckered className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default StartInterview;