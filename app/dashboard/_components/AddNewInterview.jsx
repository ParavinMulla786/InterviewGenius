"use client";
import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { IoMail, IoSchool } from "react-icons/io5";
import { FaUser, FaBriefcase } from "react-icons/fa";
import { RiSuitcaseLine } from "react-icons/ri";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { getChatSession } from "../../../utils/GeminiAIModal";
import { db } from "../../../utils/db";
import { LoaderCircle } from "lucide-react";
import { MockInterview } from "../../../utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [JsonResponse, setJsonResponse] = useState([]);
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const InputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}. Provide ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions and answers in JSON format.`;

    try {
      const chatSession = await getChatSession();
      const result = await chatSession.sendMessage(InputPrompt);
      const rawResponse = await result.response.text();

      let jsonStart = rawResponse.indexOf("[");
      let jsonEnd = rawResponse.lastIndexOf("]");

      if (jsonStart !== -1 && jsonEnd !== -1) {
        let cleanedResponse = rawResponse.substring(jsonStart, jsonEnd + 1);
        try {
          const MockJsonResp = JSON.parse(cleanedResponse);
          setJsonResponse(MockJsonResp);

          const resp = await db
            .insert(MockInterview)
            .values({
              mockId: uuidv4(),
              jsonMockResp: cleanedResponse,
              jobPosition,
              jobDesc,
              jobExperience,
              createdBy: user?.primaryEmailAddress?.emailAddress,
              createdAt: moment().format("DD-MM-yyyy"),
            })
            .returning({ mockId: MockInterview.mockId });

          if (resp) {
            setOpenDialog(false);
            router.push("/dashboard/interview/" + resp[0]?.mockId);
          }
        } catch (parseError) {
          alert("⚠️ Failed to parse AI response. Try again.");
        }
      } else {
        alert("⚠️ Gemini response didn’t include valid JSON.");
      }
    } catch (error) {
      alert("❌ AI failed to generate questions. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-xl border"
      >
        {isSignedIn && (
          <div className="flex items-center space-x-6 mb-6 p-4 bg-white rounded-xl shadow-md">
            <div className="p-3 bg-blue-100 rounded-full animate-pulse">
              <FaUser className="text-blue-600 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-gray-800 font-semibold text-lg flex items-center gap-2">
                {user?.fullName}
                <span className="text-sm text-white bg-indigo-500 px-2 py-1 rounded-full shadow-sm">
                  Candidate
                </span>
              </h2>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <IoMail className="w-4 h-4 text-gray-500" />
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        )}

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            onClick={() => setOpenDialog(true)}
            className="w-full py-5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold text-lg rounded-xl shadow-lg"
          >
            <RiSuitcaseLine className="mr-2 w-5 h-5" />
            Start a New Interview +
          </Button>
        </motion.div>
      </motion.div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800">
              <FaBriefcase className="text-blue-600" />
              Create Interview Profile
            </DialogTitle>

            <DialogDescription className="mt-4">
              <form onSubmit={onSubmit}>
                <p className="text-gray-600 mb-6">
                  Fill in the job details to generate AI-based mock questions tailored for your role.
                </p>

                {/* JOB ROLE */}
                <div className="my-4">
                  <label className="block mb-2 font-medium text-gray-700">
                    <IoSchool className="inline mr-2 text-blue-500" />
                    Job Role / Position
                  </label>
                  <motion.div whileFocus={{ scale: 1.02 }}>
                    <Input
                      placeholder="e.g. Full Stack Developer"
                      required
                      onChange={(e) => setJobPosition(e.target.value)}
                      className="focus:ring-2 focus:ring-blue-300 transition-all rounded-xl px-4 py-3"
                    />
                  </motion.div>
                </div>

                {/* TECH STACK */}
                <div className="my-4">
                  <label className="block mb-2 font-medium text-gray-700">
                    <FaBriefcase className="inline mr-2 text-blue-500" />
                    Job Description / Tech Stack
                  </label>
                  <motion.div whileFocus={{ scale: 1.02 }}>
                    <Textarea
                      required
                      onChange={(e) => setJobDesc(e.target.value)}
                      placeholder="e.g. React, TypeScript, REST APIs, Docker..."
                      className="focus:ring-2 focus:ring-blue-300 transition-all rounded-xl px-4 py-3 min-h-[120px]"
                    />
                  </motion.div>
                </div>

                {/* EXPERIENCE */}
                <div className="my-4">
                  <label className="block mb-2 font-medium text-gray-700">
                    <FaUser className="inline mr-2 text-blue-500" />
                    Years of Experience
                  </label>
                  <motion.div whileFocus={{ scale: 1.02 }}>
                    <Input
                      type="number"
                      max="50"
                      required
                      onChange={(e) => setJobExperience(e.target.value)}
                      placeholder="e.g. 2"
                      className="focus:ring-2 focus:ring-blue-300 transition-all rounded-xl px-4 py-3"
                    />
                  </motion.div>
                </div>

                {/* BUTTONS */}
                <div className="flex justify-end mt-8 gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      onClick={() => setOpenDialog(false)}
                      type="button"
                      className="px-6 py-3 rounded-lg border-gray-300"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:from-green-700 hover:to-emerald-700"
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <LoaderCircle className="animate-spin mr-2" />
                          Generating...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <RiSuitcaseLine className="mr-2" />
                          Start Interview
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
