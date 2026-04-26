// src/middleware/guardrailMiddleware.js

// 1. Input Guardrail: Checks if the request is valid before hitting the AI
export const validateInput = (req, res, next) => {
    const { question } = req.body;
    if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: "A valid question is required." });
    }
    next();
};

// 2. Output Guardrail (Basic Regex Filter): 
// If the AI accidentally generates a direct number (e.g., 144, 2.2), this will catch it.
// Later, you will upgrade this to a secondary LLM check.
export const checkForDirectAnswer = (aiResponseText) => {
    // Simple regex checking for standalone equals signs or final numerical solutions
    const suspiciousPattern = /(answer is \d+|=\s*\d+)/i;
    if (suspiciousPattern.test(aiResponseText)) {
        return true; // A direct answer was detected!
    }
    return false; // Safe
};