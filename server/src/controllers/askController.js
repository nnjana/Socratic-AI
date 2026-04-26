import { generateSocraticHint } from '../services/geminiService.js';

export const askQuestion = async (req, res) => {
    try {
        // Extract both the question and a unique session ID
        const { sessionId, question } = req.body;
        
        // Basic validation for the session ID
        if (!sessionId) {
            return res.status(400).json({ error: "A sessionId is required to maintain the conversation." });
        }

        // Send the data to the Gemini Service
        const socraticReply = await generateSocraticHint(sessionId, question);

        res.status(200).json({ reply: socraticReply });

    } catch (error) {
        console.error("AI Controller Error:", error);
        res.status(500).json({ error: "Socratica is currently resting. Please try again later." });
    }
};