// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';


// Import your new routes
import askRoutes from './src/routes/askRoutes.js';
import audioRoutes from './src/routes/audioRoutes.js';
import visionRoutes from './src/routes/visionRoutes.js';
import authRoutes from './src/routes/authRoutes.js';

import { verifyToken } from './src/middleware/authMiddleware.js';

const app = express();
app.use(cors());

// updated

// Global Middleware
app.use(express.json());

// Simple Health Check
console.log("updated")
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Modular Engine is running.' });
});

app.use('/api/auth', authRoutes);

app.use('/api', verifyToken);

// Mount the Routes
// All requests to /api/ask will now be handled by askRoutes.js
app.use('/api/ask', askRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/vision', visionRoutes);

// Start Server
const PORT = process.env.PORT || 3000;

app.get('/check-connection', async (req, res) => {
    try {
        // FastAPI URL-ai hit panrom (FastAPI port 5000-la run aagutha nu check panna)
        const response = await axios.get('http://localhost:5000/ping');
        
        // FastAPI kitta irunthu vantha badhil-ai return panrom
        res.json({
            status: "Success! Connection is working.",
            fastApiData: response.data
        });
    } catch (error) {
        // Connection fail aana intha error varum
        res.status(500).json({
            status: "Connection Failed!",
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is awake and listening on port ${PORT}`);
    if (!process.env.GEMINI_API_KEY) {
        console.warn('WARNING: Gemini API Key is missing from .env file!');
    } else {
        console.log('Security Check: API Key is loaded safely.');
    }
});

// check