"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../../../../utils/db";
import { UserAnswer } from "../../../../../utils/schema";
import { eq } from "drizzle-orm";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../../../components/ui/collapsible";
import { ChevronsUpDown, Sparkles } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { useRouter } from "next/navigation";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

function Feedback({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    setIsLoading(true);
    try {
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, params.interviewId))
        .orderBy(UserAnswer.id);
      setFeedbackList(result);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate average rating
  const averageRating = feedbackList.length > 0 
    ? (feedbackList.reduce((sum, item) => sum + (item.rating || 0), 0) / feedbackList.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <AnimatePresence>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {feedbackList?.length === 0 ? (
            <div className="text-center py-16">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-6"
              >
                <Sparkles className="h-12 w-12 text-yellow-400" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-700 mb-2">
                No Feedback Yet
              </h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Complete an interview to receive detailed feedback on your performance.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-200 rounded-full opacity-20 blur-3xl"></div>
                
                <div className="relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="inline-block mb-4"
                  >
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      <span>Interview Analysis</span>
                    </div>
                  </motion.div>
                  
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    <Typewriter
                      words={["Congratulations!", "Great Job!", "Well Done!"]}
                      loop={false}
                      cursor
                      cursorStyle="|"
                      typeSpeed={70}
                      deleteSpeed={50}
                    />
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-3 rounded-lg border border-green-200">
                      <p className="text-sm text-gray-600">Questions Answered</p>
                      <p className="text-2xl font-bold text-emerald-600">{feedbackList.length}</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-100 to-cyan-100 px-4 py-3 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-600">Average Rating</p>
                      <p className="text-2xl font-bold text-cyan-600">{averageRating}/5</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 max-w-2xl">
                    Below is your detailed feedback for each interview question, including 
                    your answers, correct solutions, and expert suggestions for improvement.
                  </p>
                </div>
              </div>

              {/* Feedback Items */}
              <div className="space-y-4 max-w-6xl mx-auto">
                {feedbackList.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Collapsible>
                      <motion.div whileHover={{ scale: 1.005 }}>
                        <CollapsibleTrigger className="w-full text-left p-5 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-emerald-300 transition-all flex justify-between items-center group">
                          <div className="flex items-center gap-4">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${item.rating >= 4 ? 'bg-green-100 text-green-600' : item.rating >= 2 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                              <span className="font-bold">{item.rating}</span>
                            </div>
                            <h3 className="font-medium text-gray-800 group-hover:text-emerald-600 transition-colors">
                              {item.question}
                            </h3>
                          </div>
                          <ChevronsUpDown className="h-5 w-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                        </CollapsibleTrigger>
                      </motion.div>
                      
                      <CollapsibleContent>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-2 space-y-3"
                        >
                          {/* Your Answer */}
                          <div className="p-4 bg-white rounded-lg border border-red-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                              <h4 className="font-semibold text-gray-700">Your Answer</h4>
                            </div>
                            <p className="text-gray-600 pl-5">{item.userAns}</p>
                          </div>
                          
                          {/* Correct Answer */}
                          <div className="p-4 bg-white rounded-lg border border-green-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                              <h4 className="font-semibold text-gray-700">Model Answer</h4>
                            </div>
                            <p className="text-gray-600 pl-5">{item.correctAns}</p>
                          </div>
                          
                          {/* Feedback */}
                          <div className="p-4 bg-white rounded-lg border border-blue-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                              <h4 className="font-semibold text-gray-700">Expert Feedback</h4>
                            </div>
                            <p className="text-gray-600 pl-5">{item.feedback}</p>
                          </div>
                        </motion.div>
                      </CollapsibleContent>
                    </Collapsible>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* Return Button */}
          <motion.div 
            className="flex justify-center mt-10"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => router.replace("/dashboard")}
              className="flex gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-emerald-400/30 hover:shadow-emerald-500/50 transition-all"
            >
              <MdOutlineDashboardCustomize className="w-5 h-5" />
              Return to Dashboard
            </Button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Feedback;