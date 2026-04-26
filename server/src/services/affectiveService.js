// src/services/affectiveService.js
import axios from 'axios';
import FormData from 'form-data';

export const getHesitationIndex = async (audioBuffer, fileName) => {
    try {
        // 1. Create a FormData object to send the audio file
        const form = new FormData();
        form.append('file', audioBuffer, fileName);

        // 2. Send an HTTP POST Request to the FastAPI endpoint
        const fastApiUrl = `${process.env.FASTAPI_URL}/analyze-voice`;
        
        const response = await axios.post(fastApiUrl, form, {
            headers: {
                ...form.getHeaders(),
            },
        });

        // 3. Return the result received from FastAPI
        console.log("FastAPI Response:", response.data);
        return response.data; // This will contain hesitation_index and metrics

    } catch (error) {
        console.error("Error connecting to FastAPI:", error.message);
        throw error;
    }
};