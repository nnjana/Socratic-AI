// src/routes/audioRoutes.js
import express from "express";
import multer from "multer";
import { getHesitationIndex } from "../services/affectiveService.js";
import { logStudentMastery } from "../services/dbService.js";
// import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// MULTER SETUP: Store audio file in RAM
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/test-audio",
//   verifyToken,
  upload.single("audio_file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No audio file uploaded!" });
      }

      console.log("Audio received in Route. Forwarding to FastAPI...");

      // 1. Get the metrics from Python (FastAPI)
      const analysisResult = await getHesitationIndex(
        req.file.buffer,
        req.file.originalname,
      );

      // 2. Extract the exact hesitation index number (e.g., 0.36)
      const hesitationIndex = analysisResult.hesitation_index;

      // 3. TRIGGER THE DATABASE SAVE!
      const realStudentId = req.user.id;
      const currentSessionId = req.body.session_id || "session_default";
      console.log(
        `Saving to DB for Student ID: ${realStudentId}, Session ID: ${currentSessionId}, Hesitation Index: ${hesitationIndex}`,
      );
      console.log("Attempting to save metrics to Supabase Database...");
      await logStudentMastery(realStudentId, currentSessionId, hesitationIndex);

      // 4. Send the final success response back to Postman
      res.json({
        status: "Success! Audio analyzed and saved to Database.",
        affective_data: analysisResult,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to analyze audio", details: error.message });
    }
  },
);

export default router;
