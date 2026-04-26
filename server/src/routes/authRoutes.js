// src/routes/authRoutes.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// 1. REGISTER ROUTE
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Hash the password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save student to Supabase
        const { data, error } = await supabase
            .from('students')
            .insert([{ email: email, password: hashedPassword }])
            .select('id, email')
            .single();

        if (error) throw error;

        // Generate JWT
        const token = jwt.sign({ id: data.id, email: data.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ message: "Student registered successfully", token, student: data });
    } catch (error) {
        res.status(500).json({ error: "Registration failed", details: error.message });
    }
});

// 2. LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find student by email
        const { data: student, error } = await supabase
            .from('students')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !student) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Compare the password with the hashed password in DB
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT
        const token = jwt.sign({ id: student.id, email: student.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: "Login failed", details: error.message });
    }
});

export default router;