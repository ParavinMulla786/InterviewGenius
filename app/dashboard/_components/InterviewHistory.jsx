"use client";

import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { db } from "../../../utils/db";
import { MockInterview } from "../../../utils/schema";
import { desc, eq } from "drizzle-orm";
import InterviewCard from "../_components/InterviewCard";
import { motion } from "framer-motion";
import { FaHistory } from "react-icons/fa";

function InterviewHistory() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    user && GetInterviewList();
  }, [user]);

  const GetInterviewList = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(
        eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress)
      )
      .orderBy(desc(MockInterview.id));

    setInterviewList(result);
  };

  const handleDeleteSuccess = (mockId) => {
    setInterviewList(
      interviewList.filter((interview) => interview.mockId !== mockId)
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative z-10 px-4 sm:px-10 py-12 bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-800 rounded-xl shadow-lg shadow-fuchsia-700/30 text-white"
    >
      {/* Glowing Animated Orb */}
      <motion.div
        className="absolute top-[-60px] left-[-60px] w-80 h-80 bg-purple-500/20 rounded-full blur-3xl z-0"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="text-center mb-10 relative z-10">
        <motion.h2
          className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 drop-shadow-md"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <span className="inline-flex items-center gap-3">
            <FaHistory className="text-cyan-300 animate-pulse" />
            Your Interview History
          </span>
        </motion.h2>

        <p className="mt-4 text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
         Reflect on your journey so far! Revisit your previous mock interviews to sharpen your confidence and upgrade your performance. Every session is a step closer to your dream job! 🚀
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {interviewList.length > 0 ? (
          interviewList.map((interview) => (
            <InterviewCard
              key={interview.mockId}
              interview={interview}
              onDeleteSuccess={handleDeleteSuccess}
            />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="col-span-full text-center text-cyan-200 mt-6 text-lg"
          >
            No interviews yet — let's change that! 🎤✨
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default InterviewHistory;
