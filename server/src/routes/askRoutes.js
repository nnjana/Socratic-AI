// src/routes/askRoutes.js
import express from 'express';
import { validateInput } from '../middleware/guardrailMiddleware.js';
import { askQuestion } from '../controllers/askController.js';

const router = express.Router();

// Define the route. 
// Note: We just use '/' here because we will prefix it in server.js
router.post('/', validateInput, askQuestion);

export default router;