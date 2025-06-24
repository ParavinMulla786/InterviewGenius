// utils/GeminiAIModal.js

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

// ✅ Load API key from .env
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Gemini API key not found in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

// ✅ Define the model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// ✅ Set generation behavior
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain", // Important for JSON extraction
};

// ✅ Export async session generator
export const getChatSession = async () => {
  try {
    const chat = await model.startChat({
      generationConfig,
      // Optional: customize safety settings here
    });

    return chat;
  } catch (error) {
    console.error("Failed to start Gemini chat session:", error);
    throw error;
  }
};
