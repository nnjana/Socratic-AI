import { GoogleGenerativeAI } from '@google/generative-ai';
import { socraticPrompt } from '../models/socraticModel.js';
import { checkForDirectAnswer } from '../middleware/guardrailMiddleware.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash", 
    systemInstruction: socraticPrompt 
});

// 1. Our Temporary In-Memory Database
const sessionMemory = new Map();

export const generateSocraticHint = async (sessionId, question) => {
    // 2. Retrieve existing chat or start a new one
    let chat;
    if (sessionMemory.has(sessionId)) {
        chat = sessionMemory.get(sessionId);
    } else {
        chat = model.startChat({ history: [] });
        sessionMemory.set(sessionId, chat);
    }

    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
        // 3. Send the message to the ongoing chat session
        const result = await chat.sendMessage(question);
        const text = result.response.text();

        // 4. Pass the output through the Answer Guardrail
        const isDirectAnswer = checkForDirectAnswer(text);

        if (!isDirectAnswer) {
            return text; // Safe Socratic hint
        }

        console.warn(`Attempt ${attempts + 1}: Guardrail blocked a direct answer. Regenerating...`);
        attempts++;
    }

    return "I want to help you figure this out. What step are you stuck on?";
};

// Append this to the bottom of src/services/geminiService.js

export const generateSocraticVisionHint = async (imageBuffer, mimeType, question) => {
    try {
        // 1. Format the image buffer into a Base64 string for the Gemini API
        const imagePart = {
            inlineData: {
                data: imageBuffer.toString("base64"),
                mimeType: mimeType
            }
        };

        // 2. Send both the text prompt and the image part to the model
        const result = await model.generateContent([question, imagePart]);
        const text = result.response.text();
        
        return text;
    } catch (error) {
        console.error("Gemini Vision Error:", error.message);
        throw error;
    }
};