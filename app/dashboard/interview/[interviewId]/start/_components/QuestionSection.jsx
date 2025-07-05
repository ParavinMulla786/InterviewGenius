"use client";

import { Button } from "@/components/ui/button";
import { Lightbulb, Volume2, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

function QuestionSection({ mockInterviewQuestion, activeQuestionIndex }) {
  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry! Your browser does not support text to speech");
    }
  };

  if (!mockInterviewQuestion || !mockInterviewQuestion.length) return null;

  return (
    <motion.div
      className="p-6 md:p-8 rounded-2xl shadow-xl bg-gradient-to-br from-white/80 to-white/95 backdrop-blur-lg border border-gray-200/80 transition-all duration-500 hover:shadow-2xl hover:border-gray-300 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-indigo-100/30 blur-xl"></div>
      <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-green-100/30 blur-xl"></div>
      
      {/* Question Navigation */}
      <div className="mb-6 relative">
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors" />
          </motion.div>
          
          <div className="overflow-x-auto py-2 scrollbar-hide flex-1">
            <div className="flex gap-2 min-w-max">
              {mockInterviewQuestion.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Go to Question ${index + 1}`}
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 relative
                    ${
                      activeQuestionIndex === index
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md ring-2 ring-green-200/80 hover:shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                    }`}
                >
                  {activeQuestionIndex === index && (
                    <motion.span
                      className="absolute -top-1 -right-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      <Sparkles className="w-3 h-3 fill-yellow-300 text-yellow-300" />
                    </motion.span>
                  )}
                  Q{index + 1}
                </motion.button>
              ))}
            </div>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors" />
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-100/80 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 relative"
            initial={{ width: 0 }}
            animate={{
              width: `${((activeQuestionIndex + 1) / mockInterviewQuestion.length) * 100}%`
            }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <div className="absolute right-0 top-0 w-1 h-full bg-white/50"></div>
          </motion.div>
        </div>
      </div>

      {/* Current Question */}
      <motion.div
        key={activeQuestionIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="relative">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 leading-relaxed tracking-wide bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
            {mockInterviewQuestion[activeQuestionIndex]?.question}
          </h2>
          <div className="absolute -left-6 top-0 h-full w-1 bg-gradient-to-b from-indigo-400/30 to-blue-400/30 rounded-full"></div>
        </div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-block"
        >
          <Button
            variant="secondary"
            className="gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 transition-all text-sm py-2 px-5 rounded-lg shadow-md hover:shadow-lg group"
            onClick={() =>
              textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)
            }
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                transition: { repeat: Infinity, duration: 2 }
              }}
            >
              <Volume2 className="w-4 h-4 group-hover:text-blue-200 transition-colors" />
            </motion.div>
            <span className="group-hover:translate-x-0.5 transition-transform">
              Listen to Question
            </span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Pro Tip Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-blue-200/80 bg-gradient-to-br from-blue-50/90 to-blue-100/70 p-4 md:p-5 shadow-inner hover:shadow-sm transition-all duration-300 relative overflow-hidden"
      >
        <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-blue-200/20 blur-lg"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-blue-700 font-medium mb-2 text-sm">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                y: [0, -3, 0],
                transition: { repeat: Infinity, repeatType: "mirror", duration: 3 }
              }}
              className="bg-yellow-100/80 p-1 rounded-full"
            >
              <Lightbulb className="w-5 h-5 fill-yellow-300 stroke-blue-600" />
            </motion.div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 font-semibold">
              Pro Tip
            </span>
          </div>
          <p className="text-sm text-blue-800/90 leading-relaxed">
            {process.env.NEXT_PUBLIC_QUESTION_NOTE ||
              "Take your time to think before answering. Structure your response clearly and confidently."}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default QuestionSection;