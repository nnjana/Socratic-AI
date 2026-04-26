import { createClient } from '@supabase/supabase-js';

// 1. Extract variables from process.env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role for backend writes

// 2. Safety check: Ensure the client doesn't attempt to initialize with undefined values
if (!supabaseUrl || !supabaseKey) {
    console.error("CRITICAL ERROR: Supabase URL or Service Role Key is missing in .env");
}

const supabase = createClient(supabaseUrl, supabaseKey);
export const logStudentMastery = async (userId, sessionId, hesitationIndex) => {
    try {
        const { data, error } = await supabase
            .from('mastery_logs')
            .insert([{ 
                user_id: userId, 
                session_id: sessionId, 
                hesitation_index: hesitationIndex 
            }]);
            
        if (error) throw error;
        console.log("saved to database !");
    } catch (error) {
        console.error("Error saving to database:", error.message);
    }
};