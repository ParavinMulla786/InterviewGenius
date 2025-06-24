"use client";

import { Button } from "@/components/ui/button";
import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

function QuestionSection({ mockInterviewQuestion, activeQuestionIndex }) {
  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.cancel(); // Stop previous
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry! Your browser does not support text to speech");
    }
  };

  if (!mockInterviewQuestion || !mockInterviewQuestion.length) return null;

  return (
    <motion.div
      className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Question Navigation */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-3 pb-2 min-w-max">
          {mockInterviewQuestion.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Go to Question ${index + 1}`}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2
                ${
                  activeQuestionIndex === index
                    ? "bg-gradient-to-r from-green-500 to-green-700 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              Q{index + 1}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Current Question */}
      <motion.div
        key={activeQuestionIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 leading-relaxed tracking-wide">
          {mockInterviewQuestion[activeQuestionIndex]?.question}
        </h2>

        <Button
          variant="secondary"
          className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-transform hover:scale-105"
          onClick={() =>
            textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)
          }
        >
          <Volume2 className="w-4 h-4" />
          Listen to Question
        </Button>
      </motion.div>

      {/* Pro Tip Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-inner"
      >
        <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
          <Lightbulb className="w-5 h-5" />
          Pro Tip
        </div>
        <p className="text-sm text-blue-700 leading-relaxed">
          {process.env.NEXT_PUBLIC_QUESTION_NOTE ||
            "Take your time to think before answering. Structure your response clearly and confidently."}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default QuestionSection;
