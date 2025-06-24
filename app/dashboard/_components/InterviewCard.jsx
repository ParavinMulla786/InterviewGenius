"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaGraduationCap, FaTrashAlt } from "react-icons/fa";
import { MdOutlineWork, MdFeedback } from "react-icons/md";
import { RiRocketFill } from "react-icons/ri";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { motion, AnimatePresence } from "framer-motion";

const InterviewCard = ({ interview, onDeleteSuccess }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [showError, setShowError] = React.useState(false);

  const handleStart = () => router.push(`/dashboard/interview/${interview?.mockId}`);
  const handleFeedback = () => router.push(`/dashboard/interview/${interview?.mockId}/feedback`);

  const handleDelete = async () => {
    const confirmation = window.confirm(`Are you sure you want to delete "${interview?.jobPosition}" interview?`);
    if (!confirmation) return;

    setIsDeleting(true);
    try {
      await db.delete(MockInterview).where(eq(MockInterview.mockId, interview?.mockId));
      setShowSuccess(true);
      if (onDeleteSuccess) onDeleteSuccess(interview?.mockId);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-[9999] bg-green-600 text-white px-4 py-2 rounded-md shadow-xl"
        >
          ✅ Interview deleted successfully!
        </motion.div>
      )}

      {showError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-[9999] bg-red-600 text-white px-4 py-2 rounded-md shadow-xl"
        >
          ❌ Failed to delete interview
        </motion.div>
      )}

      {/* 🌟 Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative p-[2px] rounded-2xl bg-gradient-to-r from-purple-700 via-fuchsia-700 to-pink-700 shadow-xl group overflow-hidden"
      >
        {/* Glow Ring */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-cyan-400/10 to-pink-400/10 blur-lg opacity-60 group-hover:opacity-80 transition duration-500 rounded-2xl z-0" />

        <div className="relative z-10 p-6 bg-gray-900/90 rounded-2xl backdrop-blur-lg">
          {/* Date Ribbon */}
          <div className="absolute -top-3 -right-8 rotate-45 bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-xs font-semibold px-8 py-1 shadow-md">
            <time dateTime={interview?.createdAt}>
              {new Date(interview?.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </time>
          </div>

          {/* Interview Info */}
          <div className="space-y-5">
            <div>
              <h3 className="text-white text-lg font-semibold flex items-center gap-2">
                <FaGraduationCap className="text-cyan-400" />
                <span className="bg-gradient-to-r from-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
                  Position
                </span>
              </h3>
              <p className="ml-7 text-white/90">{interview?.jobPosition}</p>
            </div>

            <div>
              <h3 className="text-white text-md font-semibold flex items-center gap-2">
                <MdOutlineWork className="text-purple-300" />
                <span className="bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  Experience
                </span>
              </h3>
              <p className="ml-7 text-white/90">{interview?.jobExperience} years</p>
            </div>

            {/* Start Interview */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <Button
                size="sm"
                className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold shadow-lg shadow-emerald-500/40"
                onClick={handleStart}
              >
                <RiRocketFill className="mr-2 animate-bounce" />
                Start Interview
              </Button>
            </motion.div>

            {/* Feedback & Delete */}
            <div className="flex justify-between gap-3 mt-4">
              <motion.div whileHover={{ scale: 1.03 }}>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full bg-gray-800 text-purple-300 hover:bg-purple-700 border border-gray-700 hover:border-purple-400 transition"
                  onClick={handleFeedback}
                >
                  <MdFeedback className="mr-1 text-lg" />
                  Feedback
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }}>
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-gray-800 text-red-400 hover:bg-red-900 hover:text-red-200 border border-gray-700 hover:border-red-500 transition p-2"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  ) : (
                    <FaTrashAlt className="text-sm" />
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InterviewCard;
