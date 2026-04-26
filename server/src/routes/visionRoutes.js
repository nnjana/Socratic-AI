// src/routes/visionRoutes.js
import express from 'express';
import multer from 'multer';
import { generateSocraticVisionHint } from '../services/geminiService.js';

const router = express.Router();

// Setup multer to store the uploaded image temporarily in RAM
const upload = multer({ storage: multer.memoryStorage() });

router.post('/test-vision', upload.single('image_file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image file uploaded!" });
        }

        // Use the student's question, or default to a standard Socratic prompt
        const prompt = req.body.question || "Look at the problem in this image and give me a Socratic hint on how to solve it step-by-step.";
        const mimeType = req.file.mimetype; // e.g., image/jpeg or image/png

        console.log("Image received! Sending to Gemini Vision...");

        const aiResponse = await generateSocraticVisionHint(req.file.buffer, mimeType, prompt);

        res.json({
            status: "Success!",
            ai_response: aiResponse
        });

    } catch (error) {
        res.status(500).json({ error: "Vision processing failed", details: error.message });
    }
});

export default router;